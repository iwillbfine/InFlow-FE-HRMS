<template>
  <FlexItem class="tc" :style="customStyle">
    <slot></slot>
  </FlexItem>
</template>

<script setup>
import FlexItem from './FlexItem.vue';
import { computed } from 'vue';

const props = defineProps({
  bgc: {
    type: String,
    default: '#fff',
  },
  fs: {
    type: String,
    default: '100%',
  },
  fw: {
    type: String,
    default: '400',
  },
  maxh: {
    type: String,
    default: '',
  },
  th: {
    type: Boolean,
    default: false,
  },
  gc: {
    type: String,
    default: '',
  },
  gr: {
    type: String,
    default: '',
  }
});

const customStyle = computed(() => {
  const baseStyle = {
    backgroundColor: props.bgc,
    fontSize: props.fs,
    fontWeight: props.fw,
    gridColumn: props.gc,
    gridRow: props.gr,
  };

  // th가 true일 경우 추가되는 스타일
  if (props.th) {
    return {
      ...baseStyle,
      backgroundColor: '#f8f8f8',
      justifyContent: 'center',
      alignContent: 'center',
      fontWeight: '700',
    };
  }

  return baseStyle;
});
</script>

<style scoped>
.tc {
  border-right: 1px solid #dadada !important;
  border-bottom: 1px solid #dadada !important;
  align-items: center;
  padding: 1rem;
}
</style>
