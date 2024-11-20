<template>
  <ButtonItem :h="h" :w="w" :br="br" :bgc="bgc" :fs="fs" :c="c">
    <GearIcon></GearIcon>
  </ButtonItem>
</template>

<script setup>
import GearIcon from '../icons/GearIcon.vue';
import ButtonItem from '../semantic/ButtonItem.vue';

const props = defineProps({
  h: { type: String, required: true },
  w: { type: String, required: true },
  br: { type: String, required: true },
  bgc: { type: String, required: true },
  fs: { type: String, required: true },
  c: { type: String, required: true },
})
</script>
