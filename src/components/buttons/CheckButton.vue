<template>
  <ButtonItem
    class="check-btn"
    :h="props.h"
    :w="props.w"
    :br="props.br"
    :bgc="props.bgc"
    :fs="props.fs"
    :c="props.c"
  >
    <CheckIcon></CheckIcon>
  </ButtonItem>
</template>

<script setup>
import CheckIcon from '../icons/CheckIcon.vue';
import ButtonItem from '../semantic/ButtonItem.vue';

const props = defineProps({
  h: { type: String, required: true },
  w: { type: String, required: true },
  br: { type: String, default: '0rem' },
  bgc: { type: String, default: '#003566' },
  fs: { type: String, default: '2.2rem' },
  c: { type: String, default: '#fff' },
});
</script>
