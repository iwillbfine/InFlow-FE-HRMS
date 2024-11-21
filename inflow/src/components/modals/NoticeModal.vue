<template>
  <ModalBackground @click="closeModal">
    <ModalItem h="21rem" w="37rem" fs="2rem" fw="500">
      <FlexItem class="modal-content" fld="column" h="100%" w="100%">
        <slot></slot>
        <span>{{ props.content }}</span>
      </FlexItem>
    </ModalItem>
  </ModalBackground>
</template>

<script setup>
import ModalBackground from './ModalBackground.vue';
import ModalItem from './ModalItem.vue';
import FlexItem from '../semantic/FlexItem.vue';

const props = defineProps({
  content: {
    type: String,
    required: true,
  },
});

const emit = defineEmits(['close']);

const closeModal = () => {
  emit('close');
};
</script>

<style scoped>
.modal-content {
  justify-content: center;
  align-items: center;
  gap: 2rem;
}
</style>
