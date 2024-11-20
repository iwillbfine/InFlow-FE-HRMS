<template>
  <div class="test">
    <VerticalNav></VerticalNav>
    <FlexItem fld="column" h="100%" w="100%">
      <MainHeader user-name="홍길동"></MainHeader>
      <MainItem h="100%" w="100%">
        <MyAttendanceWidget />
      </MainItem>
    </FlexItem>
  </div>
</template>

<script setup>
import VerticalNav from './components/common/VerticalNav.vue';
import MainHeader from './components/common/MainHeader.vue';
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
