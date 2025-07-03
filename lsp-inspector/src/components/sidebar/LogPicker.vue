<template>
  <div class="log-picker">
    <label :for="id">
      <font-awesome-icon class="fa-icon" :icon="icon" />
      <slot></slot>
    </label>
    <input type="file" :id="id" @change="handleFiles">
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import FontAwesomeIcon from '@fortawesome/vue-fontawesome'

export default Vue.extend({
  components: {
    FontAwesomeIcon
  },
  props: {
    id: {
      type: String,
      required: true
    },
    icon: {
      type: String,
      required: true
    },
    fileHandler: {
      type: Function,
      required: true
    }
  },
  methods: {
    handleFiles(e) {
      const reader = new FileReader()
      const name = e.target.files[0].name

      reader.onload = () => {
        this.fileHandler(name, reader.result);
      }

      reader.readAsText(e.target.files[0])
    }
  }
})
</script>

<style lang="scss" scoped>
@import '@/scss/global.scss';

.log-picker {
  margin-top: 6px;
  label {
    display: block;
    padding: 8px 10px;
    cursor: pointer;

    @include transition(background-color);

    .fa-icon {
      width: 12px;
      margin-right: 8px;
    }
  }

  &:hover {
    label {
      background-color: $hover-bg;
    }
  }
}
input {
  width: 0.1px;
  height: 0.1px;
  opacity: 0;
  overflow: hidden;
  position: absolute;
  z-index: -1;
}
</style>
