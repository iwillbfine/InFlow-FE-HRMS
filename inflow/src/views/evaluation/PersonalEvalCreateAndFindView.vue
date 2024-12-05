<template>
  <CommonArticle label="개인과제 등록" w="90%">
    <div class="date-selector mb-8">
      <FlexItem class="year-half-section" fld="row" fs="1.6rem" fw="500" c="#003566">
        <YearDropDown @valid-date-selected="handleYearSelected" />
        <HalfDropdown @half-selected="handleHalfSelected" />
      </FlexItem>
    </div>

    <TableItem gtc="0.5fr 2fr 2fr">
      <TableRow>
        <TableCell th fs="1.6rem">유형</TableCell>
        <TableCell th fs="1.6rem">과제명</TableCell>
        <TableCell th fs="1.6rem">계획 목표</TableCell>
      </TableRow>
      <TableRow>
        <TableCell>
          <TypeDropdown
            placeholder="선택"
            :list="taskTypes"
            w="100%"
            @update:selectedItem="handleTypeSelection"
          />
        </TableCell>
        <TableCell>
          <input type="text" v-model="taskName" class="task-input" placeholder="과제명을 입력하세요" />
        </TableCell>
        <TableCell>
          <input type="text" v-model="taskContent" class="task-input" placeholder="계획 목표를 입력하세요" />
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
    >
      등록
    </ButtonItem>
  </CommonArticle>

  <hr />

  <CommonArticle class="pos-rel" label="등록된 과제 목록" w="90%">
    <TableItem gtc="0.3fr 0.5fr 2fr 2fr">
      <TableRow>
        <TableCell th fs="1.6rem">No</TableCell>
        <TableCell th fs="1.6rem">유형</TableCell>
        <TableCell th fs="1.6rem">과제명</TableCell>
        <TableCell th fs="1.6rem">계획 목표</TableCell>
      </TableRow>
      <TableRow v-for="(task, index) in taskList" :key="task.task_item_id" class="task-row">
        <TableCell class="mid" fs="1.6rem">{{ index + 1 }}</TableCell>
        <TableCell class="mid" fs="1.6rem">{{ getTaskTypeName(task.task_type_id) }}</TableCell>
        <TableCell class="mid clickable" fs="1.6rem" @click="handleTaskClick(task)">
          {{ task.task_name }}
        </TableCell>
        <TableCell class="mid clickable" fs="1.6rem" @click="handleTaskClick(task)">
          {{ task.task_content }}
        </TableCell>
      </TableRow>
    </TableItem>

    <FlexItem
      v-if="taskList.length === 0"
      class="empty-message"
      fld="row"
      h="6rem"
      w="100%"
      fs="1.6rem"
    >
      과제 내역이 존재하지 않습니다.
    </FlexItem>
  </CommonArticle>

  <TaskEvalModal
    v-if="selectedTask"
    :task="selectedTask"
    :selectedYear="selectedYear"
    :selectedHalf="selectedHalf"
    @close="handleModalClose"
    @submit="handleEvalSubmit"
  />
</template>

<script setup>
import { ref, onMounted } from 'vue';
import CommonArticle from '@/components/common/CommonArticle.vue';
import TableCell from '@/components/semantic/TableCell.vue';
import TableRow from '@/components/semantic/TableRow.vue';
import TableItem from '@/components/semantic/TableItem.vue';
import FlexItem from '@/components/semantic/FlexItem.vue';
import ButtonItem from '@/components/semantic/ButtonItem.vue';
import TypeDropdown from '@/components/dropdowns/DropdownItem.vue';
import YearDropDown from '@/components/dropdowns/YearDropDown.vue';
import HalfDropdown from '@/components/dropdowns/HalfDropdown.vue';
import TaskEvalModal from '@/views/evaluation/TaskEvalModal.vue';
import { createTaskItem, findAllTaskItemsByEmpId, getAllTaskTypes } from '@/api/evaluation';

