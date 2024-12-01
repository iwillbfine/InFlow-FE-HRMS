<template>
  <ArticleItem
    class="modal"
    :h="props.h"
    :w="props.w"
    br="0.5rem"
    bgc="#fff"
    :fs="props.fs"
    :fw="props.fw"
  >
    <slot></slot>
  </ArticleItem>
</template>

<script setup>
import ArticleItem from '../semantic/ArticleItem.vue';

const props = defineProps({
  h: {
    type: String,
    required: true,
  },
  w: {
    type: String,
    required: true,
  },
  fs: {
    type: String,
    required: true,
  },
});
</script>

<style scoped>
.modal {
  padding: 1rem;
  justify-content: center;
  align-items: center;
}
</style>
