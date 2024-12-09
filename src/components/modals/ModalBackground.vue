<template>
  <FlexItem class="modal-background" h="100%" w="100%" bgc="rgba(0,0,0,0.3)">
    <slot></slot>
  </FlexItem>
</template>

<script setup>
import FlexItem from '../semantic/FlexItem.vue';
</script>

<style scoped>
.modal-background {
  position: fixed;
  top: 0;
  left: 0;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.3);
  z-index: 9999;
}
</style>