// 상태 관리
const taskList = ref([]);
const taskTypes = ref([
  { id: 1, name: '개인 과제' }
]);
const taskName = ref('');
const taskContent = ref('');
const selectedYear = ref(null);
const selectedHalf = ref(null);
const selectedType = ref(null);
const selectedTask = ref(null);

// employeeId 가져오기
const employeeId = ref(localStorage.getItem('employeeId'));

// 핸들러 함수들
const handleYearSelected = (year) => {
  selectedYear.value = year;
  fetchTaskList();
};

const handleHalfSelected = (half) => {
  selectedHalf.value = half;
  fetchTaskList();
};

const handleTypeSelection = (typeId) => {
  selectedType.value = typeId;
};

const handleTaskClick = (task) => {
  selectedTask.value = task;
};

const handleModalClose = () => {
  selectedTask.value = null;
};

const handleEvalSubmit = () => {
  fetchTaskList(); // 평가 제출 후 목록 새로고침
};

// 과제 유형 이름 가져오기
const getTaskTypeName = (typeId) => {
  const foundType = taskTypes.value.find((type) => type.task_type_id === typeId);
  return foundType ? foundType.task_type_name : '-';
};

// 과제 목록 조회
const fetchTaskList = async () => {
  if (!selectedYear.value || !selectedHalf.value) return;
  
  try {
    const response = await findAllTaskItemsByEmpId(
      employeeId.value,
      selectedYear.value,
      selectedHalf.value
    );
    
    if (response.success) {
      taskList.value = response.content || [];
    } else {
      taskList.value = [];
    }
  } catch (error) {
    console.error('과제 목록 조회 실패:', error);
    taskList.value = [];
  }
};

// 과제 등록
const handleSubmit = async () => {
  if (!taskName.value || !taskContent.value || !selectedType.value || !selectedYear.value || !selectedHalf.value) {
    alert('모든 항목을 입력해주세요.');
    return;
  }

  const taskData = {
    taskName: taskName.value,
    taskContent: taskContent.value,
    employeeId: employeeId.value
  };

  try {
    const response = await createTaskItem(
      selectedYear.value,
      selectedHalf.value,
      selectedType.value,
      taskData
    );

    if (response.success) {
      alert('과제가 생성되었습니다.');
      taskName.value = '';
      taskContent.value = '';
      selectedType.value = null;
      fetchTaskList(); // 목록 재조회
    } else {
      alert('과제 생성에 실패하였습니다.');
    }
  } catch (error) {
    console.error('과제 생성 실패:', error);
    alert('과제 생성에 실패하였습니다.');
  }
};

// 초기화
onMounted(() => {
  if (!employeeId.value) {
    alert('사용자 정보가 없습니다. 다시 로그인해주세요.');
    return;
  }
  
  // 현재 년도와 상반기를 기본값으로 설정

  // 초기 과제 목록 로드
  fetchTaskList();
});
</script>

<style scoped>
.pos-rel {
  position: relative;
}

hr {
  width: 90%;
  margin: 3rem auto;
  border: 1px solid #dadada;
}

.submit-btn {
  margin-top: 3.2rem;
  align-self: center;
}

.empty-message {
  justify-content: center;
  align-items: center;
}

.task-input {   
  width: 100%;
  border: 0px solid #ccc;
  border-radius: 0.375rem;
  padding: 0.25rem 0.5rem;
  font-size: 1.4rem;
}

.task-input::placeholder {
  font-size: 1.6rem;
  color: #666;
}

.date-selector {
  display: flex;
  justify-content: flex-end;
  padding: 1rem 0;
}

.year-half-section {
position: absolute;
top: 0;
right: 0;
margin-top: -1rem;
gap: 1rem;
}

.mid {
  justify-content: center;
  align-items: center;
  word-break: keep-all;
}

.task-row {
  transition: background-color 0.2s;
}

.clickable {
  cursor: pointer;
  color: #003566;
}

.clickable:hover {
  background-color: rgba(0, 53, 102, 0.05);
}

.common-article {
  position: relative;
}

</style>