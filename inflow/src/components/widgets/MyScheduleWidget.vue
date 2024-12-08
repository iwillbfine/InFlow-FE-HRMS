<template>
  <WidgetItem label="올해 나의 일정" h="42rem" w="100%">
    <MonthSelectNav @current-month-change="handleMonthChange"></MonthSelectNav>
    <FlexItem class="schedule-list-wrapper" w="100%" h="calc(100% - 5rem)">
      <UlItem
        v-if="scheduleList.length > 0"
        class="schedule-list"
        w="100%"
        fld="column"
      >
        <LiItem
          v-for="(item, index) in scheduleList"
          :key="index"
          class="schedule-item"
          fld="row"
          w="100%"
          h="2.8rem"
          fs="1.4rem"
        >
          <GridItem class="schedule-wrapper" w="100%" gtc="1fr 4fr 1fr">
            <span>{{ parseMonthAndDay(item.event_date) }}</span>
            <span>{{ item.event_name }}</span>
            <strong :class="parseDday(item.event_date).ddayClass">{{
              parseDday(item.event_date).ddayLabel
            }}</strong>
          </GridItem>
        </LiItem>
      </UlItem>
      <FlexItem
        v-else
        class="empty-message-wrapper"
        fld="row"
        w="100%"
        h="100%"
        fs="1.6rem"
        fw="500"
      >
        <span class="empty-message">일정이 존재하지 않습니다.</span>
      </FlexItem>
    </FlexItem>
  </WidgetItem>
</template>

<script setup>
import MonthSelectNav from '@/components/nav/MonthSelectNav.vue';
import WidgetItem from '@/components/widgets/WidgetItem.vue';
import FlexItem from '@/components/semantic/FlexItem.vue';
import GridItem from '@/components/semantic/GridItem.vue';
import UlItem from '@/components/semantic/UlItem.vue';
import LiItem from '@/components/semantic/LiItem.vue';
import { ref, onMounted } from 'vue';
import { getHomeInfo } from '@/api/emp_info';

// emit 정의
const emit = defineEmits(['closest-event']);

// 상태 변수
const emitEvent = ref(null);
const eid = ref(null);
const scheduleList = ref([]);

// 일정 데이터 가져오기
const fetchScheduleData = async (eid, month) => {
  const response = await getHomeInfo(eid, month);
  if (response.success) {
    scheduleList.value = response.content;
    if (!emitEvent.value) {
      emitClosestEvent(); // 가장 가까운 이벤트 emit
    }
  }
};

// 가장 가까운 이벤트 계산 및 emit
const emitClosestEvent = () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0); // 시간 제거

  // 오늘 및 오늘 이후 일정 필터링
  const upcomingEvents = scheduleList.value.filter((item) => {
    const eventDate = new Date(item.event_date);
    eventDate.setHours(0, 0, 0, 0);
    return eventDate >= today;
  });

  // 가장 가까운 날짜 찾기
  if (upcomingEvents.length > 0) {
    const closestEvent = upcomingEvents.reduce((closest, current) => {
      const closestDate = new Date(closest.event_date);
      const currentDate = new Date(current.event_date);
      return currentDate < closestDate ? current : closest;
    });

    emitEvent.value = closestEvent;
    emit('closest-event', closestEvent);
  } else {
    emit('closest-event', null);
  }
};

// 날짜 포맷 함수
const parseMonthAndDay = (date) => {
  const newDate = new Date(date);
  const month = newDate.getMonth();
  const day = newDate.getDate();
  return `${month + 1}/${day}`;
};

// D-Day 계산 함수
const parseDday = (date) => {
  const targetDate = new Date(date);
  const today = new Date();
  targetDate.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);

  const diff = (targetDate - today) / (1000 * 60 * 60 * 24);

  let ddayLabel = '';
  let ddayClass = '';

  if (diff === 0) {
    ddayLabel = 'D-DAY';
    ddayClass = 'red';
  } else if (diff > 0) {
    ddayLabel = `D-${diff}`;
    ddayClass = Math.abs(diff) < 5 ? 'red' : 'black';
  } else {
    ddayLabel = `D+${Math.abs(diff)}`;
    ddayClass = 'gray';
  }

  return { ddayLabel, ddayClass };
};

// 월 변경 핸들러
const handleMonthChange = (newMonth) => {
  fetchScheduleData(eid.value, newMonth);
};

// 초기 데이터 로드
onMounted(() => {
  eid.value = localStorage.getItem('employeeId');
  if (eid.value) {
    const month = new Date().getMonth() + 1;
    fetchScheduleData(eid.value, month);
  }
});
</script>

<style scoped>
.schedule-list-wrapper {
  padding: 1.5rem 1rem;
  overflow: auto;
}

.schedule-list {
  gap: 1rem;
}

.schedule-wrapper {
  text-align: center;
  align-items: center;
}

.gray {
  color: #aaa !important;
}

.red {
  color: #ff4d4f !important;
}

.black {
  color: black !important;
}

.empty-message-wrapper {
  justify-content: center;
}

.empty-message-wrapper span {
  margin-top: 2rem;
}
</style>
