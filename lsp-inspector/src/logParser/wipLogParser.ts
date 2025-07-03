import { isCRLF, LspItem, MsgKind } from '@/logParser/rawLogParser'
import { formatTime } from '@/logParser/jsonLogParser'

export default function parseWipLog(input: string): LspItem[] {
  const lineEnding = isCRLF(input) ? '\r\n' : '\n'
  const logs = input
    .split(lineEnding)
    .map(line => line.trim())
    .filter(line => line.length > 0);

  const idToRequest = new Map<number, CdpRequest>();

  let items: LspItem[] = [];
  for (const rawEntry of logs) {
    const entry = JSON.parse(rawEntry) as WipLogEntry;
    const tag = getTag(entry);
    if (tag === undefined) continue;
    const message = entry[tag];

    let kind: MsgKind;
    let args: any;
    let msgType: string;
    let msgId: string | undefined = undefined;
    let msg: string;
    let latency: string | undefined = undefined;
    if (isEvent(message)) {
      let processingTimeMs = entry.timestampProcessed - entry.timestamp;
      latency = `${processingTimeMs}ms`;
      kind = 'recv-notification';
      msg = `Received notification '${message.method}' in ${processingTimeMs}ms`
      args = message.params;
      msgType = message.method;
    } else if (isResponse(message)) {
      const request = idToRequest.get(message.id);
      if (request === undefined) {
        console.error(new Error(`Cannot find request with id ${message.id}`));
        continue;
      }
      kind = 'recv-response';
      msg = `Received response '${request.method} - (${message.id})'`
      args = message.result;
      msgType = request.method;
      msgId = message.id.toString();
    } else {
      idToRequest.set(message.id, message);
      kind = 'send-request';
      msg = `Sending request '${message.method} - (${message.id})'`
      args = message.params;
      msgType = message.method;
      msgId = message.id.toString();
    }

    items.push({
      msgKind: kind,
      msgType: msgType,
      msgId: msgId,
      arg: args,
      time: formatTime(Number(entry.timestamp)),
      msg: msg,
      msgLatency: latency,
    });
  }

  return items;
}

type Tag = "IN" | "OUT"

interface WipLogEntry {
  timestamp: number
  timestampProcessed: number | undefined
  [key: Tag]: CdpMessage
}

type CdpRequest = {
  id: number
  sessionId: string
  method: string
  params: any
}

type CdpResponse = {
  id: number
  sessionId: string
  result: any
}

type CdpEvent = {
  method: string
  params: any
}

function getTag(entry: WipLogEntry): Tag | undefined {
  if ('IN' in entry) return 'IN';
  if ('OUT' in entry) return 'OUT';
  console.error(new Error(`Unknown tag ${entry}`));
  return  undefined;
}

function isEvent(message: CdpMessage): message is CdpEvent {
  return !('id' in message);
}

function isResponse(message: CdpMessage): message is CdpResponse {
  return !('method' in message);
}

type CdpMessage = CdpRequest | CdpResponse | CdpEvent