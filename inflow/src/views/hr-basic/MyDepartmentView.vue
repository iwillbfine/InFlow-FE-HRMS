<template>
  <CommonNav :cur="2"></CommonNav>
  <CommonHeader :user-name="employeeName"></CommonHeader>
  <MainItem w="calc(100% - 12rem)" minh="calc(100% - 10rem)">
    <CommonMenu :cur="4" :list="menuList"></CommonMenu>
    <div class="content-section" w="100%">
      <div class="left">
        <!-- 부서 근태 정보 -->
        <MyDepartmentAttendance 
          class="department-attendance"
          :attendance-stats="attendanceStats"/>
        <!-- 사원 목록 조회 -->
        <SearchDepartmentMember 
            v-if="isDataLoaded"
            class="search-department-member"
            :members="members"
            :departmentCode="departmentCode"
            @updateAttendanceStats="handleUpdateAttendanceStats"/>
      </div>
      <div class="right">
        sdsㅇ
      </div>
    </div>
  </MainItem>
</template>

<script setup>
import CommonNav from '@/components/common/CommonNav.vue';
import CommonHeader from '@/components/common/CommonHeader.vue';
import CommonMenu from '@/components/common/CommonMenu.vue';
import MainItem from '@/components/semantic/MainItem.vue';
import FlexItem from '@/components/semantic/FlexItem.vue';

import MyDepartmentAttendance from '@/views/hr-basic/my-department/MyDepartmentAttendance.vue';
import SearchDepartmentMember from '@/views/hr-basic/my-department/SearchDepartmentMember.vue'
import { ref, onMounted, watch } from 'vue';
import SectionItem from '@/components/semantic/SectionItem.vue';

import apiClient from '@/api/axios';


const menuList = ref([
  { name: '개인신상관리', link: '/hr-basic/my-info' },
  { name: '근태 정보', link: '/hr-basic/attendance' },
  { name: '급여 및 수당', link: '/hr-basic/salary' },
  { name: '계약서 서명', link: '/hr-basic/document' },
  { name: '내 부서 관리', link: '/hr-basic/my-department'},
]);

const eid = ref(null);
const employeeName = ref('');

onMounted(() => {
  eid.value = localStorage.getItem('employeeId');
  employeeName.value = localStorage.getItem('employeeName');
  if (!eid.value) {
    alert("로그인이 필요합니다.");
    router.push('/login');
  }
});

// 0. 로컬 스토리지에서 로그인된 사원의 정보 가져오기
const departmentCode = ref('');
const members = ref([]);
const isDataLoaded = ref(false); // 데이터 로드 상태를 나타내는 플래그


const fetchMyDepartmentData = async () => {
  try {
    // 로컬 스토리지에서 employeeId와 accessToken 가져오기
    const employeeId = localStorage.getItem('employeeId');
    const token = localStorage.getItem('accessToken');
    // console.log("로그인된 사원 코드: ", employeeId);
    // console.log("토큰 정보:", token);

    // 로그인된 사원의 기본 정보 가져오기
    const employeeData = await apiClient.get(`/employees/id/${employeeId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    // console.log("로그인된 사원 기본 정보:", employeeData);

    departmentCode.value = employeeData.data.content.department_code;
    console.log("로그인된 사원의 부서 코드:", departmentCode.value);

    // 부서 구성원 목록 가져오기
    const departmentMembers = await apiClient.get(
      `/departments/my-department/${departmentCode.value}/members`,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    members.value = departmentMembers.data.content;

    console.log('부서 구성원:', members.value);

    isDataLoaded.value = true; // 데이터가 로드되었음을 표시
    console.log("isDataLoaded값:", isDataLoaded.value);
  } catch (error) {
    console.error('데이터 로드 중 에러 발생:', error);
    alert('데이터를 불러오는 데 실패했습니다.');
  }
};
onMounted(fetchMyDepartmentData);


onMounted(async () => {
  console.log("초기 departmentCode:", departmentCode.value);
  console.log("초기 members:", members.value);

  await fetchMyDepartmentData();
  console.log("데이터 로드 후:", members.value, departmentCode.value);
});

watch(
  () => isDataLoaded.value,
  (newVal) => {
    console.log("isDataLoaded 변경:", newVal);
    console.log("departmentCode:", departmentCode.value);
    console.log("members:", members.value);
    console.log("departmentCode:", departmentCode);
    console.log("DOM 상태 확인:", document.querySelector('.search-department-member'));

  },
  { immediate: true }
);


watch(
  () => departmentCode.value && members.value.length > 0,
  (newCondition) => {
    console.log("데이터 로드 상태 변경:", newCondition);
    isDataLoaded.value = newCondition;
    console.log("isDataLoaded watch값:", isDataLoaded.value);
  }
);

const attendanceStats = ref({ total: 0, working: 0 });

// SearchDepartmentMember로부터 데이터를 전달받는 핸들러
const handleUpdateAttendanceStats = (stats) => {
    attendanceStats.value = stats;
};

</script>

<style scoped>
.content-section {
  position: absolute;
  top: 7.5rem;
  right: 0;
  padding-left: 2rem;
  padding-right: 2rem;
  padding-top: 2rem;
  padding-bottom: 5rem;
  flex-grow: 1;
  align-items: center;
  display: flex;
  width: 100%;
  height: 84vh;
}


.left {
  width: 20%;
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: #F8F8F8;
  align-items: center;
  padding: 1rem;
}

.right {
  width: 80%; 
  background-color: yellow;
  height: 100%;
}

.department-attendance {
  width: 100%;
  height: 20%;
  position: relative;
  top: 0rem;
  position: sticky; /* 고정 위치 설정 */
}

.search-department-member {
  width: 100%;
  height: 80%;
  margin-top: 10px;
  overflow-y: auto; 
}

</style>
