<template>
  <div class="page-container">
    <CommonNav :cur="4"></CommonNav>
    <FlexItem
      class="main-container"
      fld="column"
      h="100%"
      w="calc(100% - 12rem)"
    >
      <CommonHeader user-name="홍길동"></CommonHeader>
      <MainItem h="calc(100% - 10rem)" w="100%">
        <CommonWidget :cur="2" :list="menuList">
          <FlexItem class="widget-content" h="100%" w="100%"> </FlexItem>
        </CommonWidget>
      </MainItem>
    </FlexItem>
  </div>
</template>

<script setup>
import CommonNav from '@/components/common/CommonNav.vue';
import CommonHeader from '@/components/common/CommonHeader.vue';
import CommonWidget from '@/components/common/CommonWidget.vue';
import MainItem from '@/components/semantic/MainItem.vue';
import FlexItem from '@/components/semantic/FlexItem.vue';
import { ref } from 'vue';

const menuList = ref([
  { name: '자기 평가', link: '/evaluation/personal' },
  { name: '리더 평가', link: '/evaluation/leader' },
  { name: '과제 등록 및 조회', link: '/evaluation/task' },
]);
</script>

<style scoped>
.page-container {
  display: flex;
  height: 100vh;
  width: 100%;
}

.widget-content {
  align-items: center;
  padding: 2rem;
  overflow: auto;
}
</style>
