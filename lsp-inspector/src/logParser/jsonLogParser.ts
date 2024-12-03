import { LspItem, MsgKind } from '@/logParser/rawLogParser'

export function convertToLspItem(item: any, timestamp: number, ijKind: string, prevLspItems: Array<LspItem>): LspItem {
  if (item.type == "event") {
    return {
      msg: item.event,
      msgId: null,
      msgKind: ijKind,
      msgType: item.event,
      msgLatency: null,
      arg: item,
      time: formatTime(timestamp),
      timestamp,
    }
  }
  if (!item.command) {
    return {
      msg: "[CUSTOM MESSAGE]",
      msgId: null,
      msgKind: ijKind,
      msgType: "[CUSTOM MESSAGE]",
      msgLatency: null,
      arg: item,
      time: formatTime(timestamp),
      timestamp,
    }
  }

  const id = item.type == 'request' ? item.seq : item.request_seq;

  let latency: string = null;
  if (item.type === 'response' && timestamp) {
    for (let i = prevLspItems.length - 1; i >= 0; i--) {
      let prevLspItem = prevLspItems[i];
      if (prevLspItem.msgKind.startsWith('recv-')) {
        latency = `${timestamp - prevLspItem.timestamp}ms \u2191`
        break
      }
      if (prevLspItem.msgId === id) {
        latency = `${timestamp - prevLspItem.timestamp}ms \u2196`
        break;
      }
    }
  }
  return {
    msg: item.command,
    msgId: id,
    msgKind: convertMsgType(item.type) as MsgKind,
    msgType: item.command,
    msgLatency: latency,
    arg: item,
    time: formatTime(timestamp),
    timestamp,
  }
}

export function formatTime(timestamp: number): string {
  return new Date(timestamp).toLocaleTimeString(undefined, {
    hour12: false,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    fractionalSecondDigits: 3
  })
}

function convertMsgType(msgType: string) {
  return msgType == 'request' ? 'send-request' :
      msgType == 'response' ? 'recv-response' :
          msgType
}
