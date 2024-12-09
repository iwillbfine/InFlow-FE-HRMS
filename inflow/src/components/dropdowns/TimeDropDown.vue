<template>
  <FlexItem class="time-dropdown" fld="row" fs="1.6rem" fw="500" c="#003566">
    <DropdownItem
      v-model:selected-item="selectedHour"
      placeholder="--"
      :list="hourList"
      w="6rem"
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

const emit = defineEmits(['valid-time-selected']);

const selectedHour = ref(null);
const selectedMinute = ref(null);

const props = defineProps({
  afterWork: {
    type: Boolean,
    default: false,
  },
});

// 시간 파싱 함수
const parseTime = () => {
  if (selectedHour.value && selectedMinute.value) {
    const hour = String(selectedHour.value).padStart(2, '0'); // 2자리로 변환
    const minute = String(selectedMinute.value).padStart(2, '0'); // 2자리로 변환
    emit('valid-time-selected', `T${hour}:${minute}`); // 유효한 시간만 emit
  }
};

watch([selectedHour, selectedMinute], () => {
  parseTime();
});

const hourList = ref(
  props.afterWork
    ? Array.from({ length: 6 }, (_, i) => ({
        id: `${i + 18}`,
        name: `${i + 18}`,
      }))
    : Array.from({ length: 24 }, (_, i) => ({
        id: `${i}`,
        name: `${i}`,
      }))
);

const minuteList = ref(
  Array.from({ length: 2 }, (_, i) => ({
    id: `${i * 30}`,
    name: `${i * 30}`,
  }))
);
</script>

<style scoped>
.time-dropdown {
  justify-content: center;
  align-items: center;
  gap: 1rem;
}
</style>
