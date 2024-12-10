<template>
  <FlexItem class="app-his-dropdown" fld="row" fs="1.6rem" fw="500" c="#003566">
    <DropdownItem
      v-model:selected-item="selectedYear"
      :placeholder="props.y || curYear"
      :list="yearList"
      w="8rem"
    ></DropdownItem>
    <span>년</span>

    <DropdownItem
      v-model:selected-item="selectedMonth"
      :placeholder="props.m || curMonth"
      :list="monthList"
      w="6rem"
    ></DropdownItem>
    <span>월</span>
  </FlexItem>
</template>

<script setup>
import FlexItem from '../semantic/FlexItem.vue';
import DropdownItem from './DropdownItem.vue';
import { ref, onMounted, watch } from 'vue';

const emit = defineEmits(['selected']);

const props = defineProps({
  y: { type: String, default: null },
  m: { type: String, default: null },
});

// 현재 연도와 월
const curYear = ref(new Date().getFullYear());
const curMonth = ref(String(new Date().getMonth() + 1).padStart(2, '0'));

// 연도와 월 리스트
const yearList = ref([]);
const monthList = ref([]);

// 선택된 연도와 월
const selectedYear = ref(props.y || curYear.value);
const selectedMonth = ref(props.m || curMonth.value);

// 리스트 생성 함수
const setDatas = () => {
  yearList.value = Array.from({ length: 30 }, (_, i) => ({
    id: curYear.value - i,
    name: `${curYear.value - i}`,
  }));
  monthList.value = Array.from({ length: 12 }, (_, i) => ({
    id: String(i + 1).padStart(2, '0'),
    name: `${String(i + 1).padStart(2, '0')}`,
  }));
};

// 값 변경 시 호출
const validateDate = () => {
  if (selectedYear.value && selectedMonth.value) {
    emit('selected', `${selectedYear.value}-${selectedMonth.value}`);
  }
};

// 초기화 및 값 변경 시 호출
onMounted(() => {
  setDatas();
  validateDate();
});
watch([selectedYear, selectedMonth], validateDate);
</script>

<style scoped>
.app-his-dropdown {
  justify-content: center;
  align-items: center;
  gap: 1rem;
}

DropdownItem >>> * {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
