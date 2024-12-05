<template>
  <FlexItem class="month-navigator" fld="row" w="100%" h="5rem" bgc="#002D57" fs="1.5rem">
    <CaretLeftButton h="3rem" w="3rem" bgc="transparent" @click="prevMonth"></CaretLeftButton>
    <FlexItem
      v-for="(month, index) in visibleMonths"
      :key="index"
      class="month-display"
      fld="row"
      w="3rem"
      h="3rem"
      :bgc="month === currentMonth ? '#fff' : 'transparent'"
      br="50%"
      :c="month === currentMonth ? '#002D57' : '#31587C'"
      fs="1.5rem"
      fw="500"
    >
      <span>{{ month }}</span>
    </FlexItem>
    <CaretRightButton h="3rem" w="3rem" bgc="transparent" @click="nextMonth"></CaretRightButton>
  </FlexItem>
</template>

<script setup>
import FlexItem from '@/components/semantic/FlexItem.vue';
import CaretLeftButton from '../buttons/CaretLeftButton.vue';
import CaretRightButton from '../buttons/CaretRightButton.vue';
import { ref, computed, watch } from 'vue';

// emit 정의
const emit = defineEmits(['current-month-change']);

// 현재 월 상태
const currentMonth = ref(new Date().getMonth() + 1);

// 두 달 전부터 두 달 후까지 계산
const visibleMonths = computed(() => {
  const months = [];
  for (let i = -2; i <= 2; i++) {
    let month = currentMonth.value + i;
    if (month < 1) month += 12; // 1월 이전은 12월로 순환
    if (month > 12) month -= 12; // 12월 이후는 1월로 순환
    months.push(month);
  }
  return months;
});

// 이전 월로 이동
const prevMonth = () => {
  currentMonth.value = currentMonth.value === 1 ? 12 : currentMonth.value - 1;
};

// 다음 월로 이동
const nextMonth = () => {
  currentMonth.value = currentMonth.value === 12 ? 1 : currentMonth.value + 1;
};

// currentMonth 변화 감지
watch(currentMonth, (newMonth) => {
  emit('current-month-change', newMonth);
});
</script>

<style scoped>
.month-navigator {
  justify-content: center;
  align-items: center;
  gap: 1rem;
}

.month-display {
  justify-content: center;
  align-items: center;
  text-align: center;
  cursor: pointer;
  transition: background-color 0.2s ease, color 0.2s ease;
}

.month-display:hover {
  background-color: #eee;
  color: #002d57;
}
</style>
