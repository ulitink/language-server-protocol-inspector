<template>
  <div class="msg-detail">
    <b>
      <a :href="msgLink" target="_blank">
        {{ this.item.msgType }}
      </a>
    </b>
    <pre ref="msg-body">
      <code>{{ JSON.stringify(item.arg, null, 2) }}</code>
    </pre>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import hljs from 'highlight.js'
import { LspItem } from '@/logParser/rawLogParser'

function cdpUrl(item: LspItem): string {
  const [domain, method] = item.msgType.split('.')
  const type = item.msgId ? 'method' : 'event';
  return `https://chromedevtools.github.io/devtools-protocol/tot/${domain}/#${type}-${method}`
}

function lspUrl(item: LspItem): string {
  const hash = item.msgType.split('/').join('_')
  return `https://microsoft.github.io/language-server-protocol/specification#${
    hash
  }`
}

export default Vue.extend({
  props: ['item'],
  computed: {
    msgLink() {
      const state = this.$store.state;
      const activeLogType = state.logs[state.activeLogIndex].type

      if (activeLogType == 'lsp') {
        return lspUrl(this.item)
      } else if (activeLogType == 'cdp') {
        return cdpUrl(this.item)
      }
    }
  },
  mounted() {
    hljs.highlightBlock(this.$refs['msg-body'])
  }
})
</script>

<style lang="scss" scoped>
@import '@/scss/global.scss';

.msg-detail {
  border: 1px solid #eee;
  max-width: 700px;
  margin: 20px;
  font-size: 13px;
  font-family: $monospace;
  text-align: left;

  b a {
    color: inherit;
  }
}

pre {
  text-align: left;
  max-width: 64rem;
  margin-left: auto;
  margin-right: auto;

  white-space: normal;
  text-align: left;
  overflow: auto;
  overflow-wrap: break-word;
  border-radius: 6px;
}
code {
  white-space: pre-wrap;
  font-family: $monospace;
  border-radius: 2px;
  padding: 0.2rem 0.3rem;
}
</style>
