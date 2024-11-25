<template>
  <span class="company-name" :style="customStyle">Inflow Corp.</span>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  fs: {
    type: String,
    default: '3.6rem',
  },
  fw: {
    type: String,
    default: '300',
  },
  c: {
    type: String,
    default: '#fff',
  },
});

const customStyle = computed(() => ({
  fontSize: props.fs,
  fontWeight: props.fw,
  color: props.c,
}));
</script>

<style scoped>
.company-name {
  font-family: 'inter';
}
</style>
