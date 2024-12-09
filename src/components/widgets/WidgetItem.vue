<template>
  <SectionItem class="widget" fld="column" :h="h" :w="w" br="1rem">
    <FlexItem
      class="widget-label"
      w="100%"
      bgc="#003566"
      fs="1.6rem"
      fw="500"
      c="#fff"
    >
      <span>{{ props.label }}</span>
    </FlexItem>
    <FlexItem class="widget-content-wrapper" h="100%" w="100%" bgc="#fff">
      <slot></slot>
    </FlexItem>
  </SectionItem>
</template>

<script setup>
import SectionItem from '../semantic/SectionItem.vue';
import FlexItem from '../semantic/FlexItem.vue';

const props = defineProps({
  label: {
    type: String,
    required: true,
  },
  h: {
    type: String,
    required: true,
  },
  w: {
    type: String,
    required: true,
  },
});
</script>

<style scoped>
.widget {
  overflow: hidden;
  box-shadow: 0 0.2rem 0.4rem 0.2rem rgba(0, 0, 0, 0.15);
}

.widget-label {
  justify-content: center;
  align-items: center;
  padding: 1rem;
}

.widget-content-wrapper {
  justify-content: center;
  align-items: center;
}
</style>
