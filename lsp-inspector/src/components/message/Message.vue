<template>
  <span class="msg" :class="[{ current: isCurrent }, item.msgKind]" :id="messageId" @mouseover="updateCurrent">
    <span @click="toggleArg" class="msg-clickable-area">
      <span>
        <font-awesome-icon class="fa-icon" icon="comment" v-if="item.msgKind === 'send-request'" />
        <font-awesome-icon class="fa-icon" icon="comment-alt" v-if="item.msgKind === 'send-notification'" />
        <font-awesome-icon class="fa-icon" icon="comment" v-if="item.msgKind === 'send-response'" />
      </span>

      <span class="msg-type" v-if="isLeft">
        {{ item.msgType }}
      </span>

      <span class="msg-timestamp">{{ timestampOrLatency }}</span>

      <span class="msg-type" v-if="!isLeft">
        {{ item.msgType }}
      </span>

      <span>
        <font-awesome-icon class="fa-icon" icon="comment" transform="flip-h" v-if="item.msgKind === 'recv-response'" />
        <font-awesome-icon class="fa-icon" icon="comment-alt" tranform="flip-h" v-if="item.msgKind === 'recv-notification'" />
        <font-awesome-icon class="fa-icon" icon="comment" transform="flip-h" v-if="item.msgKind === 'recv-request'" />
      </span>
    </span>

    <span class="msg-goto" @click="goToRequestOrResponse">
        <font-awesome-icon class="fa-icon" icon="arrow-right" v-if="item.msgKind === 'send-request'"/>
        <font-awesome-icon class="fa-icon" icon="arrow-left" v-if="item.msgKind === 'recv-response'"/>
    </span>

    <message-detail :item="item" v-if="this.expanded" @click="noop"></message-detail>
  </span>
</template>


<script lang="ts">
import Vue from 'vue'
import FontAwesomeIcon from '@fortawesome/vue-fontawesome'
import MessageDetail from '@/components/message/MessageDetail.vue'

export default Vue.extend({
  name: 'message',
  components: {
    FontAwesomeIcon,
    MessageDetail
  },
  props: ['item'],
  data() {
    return {
      expanded: false
    }
  },
  computed: {
    messageId() {
      if (this.item.msgKind === 'recv-notification' || this.item.msgKind === 'send-notification') {
        return undefined;
      }
      return `${this.item.msgKind}-${this.item.msgId}`;
    },
    isLeft() {
      return (
        this.item.msgKind === 'send-request' ||
        this.item.msgKind === 'send-notification' ||
        this.item.msgKind === 'send-response'
      )
    },
    timestampOrLatency() {
      let time = this.item.time;
      if (this.item.msgLatency && this.item.msgKind === 'recv-response' || this.item.msgKind === 'send-response' || this.item.msgKind === 'recv-notification') {
        time += " (" + this.item.msgLatency + ")";
      }
      return time;
    },
    isCurrent() {
      return this.item.msgId === this.$store.state.current
    }
  },
  methods: {
    toggleArg() {
      this.expanded = !this.expanded
    },
    updateCurrent() {
      if (this.item.msgId) {
        this.$store.commit('updateCurrent', this.item.msgId)
      } else {
        this.$store.commit('updateCurrent', -1)
      }
    },
    goToRequestOrResponse() {
      const matchingMessageKind = this.item.msgKind === 'send-request' ? 'recv-response' : 'send-request';
      const messageId = `${matchingMessageKind}-${this.item.msgId}`;
      const element = document.getElementById(messageId);
      if (!element) {
        return;
      }
      element.scrollIntoView({ block: 'start', behavior: 'smooth' });
    },
    noop() {}
  }
})
</script>

<style lang="scss" scoped>
@import '@/scss/global.scss';

.msg {
  font-family: $monospace;
  font-weight: 400;
  font-size: 13px;
  border: 1px solid #ddd;
  border-radius: 4px;
  margin-bottom: 20px;
  padding: 10px 20px;
}
.msg-timestamp {
  color: #e8a1a1;
  font-size: 11px;
}

.msg-goto {
  margin-left: 10px;
  cursor: pointer;
}

.send-request,
.send-notification,
.send-response {
  align-self: flex-start;
  text-align: left;
}
.recv-response,
.recv-notification,
.recv-request {
  align-self: flex-end;
  text-align: right;
}

.send-request,
.recv-response {
  color: #1c791cbd;
}
.send-notification,
.recv-notification {
  color: #bb9911de;
}
.recv-request,
.send-response {
  color: #356fa5f7;
}

/**
 * Hover / Expand
 */

.msg {
  @include transition(all);
}
.msg:hover {
  background-color: rgba(221, 221, 221, 0.5);
  border-color: $active-bg;
}
.msg.current {
  background-color: rgba(221, 221, 221, 0.5);
  border-color: $active-bg;
}
.msg-clickable-area {
  cursor: pointer;
}
</style>
