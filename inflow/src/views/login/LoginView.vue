<template>
  <BubbleBackground></BubbleBackground>
  <div class="page-container">
    <FlexItem h="28rem" w="44rem" bgc="rgba(0, 34, 65, 0.74)" br="1.5rem"></FlexItem>
  </div>
</template>

<script setup>
import BubbleBackground from '../../components/common/BubbleBackground.vue';
import FlexItem from '../../components/semantic/FlexItem.vue';
</script>

<style scoped>
.page-container {
  display: flex;
  height: 100vh;
  width: 100%;
  justify-content: center;
  align-items: center;
}
</style>
