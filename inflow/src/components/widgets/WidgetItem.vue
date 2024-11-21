<template>
  <SectionItem
    class="widget"
    fld="column"
    :h="props.h"
    :w="props.w"
    :br="props.br"
    :maxh="props.maxh"
    :minh="props.minh"
    :maxw="props.maxw"
    :minw="props.minw"
  >
    <FlexItem
      class="widget-label"
      h="4rem"
      w="100%"
      bgc="#003566"
      fs="1.6rem"
      fw="500"
      c="#fff"
    >
      <span>{{ props.label }}</span>
    </FlexItem>
    <FlexItem
      class="widget-content-wrapper"
      h="calc(100% - 4rem)"
      w="100%"
      bgc="#fff"
    >
      <slot></slot>
    </FlexItem>
  </SectionItem>
</template>

<script setup>
import FlexItem from '../semantic/FlexItem.vue';
import SectionItem from '../semantic/SectionItem.vue';

const props = defineProps({
  label: {
    type: String,
    default: '',
  },
  h: {
    type: String,
    required: true,
  },
  w: {
    type: String,
    required: true,
  },
  br: {
    type: String,
    default: '1rem',
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
.widget {
  overflow: auto;
  box-shadow: 0 0.2rem 0.4rem 0.2rem rgba(0, 0, 0, 0.15);
}

.widget-label {
  justify-content: center;
  align-items: center;
}

.widget-content-wrapper {
  justify-content: center;
  align-items: center;
  overflow: auto;
}
</style>
