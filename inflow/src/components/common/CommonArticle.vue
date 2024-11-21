<template>
  <ArticleItem
    class="common-article"
    fld="column"
    :maxh="props.maxh"
    :minh="props.minh"
    :maxw="props.maxw"
    :minw="props.minw"
    :h="props.h"
    :w="props.w"
  >
    <FlexItem
      class="article-label"
      h="4rem"
      w="100%"
      fs="1.7rem"
      fw="700"
      c="#003566"
    >
      {{ props.label }}
    </FlexItem>
    <slot></slot>
  </ArticleItem>
</template>

<script setup>
import ArticleItem from '../semantic/ArticleItem.vue';
import FlexItem from '../semantic/FlexItem.vue';

const props = defineProps({
  label: {
    type: String,
    required: true,
  },
  h: {
    type: String,
    default: '100%',
  },
  w: {
    type: String,
    default: '100%',
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
</script>

<style scoped>
.common-article {
  align-items: center;
}
</style>
