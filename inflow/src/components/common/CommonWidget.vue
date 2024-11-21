<template>
  <SectionItem class="common-widget" h="100%" w="100%">
    <MenuNav :cur="props.cur" :list="props.list"></MenuNav>
    <WidgetItem h="calc(100% - 4.2rem)" w="100%" br="0rem 1rem 1rem 1rem">
      <slot></slot>
    </WidgetItem>
  </SectionItem>
</template>

<script setup>
import SectionItem from '../semantic/SectionItem.vue';
import WidgetItem from '../widgets/WidgetItem.vue';
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
