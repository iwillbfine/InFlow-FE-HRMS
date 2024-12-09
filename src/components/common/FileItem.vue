<template>
  <FlexItem
    class="file-item"
    fld="row"
    maxh="3.1rem"
    fs="1.3rem"
    br="2rem"
    b="1px solid #003566"
    c="#003566"
  >
    <span>{{ props.name }}</span>
    <XmarkButton
      h="2rem"
      w="2rem"
      br="50%"
      fs="1.3rem"
      bgc="#003566"
      c="#fff"
      @click="handleOnclick"
    ></XmarkButton>
  </FlexItem>
</template>

<script setup>
import FlexItem from '../semantic/FlexItem.vue';
import XmarkButton from '../buttons/XmarkButton.vue';

const props = defineProps({
  id: {
    type: Number,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
});

const emit = defineEmits(['remove-file']);

const handleOnclick = () => {
  emit('remove-file', props.id);
};
</script>

<style scoped>
.file-item {
  justify-content: center;
  align-items: center;
  padding-top: 0.55rem;
  padding-bottom: 0.55rem;
  padding-left: 1.45rem;
  padding-right: 0.55rem;
  gap: 1rem;
}
</style>
