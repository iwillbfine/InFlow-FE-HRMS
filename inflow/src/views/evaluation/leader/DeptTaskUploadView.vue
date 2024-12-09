<template>
  <CommonArticle class="task-upload-article" label="부서 과제 등록" w="90%">
    <FlexItem
      class="year-half-section"
      fld="row"
      fs="1.6rem"
      fw="500"
      c="#003566"
    >
      <YearDropDown @valid-date-selected="handleYearSelected" />
      <HalfDropdown @half-selected="handleHalfSelected" />
    </FlexItem>
    <!-- <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div> -->
    <TableItem gtc="3fr 6fr 8fr">
      <TableRow>
        <TableCell th fs="1.6rem" topl>유형</TableCell>
        <TableCell th fs="1.6rem">과제명</TableCell>
        <TableCell th fs="1.6rem">과제 내용</TableCell>
      </TableRow>
      <TableRow>
        <TableCell class="mid h-7" fs="1.6rem" botl>
          <DropdownItem
            :list="taskTypes"
            w="12rem"
            placeholder="과제 유형"
            @update:selectedItem="handleTaskTypeSelected"
            :disabled="isLoading"
          ></DropdownItem>
        </TableCell>
        <TableCell class="mid h-7" fs="1.6rem">
          <FlexItem
            class="input-wrapper"
            h="100%"
            w="100%"
            bgc="#F8F8F8"
            b="1px solid #DBDBDB"
            br="0.1rem"
          >
            <input
              name="task-name-input"
              type="text"
              v-model="taskName"
              :disabled="isLoading"
              placeholder="과제명을 입력하세요"
            />
          </FlexItem>
        </TableCell>
        <TableCell class="mid h-7" fs="1.6rem">
          <FlexItem
            class="input-wrapper"
            h="100%"
            w="100%"
            bgc="#F8F8F8"
            b="1px solid #DBDBDB"
            br="0.1rem"
          >
            <input
              name="task-content-input"
              type="text"
              v-model="taskContent"
              :disabled="isLoading"
              placeholder="과제 내용을 입력하세요"
            />
          </FlexItem>
        </TableCell>
      </TableRow>
    </TableItem>
    <ButtonItem
      class="submit-btn"
      h="3.6rem"
      w="7.2rem"
      bgc="#003566"
      br="0.6rem"
      c="#fff"
      fs="1.6rem"
      @click="handleSubmit"
      :disabled="isLoading"
      >{{ isLoading ? '등록 중...' : '등록' }}</ButtonItem
    >
  </CommonArticle>

  <CommonArticle label="등록된 과제 목록" w="90%">
    <TableItem gtc="2fr 3fr 6fr 8fr">
      <TableRow>
        <TableCell th fs="1.6rem" topl>No</TableCell>
        <TableCell th fs="1.6rem">유형</TableCell>
        <TableCell th fs="1.6rem">과제명</TableCell>
        <TableCell th fs="1.6rem" topr>과제 내용</TableCell>
      </TableRow>
      <TableRow v-for="(task, index) in taskList" :key="index">
        <TableCell class="mid" fs="1.6rem">{{ index + 1 }}</TableCell>
        <TableCell class="mid" fs="1.6rem">{{ task.type }}</TableCell>
        <TableCell class="mid" fs="1.6rem">{{ task.name }}</TableCell>
        <TableCell class="mid" fs="1.6rem">{{ task.content }}</TableCell>
      </TableRow>
    </TableItem>
  </CommonArticle>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import CommonArticle from '@/components/common/CommonArticle.vue';
import FlexItem from '@/components/semantic/FlexItem.vue';
import TableItem from '@/components/semantic/TableItem.vue';
import TableRow from '@/components/semantic/TableRow.vue';
import TableCell from '@/components/semantic/TableCell.vue';
import DropdownItem from '@/components/dropdowns/DropdownItem.vue';
import ButtonItem from '@/components/semantic/ButtonItem.vue';
import YearDropDown from '@/components/dropdowns/YearDropDown.vue';
import HalfDropdown from '@/components/dropdowns/HalfDropdown.vue';
import {
  getAllTaskTypes,
  createTaskItem,
  findDepartmentTaskItems,
} from '@/api/evaluation';

// 상태 관리
const selectedYear = ref(null);
const selectedHalf = ref(null);
const taskTypes = ref([]);
const selectedTaskType = ref(null);
const taskName = ref('');
const taskContent = ref('');
const taskList = ref([]);
const isLoading = ref(false);
const errorMessage = ref('');

// 과제 유형 목록 조회
const fetchTaskTypes = async () => {
  try {
    const response = await getAllTaskTypes();
    if (response.success) {
      taskTypes.value = response.content.map((item) => ({
        id: item.task_type_id,
        name: item.task_type_name,
      }));
    } else {
      console.error('과제 유형 조회 실패:', response);
      taskTypes.value = [];
    }
  } catch (error) {
    console.error('과제 유형 조회 중 오류 발생:', error);
    taskTypes.value = [];
  }
};

