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
    default: '0.6rem',
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
  },
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
  border: 0.5px solid #dadada !important;
}
</style>
