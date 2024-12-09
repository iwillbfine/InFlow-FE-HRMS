<template>
  <article :style="customStyle">
    <slot></slot>
  </article>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  h: {
    type: String,
    default: 'auto',
  },
  w: {
    type: String,
    default: 'auto',
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
    default: 'transparent',
  },
  fs: {
    type: String,
    default: '100%',
  },
  fw: {
    type: String,
    default: 'inherit',
  },
  c: {
    type: String,
    default: 'inherit',
  },
  fld: {
    type: String,
    default: 'inherit',
  },
  maxh: {
    type: String,
    default: '',
  },
  minh: {
    type: String,
    default: '',
  },
  maxw: {
    type: String,
    default: '',
  },
  minw: {
    type: String,
    default: '',
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
  fontWeight: props.fw,
  color: props.c,
  flexDirection: props.fld,
  maxHeight: props.maxh,
  minHeight: props.minh,
  maxWidth: props.maxw,
  minWidth: props.minw,
}));
</script>
