<template>
  <WidgetItem label="나의 근태 현황" h="20rem" :w="widgetWidth">
    <FlexItem class="widget-content" fld="row" h="100%" w="100%">
      <FlexItem v-for="(item, index) in list" :key="index" class="content-item" fld="column" fs="1.5rem" c="#003566">
        <InfoCircle :content="item.content"></InfoCircle>
        <span>{{ item.label }}</span>
      </FlexItem>
    </FlexItem>
  </WidgetItem>
</template>

<script setup>
import WidgetItem from './WidgetItem.vue';
import InfoCircle from './InfoCircle.vue';
import FlexItem from '../semantic/FlexItem.vue';
import { ref, computed } from 'vue';

const list = ref([
  { content: 'D-27', label: '월급날'},
  { content: '출근', label: '오늘의 근무 상태'},
  { content: '534일', label: '근속 일수'},
  { content: '5/15', label: '연차 현황'},
  { content: '6:30', label: '초과 근무 시간'},
]);

const widgetWidth = computed(() => {
  return `${list.value.length * 15}rem`;
});
</script>

<style scoped>
.widget-content {
  justify-content: space-around;
  align-items: center;
}

.content-item {
  align-items: center;
  gap: 1rem;
}
</style>
