<template>
  <div>
    <h2>Logs</h2>
    <div class="logs">
      <log v-for="(log, i) in $store.state.logs" :key="i" :index="i"></log>
    </div>
    <log-picker :file-handler="handleLogFile" icon="upload" id="lsp-log">Upload LSP log</log-picker>
    <log-picker :file-handler="handleWipLogFile" icon="bug" id="wip-log">Upload debugger log</log-picker>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Log from '@/components/sidebar/Log.vue'
import LogPicker from '@/components/sidebar/LogPicker.vue'
import FontAwesomeIcon from '@fortawesome/vue-fontawesome'

export default Vue.extend({
  components: {
    Log,
    LogPicker,
    FontAwesomeIcon
  },
  methods: {
    handleLogFile(name: string, content: string) {
      const store = this.$store
      store.commit('addLog', {
        name,
        rawLog: content
      })
    },
    handleWipLogFile(name: string, content: string) {
      const store = this.$store
      store.commit('addDebuggerLog', {
        name,
        rawLog: content
      })
    },
    handleFiles(e) {
      const reader = new FileReader()
      const store = this.$store
      reader.onload = () => {
        store.commit('updateLog', reader.result)
      }

      reader.readAsText(e.target.files[0])
    }
  }
})
</script>

<style lang="scss" scoped>
@import '@/scss/global.scss';

h2 {
  margin-top: 0;
  font-size: 1.5rem;
}

.logs {
  border-bottom: 1px solid $active-bg;
  margin-bottom: 10px;
  cursor: pointer;
}
</style>
