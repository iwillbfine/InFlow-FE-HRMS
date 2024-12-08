<template>
  <FigureItem class="logo-wrapper" fld="column" :h="props.h" :w="props.w">
    <img src="/src/assets/company_logo.svg" alt="company_logo" />
  </FigureItem>
</template>

<script setup>
import FigureItem from '../semantic/FigureItem.vue';
import FigCaptionItem from '../semantic/FigcaptionItem.vue';

const props = defineProps({
  h: {
    type: String,
    default: '12rem',
  },
  w: {
    type: String,
    default: '12rem',
  },
});
</script>
