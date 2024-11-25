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
  position: absolute;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}
</style>
