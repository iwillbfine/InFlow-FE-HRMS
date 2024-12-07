<!-- 부서 상세정보 조회 컴포넌트 -->

<template>
  <div class="button-container">
    <button v-if="departmentInfo" class="button" @click="toggleEditMode">
      <!-- 수정 클릭하면 수정할 수 있도록 바뀜, 수정 버튼은 저장으로 바뀜, 저장 클릭하면 저장되었다는 팝업창 뜸-->
      {{ isEditMode ? '저장' : '수정' }}
    </button>

    <button
      v-if="departmentInfo"
      class="button"
      style="background-color: rgb(170, 170, 170)"
      @click="openDeleteModal"
    >
      삭제
    </button>
  </div>
  <div style="width: 100%; height: 100%; margin-top: 2rem">
    <div v-if="!departmentInfo" class="no-info">
      <span>
        <p>부서 정보 조회를 위해 부서를 선택해주세요</p>
      </span>
    </div>

    <TableItem v-else gtc="5fr 20fr" style="height: 50%">
      <TableRow>
        <TableCell class="h-7" th fs="1.6rem" topl>부서명</TableCell>
        <TableCell class="h-7 pl-2" fs="1.6rem" topr>
          <div v-if="isEditMode">
            <input
              v-model="editableData.department_name"
              type="text"
              class="editable-input"
            />
          </div>
          <div v-else>
            <span>
              {{ departmentInfo.department_name || '정보가 없습니다.' }}
            </span>
          </div>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell class="h-7" th fs="1.6rem" botl>부서 코드</TableCell>
        <TableCell class="h-7 pl-2" fs="1.6rem" botr>
          <div v-if="isEditMode">
            <input
              v-model="editableData.department_code"
              type="text"
              class="editable-input"
            />
          </div>
          <div v-else>
            <span>
              {{ departmentInfo.department_code || '정보가 없습니다.' }}
            </span>
          </div>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell class="h-7" th fs="1.6rem" botl>상워 부서명</TableCell>
        <TableCell class="h-7 pl-2" fs="1.6rem" botr>
          <div v-if="isEditMode">
            <select
              v-model="editableData.upper_department_name"
              class="editable-select"
            >
              <option value="" disabled selected>
                상위 부서를 선택해주세요
              </option>
              <option
                v-for="dept in upperDepartments"
                :key="dept.department_code"
                :value="dept.department_name"
              >
                {{ dept.department_name }}
              </option>
            </select>
          </div>
          <div v-else>
            <span>
              {{ departmentInfo.upper_department_name || '정보가 없습니다.' }}
            </span>
          </div>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell class="h-7" th fs="1.6rem" botl>최소 인원수</TableCell>
        <TableCell class="h-7 pl-2" fs="1.6rem" botr>
          <div v-if="isEditMode">
            <input
              v-model="editableData.min_employee_num"
              type="number"
              class="editable-input"
            />
          </div>
          <div v-else>
            <span>
              {{ departmentInfo.min_employee_num || '정보가 없습니다.' }} </span
            >명
          </div>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell class="h-7" th fs="1.6rem" botl>부서장</TableCell>
        <TableCell class="h-7 pl-2" fs="1.6rem" botr>
          <div v-if="isEditMode">
            <input
              v-model="editableData.department_head_name"
              type="text"
              class="editable-input"
            />
          </div>
          <div v-else>
            <span>
              {{ departmentInfo.department_head_name || '정보가 없습니다.' }}
            </span>
          </div>
        </TableCell>
      </TableRow>
    </TableItem>
  </div>

  <!-- 성공 메시지 모달 -->
  <div v-if="savedButtonStatus" class="modal-alert">
    <div class="modal">
      <p>성공적으로 저장되었습니다!</p>
    </div>
  </div>

  <!-- 삭제 성공 메시지 모달 -->
  <div v-if="deletedButtonStatus" class="modal-alert">
    <div class="modal">
      <p>성공적으로 삭제되었습니다!</p>
    </div>
  </div>

  <!-- 삭제 확인 모달 -->
  <div
    v-if="isDeleteModalVisible"
    class="modal-alert"
    @animationend="handleAnimationEnd"
  >
    <div
      class="delete-modal"
      :class="{ 'fade-out': isDeleteModalFading }"
      style="padding: 3rem"
    >
      <p>정말로 삭제하시겠습니까?</p>
      <div class="modal-buttons">
        <button class="modal-confirm" @click="deleteDepartment">삭제</button>
        <button
          class="modal-confirm"
          style="background-color: #f2f2f2; color: #003566"
          @click="closeDeleteModal"
        >
          취소
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import TableItem from '@/components/semantic/TableItem.vue';
import TableRow from '@/components/semantic/TableRow.vue';
import TableCell from '@/components/semantic/TableCell.vue';

import apiClient from '@/api/axios';

import { ref, watch, onMounted } from 'vue';
import { useRoute } from 'vue-router';

const departmentInfo = ref(null);
const route = useRoute();
const isEditMode = ref(false);
const editableData = ref({});
const upperDepartments = ref([]); // 상위 부서 목록
const isDeleteModalVisible = ref(false); // 삭제 확인 모달 상태

// 부서 상세 정보 가져오기
const fetchDepartmentInfo = async (departmentCode) => {
  try {
    const response = await apiClient.get(
      `/departments/detail/department-code/${departmentCode}`
    );
    departmentInfo.value = response.data.content[0];
    // editableData 초기화
    editableData.value = { ...departmentInfo.value };
  } catch (error) {
    console.error('부서 상세 정보를 가져오는 데 실패했습니다.', error);
  }
};

