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

<script setup lang="ts">
import FlexItem from '../semantic/FlexItem.vue';
import DropdownItem from './DropdownItem.vue';
import { ref, watch } from 'vue';

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

const yearList = ref(
  Array.from({ length: 200 }, (_, i) => ({
    id: i + 1901,
    name: `${i + 1901}`,
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
