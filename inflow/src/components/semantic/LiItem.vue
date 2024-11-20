<template>
  <li
    :style="[customStyle, dynamicStyle]"
    :class="{ active: props.active }"
    @mouseover="hovering = true"
    @mouseleave="hovering = false"
  >
    <slot></slot>
  </li>
</template>

<script setup>
import { computed, ref } from 'vue';

const props = defineProps({
  h: { type: String, default: 'auto' },
  w: { type: String, default: 'auto' },
  b: { type: String, default: 'none' },
  br: { type: String, default: '0rem' },
  bgc: { type: String, default: 'transparent' },
  fs: { type: String, default: '100%' },
  fw: { type: String, default: 'inherit' },
  c: { type: String, default: 'inherit' },
  fld: { type: String, default: 'inherit' },
  maxh: { type: String, default: '' },
  minh: { type: String, default: '' },
  maxw: { type: String, default: '' },
  minw: { type: String, default: '' },
  hc: { type: String, default: 'inherit' }, // hover color
  hbgc: { type: String, default: 'transparent' }, // hover background color
  ac: { type: String, default: 'inherit' }, // active color
  abgc: { type: String, default: 'transparent' }, // active background color
  active: { type: Boolean, default: false },
});

const hovering = ref(false);

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

const dynamicStyle = computed(() => {
  if (props.active) {
    return {
      backgroundColor: props.abgc,
      color: props.ac,
    };
  } else if (hovering.value) {
    return {
      backgroundColor: props.hbgc,
      color: props.hc,
    };
  }
  return {};
});
</script>