// 로컬 스토리지에서 employeeId 가져오기
const getEmployeeId = () => {
  return localStorage.getItem('employeeId');
};

// 입력값 검증
const validateInputs = () => {
  if (!selectedYear.value) {
    errorMessage.value = '연도를 선택해주세요.';
    return false;
  }
  if (!selectedHalf.value) {
    errorMessage.value = '반기를 선택해주세요.';
    return false;
  }
  if (!selectedTaskType.value) {
    errorMessage.value = '과제 유형을 선택해주세요.';
    return false;
  }
  if (!taskName.value.trim()) {
    errorMessage.value = '과제명을 입력해주세요.';
    return false;
  }
  if (!taskContent.value.trim()) {
    errorMessage.value = '과제 내용을 입력해주세요.';
    return false;
  }
  const employeeId = getEmployeeId();
  if (!employeeId) {
    errorMessage.value = '사용자 정보를 찾을 수 없습니다.';
    return false;
  }
  return true;
};

// 과제 등록
const handleSubmit = async () => {
  try {
    errorMessage.value = '';
    if (!validateInputs()) return;

    isLoading.value = true;

    const employeeId = getEmployeeId();

    const createTaskItemRequestDTO = {
      taskName: taskName.value,
      taskContent: taskContent.value,
      employeeId: Number(employeeId),
    };

    const response = await createTaskItem(
      selectedYear.value,
      selectedHalf.value,
      selectedTaskType.value.id,
      createTaskItemRequestDTO
    );

    if (response.success) {
      // 등록 성공 시 리스트 다시 조회
      await fetchTaskList();

      // 입력 필드 초기화
      selectedTaskType.value = null;
      taskName.value = '';
      taskContent.value = '';

      alert('과제가 성공적으로 등록되었습니다.');
    } else {
      errorMessage.value = '과제 등록에 실패했습니다.';
    }
  } catch (error) {
    console.error('과제 등록 중 오류 발생:', error);
    errorMessage.value = '과제 등록 중 오류가 발생했습니다.';
  } finally {
    isLoading.value = false;
  }
};

// fetchTaskList 함수 추가
const fetchTaskList = async () => {
  try {
    if (!selectedYear.value || !selectedHalf.value) return;

    isLoading.value = true;
    const employeeId = getEmployeeId();

    const response = await findDepartmentTaskItems(
      selectedYear.value,
      selectedHalf.value,
      employeeId
    );

    if (response.success) {
      taskList.value = response.content.map((task) => ({
        type:
          taskTypes.value.find((t) => t.id === task.task_type_id)?.name || '-',
        name: task.task_name,
        content: task.task_content,
      }));
    } else {
      taskList.value = [];
      errorMessage.value = '과제 목록 조회에 실패했습니다.';
    }
  } catch (error) {
    console.error('과제 목록 조회 중 오류 발생:', error);
    errorMessage.value = '과제 목록 조회 중 오류가 발생했습니다.';
    taskList.value = [];
  } finally {
    isLoading.value = false;
  }
};

// watch 추가
watch([selectedYear, selectedHalf], async ([newYear, newHalf]) => {
  if (newYear && newHalf) {
    await fetchTaskList();
  }
});

// 이벤트 핸들러
const handleTaskTypeSelected = (id, index) => {
  selectedTaskType.value = taskTypes.value[index];
  errorMessage.value = '';
};

const handleYearSelected = (year) => {
  selectedYear.value = year;
  errorMessage.value = '';
};

const handleHalfSelected = (half) => {
  selectedHalf.value = half;
  errorMessage.value = '';
};

// 컴포넌트 마운트 시 과제 유형 조회 되도록 리펙토링 필요
onMounted(async () => {
  await fetchTaskTypes();
  if (selectedYear.value && selectedHalf.value) {
    await fetchTaskList();
  }
});
</script>

<style scoped>
.title-wrapper {
  margin-bottom: 3rem;
}

.common-article {
  position: relative;
}

.submit-btn {
  margin-top: 3.2rem;
  align-self: center;
}

.task-upload-article {
  margin-top: 1rem;
  margin-bottom: 2rem;
}

.input-wrapper {
  padding: 1rem;
}

.input-wrapper input {
  height: 100%;
  width: 100%;
}

.mid {
  justify-content: center;
  align-items: center;
}

.h-7 {
  height: 7rem !important;
}

.year-half-section {
  position: absolute;
  top: -1rem;
  gap: 1rem;
  right: 0;
}

.error-message {
  color: #ff4444;
  margin-bottom: 1rem;
  font-size: 1.4rem;
}

button:disabled,
input:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}
</style>
