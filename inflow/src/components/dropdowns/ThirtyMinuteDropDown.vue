<template>
  <FlexItem class="thirty-minute-dropdown" fld="row" fs="1.6rem" fw="500" c="#003566">
    <DropdownItem
      v-model:selected-item="selectedHour"
      placeholder="----"
      :list="hourList"
      w="8rem"
    ></DropdownItem>
    <span>시</span>
    <DropdownItem
      v-model:selected-item="selectedMinute"
      placeholder="--"
      :list="minuteList"
      w="6rem"
    ></DropdownItem>
    <span>분</span>
  </FlexItem>
</template>

<script setup>
import FlexItem from '../semantic/FlexItem.vue';
import DropdownItem from './DropdownItem.vue';
import { ref, watch } from 'vue';

const emit = defineEmits(['valid-date-selected']);

const selectedHour = ref(null);
const selectedMinute = ref(null);
const isValidDate = ref(true); // 유효성 상태를 저장

// 시간 파싱 함수
const parseTime = () => {
  if (selectedHour.value && selectedMinute.value) {
    const hour = String(selectedHour.value).padStart(2, '0'); // 2자리로 변환
    const minute = String(selectedMinute.value).padStart(2, '0'); // 2자리로 변환
    emit('valid-time-selected', `${year}-${month}`); // 유효한 시간만 emit
  } else {
    isValidDate.value = false;
  }
};

watch([selectedHour, selectedMinute], () => {
  parseTime();
});

const hourList = ref(
  Array.from({ length: 200 }, (_, i) => ({
    id: i + 1901,
    name: `${i + 1901}`,
  }))
);

const minuteList = ref(
  Array.from({ length: 12 }, (_, i) => ({
    id: i + 1, // 월은 1부터 시작
    name: `${i + 1}`,
  }))
);
</script>

<style scoped>
.thirty-minute-dropdown {
  justify-content: center;
  align-items: center;
  gap: 1rem;
}
</style>
