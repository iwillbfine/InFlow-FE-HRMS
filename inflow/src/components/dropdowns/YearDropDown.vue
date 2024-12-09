<template>
  <FlexItem class="year-dropdown" fld="row" fs="1.6rem" fw="500" c="#003566">
    <DropdownItem
      v-model:selected-item="selectedYear"
      placeholder="----"
      :list="yearList"
      w="8rem"
    ></DropdownItem>
    <span>년도</span>
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
const isValidDate = ref(true); // 유효성 상태를 저장

// 날짜 검증 함수
const validateDate = () => {
  if (selectedYear.value) {
    const year = selectedYear.value;

    // 유효한 날짜인지 검증
    isValidDate.value = year > 0;

    if (isValidDate.value) {
      emit('valid-date-selected', `${year}`); // 유효한 날짜만 emit
    }
  } else {
    isValidDate.value = false;
  }
};

watch([selectedYear], () => {
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
</script>

<style scoped>
.year-dropdown {
  justify-content: center;
  align-items: center;
  gap: 1rem;
}
</style>
