<template>
  <ButtonItem
    :h="props.h"
    :w="props.w"
    :br="props.br"
    :bgc="props.bgc"
    :fs="props.fs"
    :c="props.c"
  >
    <HomeIcon></HomeIcon>
  </ButtonItem>
</template>

<script setup>
import HomeIcon from '../icons/HomeIcon.vue';
import ButtonItem from '../semantic/ButtonItem.vue';

const props = defineProps({
  h: { type: String, required: true },
  w: { type: String, required: true },
  br: { type: String, required: true },
  bgc: { type: String, required: true },
  fs: { type: String, required: true },
  c: { type: String, required: true },
});
</script>
