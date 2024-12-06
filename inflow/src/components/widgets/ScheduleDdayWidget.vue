<template>
  <FlexItem
    v-if="props.closestEvent"
    class="d-day-container"
    fld="column"
    w="100%"
    h="20rem"
    bgc="#fff"
    br="0.6rem"
    c="#003566"
  >
    <span class="title">{{ props.closestEvent.event_name }}</span>
    <span class="d-day">{{ parseDday(props.closestEvent.event_date) }}</span>
  </FlexItem>
  <FlexItem
    v-else
    class="d-day-container"
    fld="column"
    w="100%"
    h="20rem"
    bgc="#fff"
    br="0.6rem"
    c="#003566"
  >
    <span class="empty-message">이번 달 남은 일정이 없습니다.</span>
  </FlexItem>
</template>

<script setup>
import FlexItem from '@/components/semantic/FlexItem.vue';

const props = defineProps({
  closestEvent: {
    type: Object,
    default: null,
  },
});

// D-Day 계산 함수
const parseDday = (date) => {
  const targetDate = new Date(date);
  const today = new Date();
  targetDate.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);

  const diff = (targetDate - today) / (1000 * 60 * 60 * 24);

  let ddayLabel = '';

  if (diff === 0) {
    ddayLabel = 'D-DAY';
  } else if (diff > 0) {
    ddayLabel = `D-${diff}`;
  } else {
    ddayLabel = `D+${Math.abs(diff)}`;
  }

  return ddayLabel;
};
</script>

<style scoped>
.d-day-container {
  justify-content: center;
  align-items: center;
  padding: 1rem;
  gap: 1rem;
  box-shadow: 0rem 0rem 0.6rem 0rem rgba(0, 0, 0, 0.2);
}

.title {
  line-height: 2.4rem;
  font-size: 2.4rem;
  font-weight: 700;
}

.d-day {
  line-height: 6rem;
  font-size: 6rem;
  font-weight: 700;
}

.empty-message {
  font-size: 2.4rem;
  font-weight: 700;
}
</style>
