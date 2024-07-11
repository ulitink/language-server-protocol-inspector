import { LspItem, MsgKind } from '@/logParser/rawLogParser'

const idToRequestTimestamp = {}


export function convertToLspItem(item: any, timestamp: number, ijKind: string): LspItem {
  if (item.type == "event") {
    return {
      msg: item.event,
      msgId: null,
      msgKind: ijKind,
      msgType: item.event,
      msgLatency: null,
      arg: item,
      time: formatTime(timestamp),
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
    }
  }
  if (typeof item.seq === "number" && item.type == 'request') {
    idToRequestTimestamp[item.seq] = timestamp
  }
  const id = item.type == 'request' ? item.seq : item.request_seq;

  return {
    msg: item.command,
    msgId: id,
    msgKind: convertMsgType(item.type) as MsgKind,
    msgType: item.command,
    msgLatency: item.type === 'response'
      ? `${timestamp - idToRequestTimestamp[id]}ms`
      : null,
    arg: item,
    time: formatTime(timestamp),
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
