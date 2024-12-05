<template>
  <FlexItem class="app-his-dropdown" fld="row" fs="1.6rem" fw="500" c="#003566">
    <DropdownItem
      v-model:selected-item="selectedType"
      :placeholder="'전체'"
      :list="typeList"
      w="8rem"
    ></DropdownItem>
    <span></span>
  </FlexItem>
</template>

<script setup>
import FlexItem from '../semantic/FlexItem.vue';
import DropdownItem from './DropdownItem.vue';
import { onMounted, ref, watch } from 'vue';

const emit = defineEmits(['selected']);

// 초기 데이터
const types = ref(['전체', '포상', '징계']);
const typeList = ref([]);

// 선택된 값
const selectedType = ref(null);

// 데이터 초기화 함수
const setDatas = () => {
  typeList.value = types.value.map((row) => ({
    id: row,
    name: row
  }));

  // 기본 값 설정
  selectedType.value = typeList.value[0]?.id;
};

// 컴포넌트 마운트 시 초기화
onMounted(() => {
  setDatas();
});

watch(selectedType, (newValue) => {
  emit('selected', newValue); // 선택된 값이 변경될 때 이벤트 발생
});
</script>

<style scoped>
.app-his-dropdown {
  justify-content: center;
  align-items: center;
  gap: 1rem;
}
</style>
