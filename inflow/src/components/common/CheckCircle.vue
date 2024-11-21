<template>
  <FlexItem
    class="check-circle"
    :h="props.h"
    :w="props.w"
    :fs="props.fs"
    br="50%"
    :bgc="props.bgc"
    :c="props.c"
  >
    <CheckIcon></CheckIcon>
  </FlexItem>
</template>

<script setup>
import CheckIcon from '../icons/CheckIcon.vue';
import FlexItem from '../semantic/FlexItem.vue';

const props = defineProps({
  h: { type: String, default: '4.8rem' },
  w: { type: String, default: '4.8rem' },
  fs: { type: String, default: '2.4rem' },
  bgc: { type: String, default: '#003566' },
  c: { type: String, default: '#fff' },
});
</script>

<style scoped>
.check-circle {
  justify-content: center;
  align-items: center;
}
</style>
