<template>
  <div class="test">
    <VerticalNav :cur="3"></VerticalNav>
    <MainHeader userName="홍길동"></MainHeader>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import VerticalNav from './components/composite/VerticalNav.vue';
import MainHeader from './components/composite/MainHeader.vue';
</script>

<style scoped>
.test {
  display: flex;
  height: 100vh;
  width: 100%;
}
</style>
