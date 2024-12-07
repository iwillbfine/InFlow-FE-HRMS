<template>
  <div class="search-department-member">
    <div class="filter-button">
      <label>
        <input
          v-model="selectedFilter"
          type="radio"
          name="filter"
          value="전체"
          @change="filterByStatus"
        />
        전체
      </label>
      <label>
        <input
          v-model="selectedFilter"
          type="radio"
          name="filter"
          value="근무중"
          @change="filterByStatus"
        />
        근무중
      </label>
      <label>
        <input
          v-model="selectedFilter"
          type="radio"
          name="filter"
          value="부재중"
          @change="filterByStatus"
        />
        부재중
      </label>
    </div>
    <div class="search-bar">
      <input
        v-model="searchKeyword"
        type="text"
        placeholder="사원명으로 검색"
      />
      <button @click="filterMembers">검색</button>
    </div>
    <div style="width: 100%">
      <div
        style="
          display: flex;
          flex-direction: column;
          width: 100%;
          align-items: center;
          justify-content: center;
        "
      >
        <div
          v-for="employee in filteredMembers"
          :key="employee.employee_number"
          @click="handleSelected(employee)"
          class="one-member-content"
        >
          <div class="detail">
            <div class="name">
              <span>{{ employee.employee_name }}</span>
            </div>
            <div class="employee-number">
              <span>{{ employee.employee_number }}</span>
            </div>
            <div class="department-path">
              <span>{{ employee.department_path }}</span>
            </div>
          </div>
          <div class="attendance-status">
            <span
              class="status-icon"
              :class="employee.workStatus === '근무중' ? 'work' : 'absent'"
            >
            </span>
            <span>{{ employee.workStatus }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, watch, onMounted, computed } from 'vue';

// props 선언
const props = defineProps({
  departmentCode: {
    type: String,
    required: true,
  },
  members: Array,
});

// 상태 관리
const searchKeyword = ref('');
const filteredMembers = ref([]);

// 근태 상태 분류
const categorizedMembers = computed(() => {
  return props.members.map((member) => {
    const statusName = member.attendance_status_type_name;

    // 근무 상태 분류
    if (statusName === '정상출근' || statusName === '지각') {
      return { ...member, workStatus: '근무중' };
    } else {
      return { ...member, workStatus: '부재중' };
    }
  });
});

// 상태 추가
const selectedFilter = ref('전체'); // 기본값 "전체"

// 필터링 로직
const filterByStatus = () => {
  if (selectedFilter.value === '전체') {
    // 전체 목록을 보여줌
    filteredMembers.value = categorizedMembers.value;
  } else {
    // 선택한 상태에 따라 필터링
    filteredMembers.value = categorizedMembers.value.filter(
      (member) => member.workStatus === selectedFilter.value
    );
  }
};

// 검색 기능과 연계
const filterMembers = () => {
  if (!categorizedMembers.value || categorizedMembers.value.length === 0) {
    console.error('members가 유효하지 않습니다.');
    filteredMembers.value = []; // 빈 배열로 초기화
    return;
  }

  const keyword = searchKeyword.value.toLowerCase();

  let tempFiltered = categorizedMembers.value;

  // 검색어에 따른 필터링
  if (keyword !== '') {
    tempFiltered = tempFiltered.filter((member) =>
      member.employee_name.toLowerCase().includes(keyword)
    );
  }

  // 선택된 필터에 따른 추가 필터링
  if (selectedFilter.value !== '전체') {
    tempFiltered = tempFiltered.filter(
      (member) => member.workStatus === selectedFilter.value
    );
  }

  filteredMembers.value = tempFiltered;
};

// 검색어와 필터 버튼 변경 시 모두 필터링 로직 실행
watch([searchKeyword, selectedFilter], filterMembers);

// members 변경 시 필터링
watch(
  () => props.members,
  (newVal) => {
    if (newVal && newVal.length > 0) {
      filteredMembers.value = categorizedMembers.value; // 변경된 데이터 반영
    }
  },
  { immediate: true }
);

/* 근무 인원수 계산해서 부모에게 Emit:*/
// 부모로 이벤트 전송을 위한 emit
const emit = defineEmits(['updateAttendanceStats', 'employeeSelected']);

// 근무 상태 계산
const attendanceStats = computed(() => {
  const totalMembers = categorizedMembers.value.length;
  const workingMembers = categorizedMembers.value.filter(
    (member) => member.workStatus === '근무중'
  ).length;
  return {
    total: totalMembers,
    working: workingMembers,
  };
});

const handleSelected = (employee) => {
  emit('employeeSelected', employee);
};

// attendanceStats 변경 시 부모에게 알림
watch(attendanceStats, (newStats) => {
  emit('updateAttendanceStats', newStats); // 부모로 전달
});
</script>

<style scoped>
.search-department-member {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.search-bar {
  background-color: white;
  border: 0.3px solid #cccccc;
  border-radius: 1px;
  width: 95%;
  display: flex;
  justify-content: space-between;
  padding: 1rem 2rem;
}

.search-bar input::placeholder {
  font-size: 13px;
}

.one-member-content {
  width: 95%;
  background-color: white;
  padding: 1rem;
  display: flex;
  justify-content: space-between;
  margin-top: 5px;
  height: 100%;
}

.one-member-content:hover {
  background-color: #f4f4f4;
}

.name {
  font-size: 1.6rem;
  font-weight: 500;
}
.employee-number {
  font-size: 1rem;
}

.department-path {
  font-size: 1rem;
}

.attendance-status {
  font-size: 1.2rem;
  font-weight: 500;
}

.status-icon {
  display: inline-block;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  margin-right: 5px;
}

.status-icon.work {
  /* 근무중 - 파란 점 */
  background-color: #22e500;
}

.status-icon.absent {
  /* 부재중 - 빨간 점 */
  background-color: #ff4949;
}

.filter-button {
  display: flex;
  gap: 6px;
  margin: 1rem 0;
  justify-items: flex-end;
}

.filter-button input[type='radio'] {
  appearance: auto; /* 브라우저 기본 스타일 활성화 */
  -webkit-appearance: radio; /* 웹킷 기반 브라우저 스타일 */
  accent-color: #007bff; /* 라디오 버튼 색상 (브라우저 지원 필요) */
  margin-right: 5px;
}

.filter-button label {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 13px;
  cursor: pointer;
}
</style>
