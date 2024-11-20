<template>
  <div class="test">
    <CommonNav></CommonNav>
    <FlexItem fld="column" h="100%" w="100%">
      <CommonHeader user-name="홍길동"></CommonHeader>
      <MainItem h="100%" w="100%">
        <MyAttendanceWidget />
      </MainItem>
    </FlexItem>
  </div>
</template>

<script setup>
import CommonNav from './components/common/CommonNav.vue';
import CommonHeader from './components/common/CommonHeader.vue';
import MainItem from './components/semantic/MainItem.vue';
import FlexItem from './components/semantic/FlexItem.vue';
import MyAttendanceWidget from './components/widgets/MyAttendanceWidget.vue';
</script>

<style scoped>
.test {
  display: flex;
  height: 100vh;
  width: 100%;
}
</style>
