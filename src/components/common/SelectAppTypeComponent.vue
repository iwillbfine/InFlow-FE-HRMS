<template>
  <SectionItem fld="row">
    <AppointmentHisDropDown
      :y="props.y"
      :m="props.m"
      @selected="updateSelectedData"
    ></AppointmentHisDropDown>
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
import AppointmentHisDropDown from '@/components/dropdowns/AppointmentHisDropDown.vue';
import { ref } from 'vue';

const selectedData = ref('');

const emit = defineEmits(['selected']);

// 연월 선택될 때 호출
const updateSelectedData = (date) => {
  selectedData.value = date;
};

const handleOnclick = () => {
  emit('selected', selectedData.value);
};

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
</script>

<style scoped></style>
