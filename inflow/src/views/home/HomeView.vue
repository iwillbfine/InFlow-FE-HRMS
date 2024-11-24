<template>
  <div class="page-container">
    <CommonNav></CommonNav>
    <FlexItem
      class="main-container"
      fld="column"
      h="100%"
      w="calc(100% - 12rem)"
    >
      <CommonHeader user-name="홍길동"></CommonHeader>
      <MainItem h="calc(100% - 12rem)" w="100%">
        <MyAttendanceWidget></MyAttendanceWidget>
      </MainItem>
    </FlexItem>
  </div>
</template>

<script setup>
import CommonNav from '@/components/common/CommonNav.vue';
import CommonHeader from '@/components/common/CommonHeader.vue';
import MainItem from '@/components/semantic/MainItem.vue';
import FlexItem from '@/components/semantic/FlexItem.vue';
import MyAttendanceWidget from '@/components/widgets/MyAttendanceWidget.vue';
</script>

<style scoped>
.page-container {
  display: flex;
  height: 100vh;
  width: 100%;
}
</style>
