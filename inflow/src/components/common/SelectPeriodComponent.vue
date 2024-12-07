<template>
  <div class="container">
    <SectionItem fld="row" style="gap: 3rem; justify-content: space-evenly">
      <PeriodDropDown
        :y="period.start.split('-')[0]"
        :m="period.start.split('-')[1]"
        @selected="startDate"
      ></PeriodDropDown>
      <span style="font-weight: bold">~</span>
      <PeriodDropDown
        :y="period.end.split('-')[0]"
        :m="period.end.split('-')[1]"
        @selected="endDate"
      ></PeriodDropDown>
    </SectionItem>
    <SectionItem
      fld="row"
      style="gap: 3rem; justify-content: center; align-items: center"
    >
      <DropdownItem
        v-model:selected-item="selectedType"
        :placeholder="'전체'"
        :list="typeList"
        w="10rem"
      ></DropdownItem>
      <ButtonItem
        h="3.6rem"
        w="9rem"
        bgc="#003566"
        br="0.6rem"
        c="#fff"
        fs="1.6rem"
        @click="handleOnclick"
      >
        다운로드
      </ButtonItem>
    </SectionItem>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import ButtonItem from '@/components/semantic/ButtonItem.vue';
import SectionItem from '@/components/semantic/SectionItem.vue';
import PeriodDropDown from '../dropdowns/PeriodDropDown.vue';
import DropdownItem from '../dropdowns/DropdownItem.vue';

// 초기 기간 설정
const period = ref({
  start: '2024-01', // 안전한 초기값 설정
  end: '2024-01', // 안전한 초기값 설정
});

// Props 정의
const props = defineProps({
  y: {
    type: String,
    default: '2023',
  },
  m: {
    type: String,
    default: '01',
  },
});

// 타입 리스트 및 선택 값
const types = ['전체', '승진', '강등', '보직변경', '퇴직', '특진', '부서이동'];
const typeList = ref([]);
const selectedType = ref(null);

// `emit` 정의
const emit = defineEmits(['selected']);

// 초기화 함수
const setDatas = () => {
  typeList.value = types.map((row) => ({
    id: row,
    name: row,
  }));
  selectedType.value = typeList.value[0]?.id || null;
};

// 선택된 시작 날짜 저장
const startDate = (date1) => {
  period.value.start = date1 || period.value.start; // 안전하게 기본값 유지
};

// 선택된 끝 날짜 저장
const endDate = (date2) => {
  period.value.end = date2 || period.value.end; // 안전하게 기본값 유지
};

// 버튼 클릭 시 데이터 전달
const handleOnclick = () => {
  emit('selected', {
    start: period.value.start,
    end: period.value.end,
    type: selectedType.value,
  });
};

// 마운트 시 초기화
onMounted(() => {
  setDatas();
});
</script>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}
</style>
