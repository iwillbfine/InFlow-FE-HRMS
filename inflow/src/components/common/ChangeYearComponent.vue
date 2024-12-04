<template>
  <SectionItem class="change-year-section" fld="row">
    <ChevronLeftButton h="3.6rem" w="3.6rem" bgc="transparent" c="#202020" @click="goPrevYear"></ChevronLeftButton>
    <span class="cur-year">{{ parseYear(props.curYear) }}</span>
    <span v-if="props.description != ''" class="description">{{ props.description  }}</span>
    <ChevronRightButton h="3.6rem" w="3.6rem" bgc="transparent" c="#202020" @click="goNextYear"></ChevronRightButton>
  </SectionItem>
</template>
<script setup>

import ChevronLeftButton from "@/components/buttons/ChevronLeftButton.vue";
import SectionItem from "@/components/semantic/SectionItem.vue";
import ChevronRightButton from "@/components/buttons/ChevronRightButton.vue";

const emit = defineEmits(['goPrevYear', 'goNextYear']);

const props = defineProps({
  curYear: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    default: '',
  },
});

// 연도 파싱
const parseYear = (dateStr) => {
  const date = new Date(dateStr);

  const year = date.getFullYear();
  const formattedYear = `${year}년`;
  return formattedYear;
}

const goPrevYear = () => {
  const curDate = new Date(props.curYear + "-01");
  curDate.setFullYear(curDate.getFullYear() - 1);

  const prevYear = curDate.getFullYear();
  emit('goPrevYear', prevYear);
}

const goNextYear = () => {
  const curDate = new Date(props.curYear + "-01");
  curDate.setFullYear(curDate.getFullYear() + 1);

  const nextYear = curDate.getFullYear();
  emit('goNextYear', nextYear);
}

</script>

<style scoped>

.change-year-section {
  justify-content: center;
  align-items: center;
  gap: 1.5rem;
}

.change-year-section button {
  margin-top: 0.5rem;
}

.cur-year {
  font-size: 2rem;
  font-weight: 700;
  color: #0063BF;
}

.description {
  font-size: 2rem;
  font-weight: 700;
  color: #202020;
}

</style>
