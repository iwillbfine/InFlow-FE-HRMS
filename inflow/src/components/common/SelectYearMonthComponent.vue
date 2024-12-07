<template>
  <SectionItem fld="row">
    <YearMonthDropDown
      @valid-date-selected="updateSelectedMonth"
    ></YearMonthDropDown>
    <ButtonItem
      h="3.6rem"
      w="7.2rem"
      bgc="#003566"
      br="0.6rem"
      c="#fff"
      fs="1.6rem"
      @click="handleOnclick"
      >조회</ButtonItem
    >
  </SectionItem>
</template>

<script setup>
import ButtonItem from '@/components/semantic/ButtonItem.vue';
import SectionItem from '@/components/semantic/SectionItem.vue';
import YearMonthDropDown from '@/components/dropdowns/YearMonthDropDown.vue';
import { ref } from 'vue';

const selectedMonth = ref('');

const emit = defineEmits(['monthSelected']);

// 연월 선택될 때 호출
const updateSelectedMonth = (date) => {
  selectedMonth.value = date;
};

const handleOnclick = () => {
  emit('monthSelected', selectedMonth.value);
};
</script>

<style scoped></style>
