<template>
  <FlexItem class="app-his-dropdown" fld="row" fs="1.6rem" fw="500" c="#003566">
    <DropdownItem
      v-model:selected-item="selectedYear"
      :placeholder="props.y || curYear || '----'"
      :list="yearList"
      w="8rem"
    ></DropdownItem>
    <span>년</span>

    <DropdownItem
      v-model:selected-item="selectedMonth"
      :placeholder="props.m || curMonth || '--'"
      :list="monthList"
      w="6rem"
    ></DropdownItem>
    <span>월</span>

    <DropdownItem
      v-model:selected-item="selectedType"
      :placeholder="'전체'"
      :list="typeList"
      w="10rem"
    ></DropdownItem>
    <span></span>
  </FlexItem>
</template>

<script setup>
import FlexItem from '../semantic/FlexItem.vue';
import DropdownItem from './DropdownItem.vue';
import { onMounted, ref, watch } from 'vue';

const emit = defineEmits(['selected']);

const props = defineProps({
  y: {
    type: String,
    default: '----',
  },
  m: {
    type: String,
    default: '--',
  },
});

// 현재 연도와 월
const curYear = ref(new Date().getFullYear());
const curMonth = ref(String(new Date().getMonth() + 1).padStart(2, '0'));

// 초기 데이터
const types = ref([
  '전체',
  '승진',
  '강등',
  '보직변경',
  '퇴직',
  '특진',
  '부서이동',
]);
const typeList = ref([]);
const yearList = ref([]);
const monthList = ref([]);

// 선택된 값
const selectedType = ref(null);
const selectedYear = ref(null);
const selectedMonth = ref(null);

// 유효 날짜 확인
const isValidDate = ref(true);

// 데이터 초기화 함수
const setDatas = () => {
  typeList.value = types.value.map((row) => ({
    id: row,
    name: row,
  }));

  yearList.value = Array.from({ length: 30 }, (_, i) => ({
    id: curYear.value - i,
    name: `${curYear.value - i}`,
  }));

  monthList.value = Array.from({ length: 12 }, (_, i) => ({
    id: i + 1,
    name: `${String(i + 1).padStart(2, '0')}`,
  }));

  // 기본 값 설정
  selectedType.value = typeList.value[0]?.id;
  selectedYear.value = yearList.value[0]?.id;
  selectedMonth.value = curMonth.value;
};

// 날짜 유효성 검사
const validateDate = () => {
  if (selectedYear.value && selectedMonth.value && selectedType.value) {
    const year = selectedYear.value;
    const month = String(selectedMonth.value).padStart(2, '0');
    const type = selectedType.value;

    const date = new Date(year, parseInt(month) - 1, 1);
    isValidDate.value =
      date.getFullYear() === year && date.getMonth() === parseInt(month) - 1;

    if (isValidDate.value) {
      emit('selected', `${year}-${month}-${type}`);
    }
  } else {
    isValidDate.value = false;
  }
};

// 컴포넌트 마운트 시 초기화
onMounted(() => {
  setDatas();
});

// 값 변경 감지
watch([selectedYear, selectedMonth, selectedType], validateDate);
</script>

<style scoped>
.app-his-dropdown {
  justify-content: center;
  align-items: center;
  gap: 1rem;
}
</style>
