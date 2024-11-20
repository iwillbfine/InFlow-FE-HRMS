<template>
  <div class="test">
    <VerticalNav></VerticalNav>
    <FlexItem fld="column" h=100% w="100%">
      <MainHeader userName="홍길동"></MainHeader>
      <MainItem h="100%" w="100%">
        <MyAttendanceWidget/>
      </MainItem>
    </FlexItem>
  </div>
</template>

<script setup>
import VerticalNav from './components/composite/VerticalNav.vue';
import MainHeader from './components/composite/MainHeader.vue';
import MainItem from './components/semantic/MainItem.vue';
import FlexItem from './components/semantic/FlexItem.vue';
import MyAttendanceWidget from './components/composite/MyAttendanceWidget.vue';
</script>

<style scoped>
.test {
  display: flex;
  height: 100vh;
  width: 100%;
}
</style>
