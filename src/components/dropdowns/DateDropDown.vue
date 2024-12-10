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

<script setup>
import FlexItem from '../semantic/FlexItem.vue';
import DropdownItem from './DropdownItem.vue';
import { ref, watch } from 'vue';

const props = defineProps({
  short: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['valid-date-selected']);

const selectedYear = ref(null);
const selectedMonth = ref(null);
const selectedDay = ref(null);
const isValidDate = ref(true); // 유효성 상태를 저장

// 날짜 검증 함수
const validateDate = () => {
  if (selectedYear.value && selectedMonth.value && selectedDay.value) {
    const year = selectedYear.value;
    const month = String(selectedMonth.value).padStart(2, '0'); // 1월이 1부터 시작
    const day = String(selectedDay.value).padStart(2, '0');

    // 유효한 날짜인지 검증
    const date = new Date(year, parseInt(month) - 1, parseInt(day)); // month는 0부터 시작하므로 -1 필요
    isValidDate.value =
      date.getFullYear() === year &&
      date.getMonth() === parseInt(month) - 1 &&
      date.getDate() === parseInt(day);

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

const currentYear = new Date().getFullYear();

const yearList = ref(
  props.short
    ? Array.from({ length: 21 }, (_, i) => ({
        id: currentYear + i,
        name: `${currentYear + i}`,
      }))
    : Array.from({ length: 101 }, (_, i) => ({
        id: 1951 + i,
        name: `${1951 + i}`,
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
