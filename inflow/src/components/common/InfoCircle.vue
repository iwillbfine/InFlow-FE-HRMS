<template>
  <FlexItem
    class="outer-circle"
    :h="h"
    :w="w"
    br="50%"
    :bg="gradientBackground"
  >
    <FlexItem
      class="inner-circle"
      :style="innerCircleStyles"
      br="50%"
      bgc="#fff"
      :fs="fs"
      :fw="fw"
      :c="c"
    >
      <span>{{ content }}</span>
    </FlexItem>
  </FlexItem>
</template>

<script setup>
import FlexItem from '../semantic/FlexItem.vue';
import { computed } from 'vue';

const props = defineProps({
  content: {
    type: String,
    default: '',
  },
  h: {
    type: String,
    default: '8.6rem',
  },
  w: {
    type: String,
    default: '8.6rem',
  },
  fs: {
    type: String,
    default: '2rem',
  },
  fw: {
    type: String,
    default: '700',
  },
  c: {
    type: String,
    default: '#003566',
  },
});

const scaleSize = (size, scaleFactor) => {
  const regex = /(\d+(\.\d+)?)(px|rem|em)/;
  const match = size.match(regex);

  if (match) {
    const value = parseFloat(match[1]);
    const unit = match[3];

    return `${value * scaleFactor}${unit}`;
  }
  return size;
};

const innerCircleStyles = computed(() => {
  const scaledHeight = scaleSize(props.h, 0.85);
  const scaledWidth = scaleSize(props.w, 0.85);

  return {
    height: scaledHeight,
    width: scaledWidth,
  };
});

const gradientBackground = computed(() => {
  return 'linear-gradient(to bottom right,#A3D3FF,#5AA6ED )';
});
</script>

<style scoped>
.outer-circle {
  justify-content: center;
  align-items: center;
}

.inner-circle {
  justify-content: center;
  align-items: center;
}
</style>
