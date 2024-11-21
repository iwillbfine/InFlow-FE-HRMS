<template>
  <ModalBackground>
    <ModalItem h="58rem" w="75rem" fs="2rem" fw="500">
      <FlexItem class="modal-content" fld="column" h="100%" w="100%">
        <FlexItem class="modal-close" fld="row" h="4rem" w="100%">
          <CloseButton
            h="3rem"
            w="3rem"
            fs="3rem"
            bgc="#fff"
            c="#003566"
            @click="closeModal"
          />
        </FlexItem>
        <slot></slot>
      </FlexItem>
    </ModalItem>
  </ModalBackground>
</template>

<script setup>
import CloseButton from '../buttons/CloseButton.vue';
import ModalBackground from '../modals/ModalBackground.vue';
import ModalItem from '../modals/ModalItem.vue';
import FlexItem from '../semantic/FlexItem.vue';

const emit = defineEmits(['close']);

const closeModal = () => {
  emit('close');
};
</script>

<style scoped>
.modal-content {
  align-items: center;
  gap: 1rem;
  overflow: auto;
}

.modal-close {
  justify-content: flex-end;
}

.modal-label {
  font-size: 2.2rem;
  font-weight: 700;
}
</style>
