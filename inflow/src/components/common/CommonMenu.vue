<template>
  <SectionItem
    class="common-menu"
    fld="column"
    w="calc(100% - 12rem)"
    bgc="#fff"
  >
    <MenuNav :cur="props.cur" :list="props.list"></MenuNav>
    <FlexItem
      h="4.2rem"
      w="100%"
      bgc="#003566"
      br="0rem 1rem 0rem 0rem"
    ></FlexItem>
    <FlexItem h="1rem" w="100%" bgc="#fff"></FlexItem>
  </SectionItem>
</template>

<script setup>
import SectionItem from '../semantic/SectionItem.vue';
import FlexItem from '../semantic/FlexItem.vue';
import MenuNav from '../nav/MenuNav.vue';

const props = defineProps({
  cur: {
    type: Number,
    default: 0,
  },
  list: {
    type: Array,
    required: true,
  },
});
</script>

<style scoped>
.common-menu {
  position: fixed;
  padding-left: 2rem;
  padding-right: 2rem;
  z-index: 2;
}
</style>
