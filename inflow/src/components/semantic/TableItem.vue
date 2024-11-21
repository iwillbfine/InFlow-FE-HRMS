<template>
  <GridItem class="table" :style="customStyle">
    <slot></slot>
  </GridItem>
</template>

<script setup>
import GridItem from './GridItem.vue';
import { computed } from 'vue';

const props = defineProps({
  br: {
    type: String,
    default: '0rem',
  },
  bgc: {
    type: String,
    default: 'transparent',
  },
  fs: {
    type: String,
    default: '100%',
  },
  gtc: {
    type: String,
    default: 'repeat(1, 1fr)',
  }
});

const customStyle = computed(() => ({
  borderRadius: props.br,
  backgroundColor: props.bgc,
  fontSize: props.fs,
  gridTemplateColumns: props.gtc,
}));
</script>

<style scoped>
.table {
  position: relative;
  grid-gap: 0;
  border-top: 1px solid #dadada !important;
  border-left: 1px solid #dadada !important;
  overflow: hidden; /* 추가: overflow 숨기기 */
}

/* 테두리 둥글게 보이도록 추가 설정 */
.table::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border-radius: inherit; /* 부모 요소의 border-radius 상속 */
}
</style>
