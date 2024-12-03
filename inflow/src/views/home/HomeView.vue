<template>
  <CommonNav></CommonNav>
  <LoadingOverlay :is-visible="employee === null" message="로딩 중입니다..."></LoadingOverlay>
  <CommonHeader v-if="employee" :user-name="employee.name"></CommonHeader>
  <MainItem v-if="employee" w="calc(100% - 12rem)" minh="calc(100% - 10rem)">
    <GridItem class="grid-container" w="85%" gtc="repeat(20, 1fr)">
      <div class="grid-item">
        <MyAttendanceWidget v-if="employee" :employee="employee"></MyAttendanceWidget>
      </div>
      <div class="grid-item">
        <ScheduleDdayWidget :closest-event="closestEvent"></ScheduleDdayWidget>
      </div>
      <div class="grid-item">
        <MyScheduleWidget @closest-event="handleClosestEvent"></MyScheduleWidget>
      </div>
      <div class="grid-item">
        <MyTeamMemberWidget v-if="employee" :dcode="employee.department_code"></MyTeamMemberWidget>
      </div>
    </GridItem>
  </MainItem>
</template>

<script setup>
import { ref, onMounted } from 'vue'; // 상태 관리 및 생명주기 훅
import CommonNav from '@/components/common/CommonNav.vue';
import CommonHeader from '@/components/common/CommonHeader.vue';
import MainItem from '@/components/semantic/MainItem.vue';
import GridItem from '@/components/semantic/GridItem.vue';
import MyAttendanceWidget from '@/components/widgets/MyAttendanceWidget.vue';
import ScheduleDdayWidget from '@/components/widgets/ScheduleDdayWidget.vue';
import MyTeamMemberWidget from '@/components/widgets/MyTeamMemberWidget.vue';
import MyScheduleWidget from '@/components/widgets/MyScheduleWidget.vue';
import LoadingOverlay from '@/components/common/LoadingOverlay.vue';
import { useRouter } from 'vue-router';
import { getEmployeeById } from '@/api/emp_info';

// 상태 변수
const eid = ref(null);
const employee = ref(null);
const closestEvent = ref(null);
const router = useRouter();

const fetchEmployeeData = async (eid) => {
  try {
    employee.value = await getEmployeeById(eid);
  } catch (e) {
    console.error('사원 정보를 가져오는데 실패했습니다.', e);
  }
};

const handleClosestEvent = (event) => {
  closestEvent.value = event;
};

// 컴포넌트가 마운트될 때 로컬 저장소에서 사원 정보를 가져옴
onMounted(() => {
  // 사원 ID 확인
  eid.value = localStorage.getItem('employeeId');
  if (!eid.value) {
    alert('로그인이 필요합니다.');
    router.push('/login');
  } else {
    fetchEmployeeData(eid.value);
  }
});
</script>

<style scoped>
.grid-container {
  justify-content: center;
  gap: 2rem;
  padding: 1rem;
}

.grid-item:nth-child(1) {
  grid-column: span 11;
}

.grid-item:nth-child(2) {
  grid-column: span 9;
}

.grid-item:nth-child(3) {
  grid-column: span 9;
}

.grid-item:nth-child(4) {
  grid-column: span 11;
}
</style>
