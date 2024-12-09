<template>
  <WidgetItem label="나의 근태 현황" h="20rem" w="100%">
    <FlexItem class="widget-content" fld="row" h="100%" w="100%">
      <FlexItem
        v-for="(item, index) in list"
        :key="index"
        class="content-item"
        fld="column"
        fs="1.5rem"
        c="#003566"
      >
        <InfoCircle :content="item.content"></InfoCircle>
        <span>{{ item.label }}</span>
      </FlexItem>
    </FlexItem>
  </WidgetItem>
</template>
<script setup>
import WidgetItem from '@/components/widgets/WidgetItem.vue';
import InfoCircle from '@/components/common/InfoCircle.vue';
import FlexItem from '@/components/semantic/FlexItem.vue';
import { ref, computed, onMounted } from 'vue';
import { getLeftAllVacationsByEmployeeId } from '@/api/vacation';
import { getOvertimesByEmployeeId } from '@/api/attendance';

const eid = ref(null);
const vacationList = ref([]);
const overtimeList = ref([]);

const props = defineProps({
  employee: {
    type: Object,
    required: true,
  },
});

const list = ref([
  { content: 'D-00', label: '월급날' },
  { content: '0', label: '근속 일수' },
  { content: '0/0', label: '연차 현황' },
  { content: '00:00', label: '초과 근무 시간' },
]);

const fetchVacationData = async (eid) => {
  try {
    const response = await getLeftAllVacationsByEmployeeId(eid);

    if (response.success) {
      vacationList.value = response.content;

      for (const vacation of vacationList.value) {
        if (vacation.vacation_type_name === '연차') {
          const vacationContent = `${vacation.vacation_left}/${vacation.vacation_left + vacation.vacation_used}`;
          list.value[2] = { ...list.value[2], content: vacationContent };
          return;
        }
      }
    }
  } catch (e) {
    console.error('연차 정보를 가져오는데 실패했습니다.', e);
  }
};

const fetchOvertimeData = async (eid, date) => {
  try {
    const response = await getOvertimesByEmployeeId(eid, date);

    if (response.success && response.content.length > 0) {
      overtimeList.value = response.content;

      const now = new Date();
      const startTime = new Date(overtimeList.value[0].start_time);
      const endTime = new Date(overtimeList.value[0].end_time);

      if (startTime <= now && now <= endTime) {
        const diffTime = now - startTime;
        const formattedTime = formatTime(diffTime);
        list.value[3] = { ...list.value[3], content: formattedTime };
      } else if (now > endTime && isSameDay(endTime, now)) {
        const totalTime = endTime - startTime;
        list.value[3] = {
          ...list.value[3],
          content: formatTime(totalTime),
        };
      } else {
        list.value[3] = { ...list.value[3], content: '00:00' };
      }
    } else {
      console.warn('초과 근무 데이터가 없습니다.');
      list.value[3] = { ...list.value[3], content: '00:00' };
    }
  } catch (e) {
    console.error('초과 근무 정보를 가져오는데 실패했습니다.', e);
  }
};

const calculateDaysUntilPayday = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  const paydayThisMonth = new Date(year, month, 21); // 이번 달 21일

  let payday;
  if (today > paydayThisMonth) {
    // 월급날이 이미 지났다면 다음 달 21일로 설정
    payday = new Date(year, month + 1, 21);
  } else {
    // 아직 월급날이 지나지 않았다면 이번 달 21일로 설정
    payday = paydayThisMonth;
  }

  // 남은 날짜 계산
  const diffTime = payday - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); // 밀리초 → 일수 변환

  return `D-${diffDays}`;
};

// 날짜 비교 함수: 두 날짜가 같은 날인지 확인
const isSameDay = (date1, date2) => {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
};

// 시간 포맷팅 함수 (밀리초를 시:분:초로 변환)
const formatTime = (millis) => {
  const hours = Math.floor(millis / (1000 * 60 * 60)); // 시간 계산
  const minutes = Math.floor((millis % (1000 * 60 * 60)) / (1000 * 60)); // 분 계산

  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
};

// 근속 일수를 계산하는 함수
const calculateTenureDays = (joinDate) => {
  const joinDateObj = new Date(joinDate);
  const currentDate = new Date();
  const diffTime = Math.abs(currentDate - joinDateObj); // 두 날짜 차이의 절대값
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); // 밀리초를 일수로 변환
  return diffDays;
};

// 이번 달 가져오기
const getCurMonth = () => {
  const today = new Date();

  const year = today.getFullYear(); // 연도 가져오기
  const month = String(today.getMonth() + 1).padStart(2, '0'); // 월 가져오기 (0부터 시작하므로 +1, 두 자리로 맞춤)

  const curMonth = `${year}-${month}`;
  return curMonth;
};

onMounted(() => {
  eid.value = localStorage.getItem('employeeId');

  const paydayCountdown = calculateDaysUntilPayday();
  list.value[0] = { ...list.value[0], content: paydayCountdown };

  if (props.employee) {
    const tenureDays = calculateTenureDays(props.employee.join_date);
    list.value[1] = { ...list.value[1], content: tenureDays.toString() };
  }
  fetchVacationData(eid.value);
  fetchOvertimeData(eid.value, getCurMonth());
});
</script>
<style scoped>
.widget-content {
  justify-content: space-around;
  align-items: center;
  overflow: auto;
}

.content-item {
  min-width: 11rem;
  align-items: center;
  gap: 1rem;
}
</style>
