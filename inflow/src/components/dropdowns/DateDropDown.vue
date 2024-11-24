<template>
  <FlexItem class="date-dropdown" fld="row" fs="1.6rem" fw="500" c="#003566">
    <DropdownItem
      v-model:selected-item="selectedYear"
      placeholder="----"
      :list="yearList"
      w="8rem"
    ></DropdownItem>
    <span>년</span>
    <DropdownItem
      v-model:selected-item="selectedMonth"
      placeholder="--"
      :list="monthList"
      w="6rem"
    ></DropdownItem>
    <span>월</span>
    <DropdownItem
      v-model:selected-item="selectedDay"
      placeholder="--"
      :list="dayList"
      w="6rem"
    ></DropdownItem>
    <span>일</span>
  </FlexItem>
</template>

<script setup lang="ts">
import FlexItem from '../semantic/FlexItem.vue';
import DropdownItem from './DropdownItem.vue';
import { ref, watch } from 'vue';

const emit = defineEmits(['valid-date-selected']);

const selectedYear = ref(null);
const selectedMonth = ref(null);
const selectedDay = ref(null);
const isValidDate = ref(true); // 유효성 상태를 저장

// 날짜 검증 함수
const validateDate = () => {
  if (selectedYear.value && selectedMonth.value && selectedDay.value) {
    const year = selectedYear.value;
    const month = selectedMonth.value; // 1월이 1부터 시작
    const day = selectedDay.value;

    // 유효한 날짜인지 검증
    const date = new Date(year, month - 1, day); // month는 0부터 시작하므로 -1 필요
    isValidDate.value =
      date.getFullYear() === year &&
      date.getMonth() === month - 1 &&
      date.getDate() === day;

    if (isValidDate.value) {
      emit('valid-date-selected', `${year}-${month}-${day}`); // 유효한 날짜만 emit
    }
  } else {
    isValidDate.value = false;
  }
};

watch([selectedYear, selectedMonth, selectedDay], () => {
  validateDate();
});

const yearList = ref(
  Array.from({ length: 200 }, (_, i) => ({
    id: i + 1901,
    name: `${i + 1901}`,
  }))
);

const monthList = ref(
  Array.from({ length: 12 }, (_, i) => ({
    id: i + 1, // 월은 1부터 시작
    name: `${i + 1}`,
  }))
);

const dayList = ref(
  Array.from({ length: 31 }, (_, i) => ({
    id: i + 1, // 일은 1부터 시작
    name: `${i + 1}`,
  }))
);
</script>

<style scoped>
.date-dropdown {
  justify-content: center;
  align-items: center;
  gap: 1rem;
}
</style>