// 상위 부서 목록 가져오기
const fetchUpperDepartments = async () => {
  try {
    const response = await apiClient.get('/departments/dropdown');
    upperDepartments.value = response.data.content;
  } catch (error) {
    console.error('상위 부서 목록을 가져오는 데 실패했습니다.', error);
  }
};

// 수정/저장 버튼 핸들링
const toggleEditMode = async () => {
  if (isEditMode.value) {
    // 저장 로직 실행
    try {
      const response = await apiClient.patch(
        `/departments/${departmentInfo.value.department_code}`,
        editableData.value
      );
      departmentInfo.value = response.data.content;
      savedButtonStatus.value = true;
      // 3초 후 모달창 닫기
      setTimeout(() => {
        closeModal();
      }, 1200);

      setTimeout(() => {
        window.location.reload(); // 새로고침
      }, 1300);
    } catch (error) {
      console.error('부서 정보 수정에 실패했습니다.', error);
    }
  }
  isEditMode.value = !isEditMode.value; // 수정 모드 상태 토글
};

// 삭제 확인 모달 열기
const openDeleteModal = () => {
  isDeleteModalVisible.value = true;
};

// 삭제 확인 모달 닫기
const closeDeleteModal = () => {
  isDeleteModalVisible.value = false;
};

// 부서 삭제 요청
const deleteDepartment = async () => {
  try {
    await apiClient.delete(
      `/departments/${departmentInfo.value.department_code}`
    );
    closeDeleteModal();
    departmentInfo.value = null; // 삭제 후 데이터 초기화
    deletedButtonStatus.value = true;
    setTimeout(() => {
      window.location.reload(); // 새로고침
    }, 1300);
  } catch (error) {
    console.error('부서 삭제에 실패했습니다.', error);
  }
};

// 수정 저장 버튼 상태
const savedButtonStatus = ref(false); // 기본값 false로 -> 저장 되고 나면 true로 바뀜
// 수정 완료되면 알림 모달창 띄우고 사라지도록
// 모달창 닫기 핸들러
const closeModal = () => {
  savedButtonStatus.value = false; // 상태 초기화
};

// 삭제 완료되면 모달창 띄우고 사라짐
const deletedButtonStatus = ref(false);

// 라우트 변경 감지
watch(
  () => route.query.departmentCode,
  (newCode) => {
    if (newCode) fetchDepartmentInfo(newCode);
  },
  { immediate: true }
);

// 컴포넌트 마운트 시 데이터 초기화
onMounted(() => {
  fetchUpperDepartments(); // 상위 부서 목록 호출
});

// 모달 페이드아웃 상태 추가
const isDeleteModalFading = ref(false);

// 애니메이션 종료 처리
const handleAnimationEnd = () => {
  if (isDeleteModalFading.value) {
    isDeleteModalVisible.value = false; // 모달 완전 제거
    isDeleteModalFading.value = false; // 상태 초기화
  }
};
</script>

<style scoped>
span {
  color: #003566;
  margin-left: 20px;
  font-size: 1.6rem;
  font-weight: 500;
}

.no-info {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%; /* 부모 높이를 100%로 설정 */
  text-align: center; /* 텍스트 가운데 정렬 */
  font-size: 1.5rem; /* 폰트 크기 */
  color: #555; /* 텍스트 색상 */
}

.button-container {
  width: 100%;
  display: flex;
  justify-content: flex-end;
  margin-bottom: 1rem;
}
.button {
  background-color: #003566;
  padding: 0.7rem 2rem;
  color: white;
  border-radius: 3px;
  font-size: 1.3rem;
  align-items: flex-end;
  margin-left: 8px;
}

/* 입력 필드 스타일 */
.editable-input {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 2px;
  outline: none;
  transition: border-color 0.3s ease;
  box-shadow: inset 0px 1px 2px rgba(0, 0, 0, 0.25);
  background: #f8f8f8;
}

.editable-input:focus {
  border-color: #003566; /* 포커스 시 색상 */
}

/* 드롭다운 스타일 */
.editable-select {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  background-color: white;
  outline: none;
  transition: border-color 0.3s ease;
}

.editable-select:focus {
  border-color: #003566; /* 포커스 시 색상 */
}

/* 모달 css */
.modal-alert {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
}

.modal {
  background-color: white;
  padding: 2rem;
  border-radius: 8px;
  text-align: center;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  animation:
    fadeIn 0.3s ease-out,
    fadeOut 0.3s ease-out 2.7s;
}

.delete-modal {
  background-color: white;
  padding: 2rem;
  border-radius: 8px;
  text-align: center;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  animation: fadeIn 0.3s ease-out;
}

.delete-modal.fade-out {
  animation: fadeOut 0.3s ease-out;
}

.delete-modal p {
  font-size: 1.7rem;
  margin: 0;
}

.modal p {
  font-size: 1.7rem;
  margin: 0;
}
.modal-confirm {
  font-size: 1.5rem;
  background-color: #003566;
  color: white;
  padding: 5px 25px;
  border-radius: 2px;
}
.modal-buttons {
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: space-evenly;
  margin-top: 10px;
}

/* 모달 페이드 인/아웃 애니메이션 */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10%);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeOut {
  from {
    opacity: 1;
    transform: translateY(0);
  }
  to {
    opacity: 0;
    transform: translateY(-10%);
  }
}
</style>
