<template>
  <section :style="customStyle">
    <slot></slot>
  </section>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  h: {
    type: String,
    default: '10rem',
  },
  w: {
    type: String,
    default: '10rem',
  },
  b: {
    type: String,
    default: 'none',
  },
  br: {
    type: String,
    default: '0rem',
  },
  bgc: {
    type: String,
    default: '#ffffff',
  },
  fs: {
    type: String,
    default: '1rem',
  },
  c: {
    type: String,
    default: '#202020',
  },
});

const customStyle = computed(() => ({
  display: 'flex',
  height: props.h,
  width: props.w,
  border: props.b,
  borderRadius: props.br,
  backgroundColor: props.bgc,
  fontSize: props.fs,
  color: props.c
}));
</script>
