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
      :fs="props.fs"
      fw="700"
      c="#003566"
    >
      {{ props.label }}
    </FlexItem>
    <FlexItem class="article-content" h="calc(100% - 4rem)" w="100%">
      <slot></slot>
    </FlexItem>
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
    default: 'auto',
  },
  w: {
    type: String,
    default: 'auto',
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
  fs: {
    type: String,
    default: '1.7rem',
  },
});
</script>

<style scoped>
.common-article {
  align-items: center;
}
</style>
