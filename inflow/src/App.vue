<template>
  <div class="test">
    <VerticalNav :cur="3"></VerticalNav>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import VerticalNav from './components/composite/VerticalNav.vue';
</script>

<style scoped>
.test {
  display: flex;
  height: 100vh;
  width: 100%;
}
</style>
