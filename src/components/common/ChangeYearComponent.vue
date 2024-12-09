<template>
  <SectionItem class="change-year-section" fld="row">
    <ChevronLeftButton
      h="3.6rem"
      w="3.6rem"
      bgc="transparent"
      c="#202020"
      @click="goPrevYear"
    ></ChevronLeftButton>
    <span class="cur-year">{{ parseYear(props.curYear) }}</span>
    <span v-if="props.description != ''" class="description">{{
      props.description
    }}</span>
    <ChevronRightButton
      h="3.6rem"
      w="3.6rem"
      bgc="transparent"
      c="#202020"
      @click="goNextYear"
    ></ChevronRightButton>
  </SectionItem>
</template>
<script setup>
import ChevronLeftButton from '@/components/buttons/ChevronLeftButton.vue';
import SectionItem from '@/components/semantic/SectionItem.vue';
import ChevronRightButton from '@/components/buttons/ChevronRightButton.vue';

const emit = defineEmits(['go-prev-year', 'go-next-year']);

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

const parseYear = (year) => `${year}년`; // 단순 문자열 반환

const goPrevYear = () => {
  emit('go-prev-year', props.curYear - 1);
};

const goNextYear = () => {
  emit('go-next-year', props.curYear + 1);
};
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
  color: #0063bf;
}

.description {
  font-size: 2rem;
  font-weight: 700;
  color: #202020;
}
</style>
