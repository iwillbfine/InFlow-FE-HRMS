<template>
  <SectionItem class="change-month-section" fld="row">
    <ChevronLeftButton
      h="3.6rem"
      w="3.6rem"
      bgc="transparent"
      c="#202020"
      @click="goPrevMonth"
    ></ChevronLeftButton>
    <span class="cur-month">{{ parseMonth(props.curMonth) }}</span>
    <span v-if="props.description != ''" class="description">{{
      props.description
    }}</span>
    <ChevronRightButton
      h="3.6rem"
      w="3.6rem"
      bgc="transparent"
      c="#202020"
      @click="goNextMonth"
    ></ChevronRightButton>
  </SectionItem>
</template>

<script setup>
import SectionItem from '@/components/semantic/SectionItem.vue';
import ChevronLeftButton from '@/components/buttons/ChevronLeftButton.vue';
import ChevronRightButton from '@/components/buttons/ChevronRightButton.vue';

const emit = defineEmits(['goPrevMonth', 'goNextMonth']);

const props = defineProps({
  curMonth: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    default: '',
  },
});

// 월까지 파싱
const parseMonth = (dateStr) => {
  const date = new Date(dateStr);

  const year = date.getFullYear();
  const month = date.getMonth() + 1; // 월은 0부터 시작하므로 +1 필요

  const formattedMonth = `${year}년 ${month}월`;
  return formattedMonth;
};

// 이전 달로 이동
const goPrevMonth = () => {
  const curDate = new Date(props.curMonth + '-01'); // 현재 날짜 생성
  curDate.setMonth(curDate.getMonth() - 1); // 이전 달로 이동

  const prevMonth =
    curDate.getFullYear() +
    '-' +
    String(curDate.getMonth() + 1).padStart(2, '0'); // 월은 0부터 시작하므로 +1
  emit('goPrevMonth', prevMonth);
};

// 다음 달로 이동
const goNextMonth = () => {
  const curDate = new Date(props.curMonth + '-01'); // 현재 날짜 생성
  curDate.setMonth(curDate.getMonth() + 1); // 다음 달로 이동

  const nextMonth =
    curDate.getFullYear() +
    '-' +
    String(curDate.getMonth() + 1).padStart(2, '0'); // 월은 0부터 시작하므로 +1
  emit('goNextMonth', nextMonth);
};
</script>

<style scoped>
.change-month-section {
  justify-content: center;
  align-items: center;
  gap: 1.5rem;
}

.change-month-section button {
  margin-top: 0.5rem;
}

.cur-month {
  font-size: 2rem;
  font-weight: 700;
  color: #0063bf;
}

.description {
  font-size: 2rem;
  font-weight: 700;
  color: #202020;
}
</style>
