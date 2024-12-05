<template>
  <SectionItem class="assign-section" w="calc(100% - 36rem)">
    <CommonArticle label="부서원 과제 할당">
      <FlexItem class="year-half-section" fld="row" fs="1.6rem" fw="500" c="#003566">
        <YearDropDown @valid-date-selected="handleYearSelected" />
        <HalfDropdown @half-selected="handleHalfSelected" />
      </FlexItem>
      <FlexItem
        class="profile"
        fld="row"
        w="100%"
        h="14rem"
        bgc="#fff"
        br="0.6rem"
      >
        <FigureItem
          v-if="selectedEmployee"
          class="profile-img-wrapper"
          h="100%"
          w="10.5rem"
        >
          <img :src="selectedEmployee.profile_image_url" alt="Profile Image" />
        </FigureItem>
        <FlexItem
          v-if="selectedEmployee"
          class="emp-info"
          fld="column"
          h="100%"
        >
          <span class="emphasize">{{ selectedEmployee.employee_name }}</span>
          <span class="normal">{{ selectedEmployee.employee_number }}</span>
          <span class="normal">{{ selectedEmployee.department_path }}</span>
        </FlexItem>
        <FlexItem
          v-else
          class="empty-message"
          fld="row"
          h="100%"
          w="100%"
          fs="2rem"
        >
          사원을 선택해주세요.
        </FlexItem>
      </FlexItem>
      <TableItem gtc="2fr 3fr 6fr 8fr 2fr">
        <TableRow>
          <TableCell th fs="1.6rem" topl>No</TableCell>
          <TableCell th fs="1.6rem">유형</TableCell>
          <TableCell th fs="1.6rem">과제명</TableCell>
          <TableCell th fs="1.6rem" topr>과제 내용</TableCell>
          <TableCell th fs="1.6rem">선택</TableCell>
        </TableRow>
        <template v-if="!isLoading && taskItems.length > 0">
          <TableRow v-for="(task, index) in taskItems" :key="task.task_item_id">
            <TableCell class="mid" fs="1.6rem">{{ index + 1 }}</TableCell>
            <TableCell class="mid" fs="1.6rem">{{ getTaskTypeName(task.task_type_id) }}</TableCell>
            <TableCell class="mid" fs="1.6rem">{{ task.task_name }}</TableCell>
            <TableCell class="mid" fs="1.6rem">{{ task.task_content }}</TableCell>
            <TableCell class="mid checkbox-cell" fs="1.6rem">
              <div 
                class="checkbox"
                :class="{ 'checked': selectedTasks.includes(task.task_item_id) }"
                @click="toggleTaskSelection(task)"
              ></div>
            </TableCell>
          </TableRow>
        </template>
        <TableRow v-else-if="isLoading">
          <TableCell gc="span 5" class="mid" fs="1.6rem">데이터를 불러오는 중입니다...</TableCell>
        </TableRow>
        <TableRow v-else>
          <TableCell gc="span 5" class="mid" fs="1.6rem">과제 데이터가 없습니다.</TableCell>
        </TableRow>
      </TableItem>
    </CommonArticle>
    <SearchEmployeeComponent @employee-selected="handleSelected" />

    <ButtonItem
      class="submit-btn"
      h="3.6rem"
      w="7.2rem"
      bgc="#003566"
      br="0.6rem"
      c="#fff"
      fs="1.6rem"
      @click="handleAssignTasks"
      :disabled="selectedTasks.length === 0 || !selectedEmployee"
    >
      과제 할당
    </ButtonItem>
  </SectionItem>
</template>

<script setup>
import { ref, watch, computed } from 'vue';
import FlexItem from '@/components/semantic/FlexItem.vue';
import SectionItem from '@/components/semantic/SectionItem.vue';
import CommonArticle from '@/components/common/CommonArticle.vue';
import TableItem from '@/components/semantic/TableItem.vue';
import TableRow from '@/components/semantic/TableRow.vue';
import TableCell from '@/components/semantic/TableCell.vue';
import ButtonItem from '@/components/semantic/ButtonItem.vue';
import FigureItem from '@/components/semantic/FigureItem.vue';
import SearchEmployeeComponent from '@/components/common/SearchEmployeeComponent.vue';
import YearDropDown from '@/components/dropdowns/YearDropDown.vue';
import HalfDropdown from '@/components/dropdowns/HalfDropdown.vue';
import { findDepartmentTaskItems, createTaskItem } from '@/api/evaluation';

// 상태 관리
const selectedEmployee = ref(null);
const selectedYear = ref(null);
const selectedHalf = ref(null);
const isLoading = ref(false);
const taskItems = ref([]);
const selectedTasks = ref([]);

// 과제 유형 매핑
const taskTypes = {
  1: '개인 과제',
  2: '팀 과제',
  3: '부서 과제'
};

const getTaskTypeName = (typeId) => {
  return taskTypes[typeId] || '기타';
};

// 과제 선택 토글
const toggleTaskSelection = (task) => {
  const index = selectedTasks.value.indexOf(task.task_item_id);
  if (index === -1) {
    selectedTasks.value.push(task.task_item_id);
  } else {
    selectedTasks.value.splice(index, 1);
  }
};

// 과제 할당 처리
const handleAssignTasks = async () => {
  if (!selectedEmployee.value || selectedTasks.value.length === 0) return;

  try {
    isLoading.value = true;
    
    for (const taskId of selectedTasks.value) {
      const task = taskItems.value.find(t => t.task_item_id === taskId);
      if (task) {
        const createTaskItemRequestDTO = {
          taskName: task.task_name,
          taskContent: task.task_content,
          employeeId: Number(selectedEmployee.value.department_member_id) // department_member_id를 사용
        };

        console.log('Task Request DTO:', createTaskItemRequestDTO); 

        await createTaskItem(
          selectedYear.value,
          selectedHalf.value,
          task.task_type_id,
          createTaskItemRequestDTO
        );
      }
    }
    
    selectedTasks.value = [];
    await fetchTaskItems();
  } catch (error) {
    console.error('과제 할당 실패:', error);
  } finally {
    isLoading.value = false;
  }
};

// 과제 목록 조회
const fetchTaskItems = async () => {
  if (!selectedYear.value || !selectedHalf.value) return;
  
  const employeeId = localStorage.getItem('employeeId');
  if (!employeeId) {
    console.error('employeeId가 없습니다.');
    return;
  }

  try {
    isLoading.value = true;
    const response = await findDepartmentTaskItems(
      selectedYear.value,
      selectedHalf.value,
      Number(employeeId)
    );
    
    if (response.success) {
      taskItems.value = Array.isArray(response.content) ? response.content : [];
    } else {
      taskItems.value = [];
      console.error('과제 데이터를 불러오는데 실패했습니다.');
    }
  } catch (error) {
    console.error('과제 목록 조회 실패:', error);
    taskItems.value = [];
  } finally {
    isLoading.value = false;
  }
};

const handleSelected = (employee) => {
  selectedEmployee.value = employee;
};

const handleYearSelected = (year) => {
  selectedYear.value = year;
  if (selectedHalf.value) fetchTaskItems();
};

const handleHalfSelected = (half) => {
  selectedHalf.value = half;
  if (selectedYear.value) fetchTaskItems();
};

// 년도나 반기가 변경될 때 과제 목록 조회
watch([selectedYear, selectedHalf], () => {
  if (selectedYear.value && selectedHalf.value) {
    fetchTaskItems();
  }
});
</script>

<style scoped>
/* 기존 스타일 유지 */

.checkbox-cell {
  display: flex;
  justify-content: center;
  align-items: center;
}

.checkbox {
  width: 20px;
  height: 20px;
  background-color: #F5F5F5;
  border: 1px solid #ddd;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.checkbox.checked {
  background-color: #003566;
  border-color: #003566;
}

.checkbox.checked::after {
  content: '✓';
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 14px;
}

/* 나머지 기존 스타일 유지 */
.emphasize {
  font-size: 2.2rem;
  font-weight: 500;
}

.normal {
  font-size: 1.2rem;
  font-weight: 400;
}

.h-5 {
  height: 5rem !important;
}

.h-12 {
  height: 12rem !important;
}

.pl-2 {
  padding-left: 2rem;
}

.mid {
  justify-content: center;
  align-items: center;
}

.common-article {
  position: relative;
}

.empty-message {
  justify-content: center;
  align-items: center;
}

.profile {
  padding: 1rem;
  gap: 3rem;
  box-shadow: 0rem 0rem 0.6rem 0rem rgba(0, 0, 0, 0.2);
  margin-bottom: 4rem;
}

.profile-img-wrapper img {
  height: 100%;
  width: 100%;
  object-fit: cover;
}

.emp-info {
  justify-content: center;
  gap: 1rem;
}

.feedback-input {
  width: 100%;
  height: 100%;
  padding: 1rem;
  border: 1px solid #ccc;
  border-radius: 0.4rem;
  resize: none;
  font-size: 1.4rem;
}

.submit-btn {
  margin-top: 3.2rem;
  align-self: center;
}

.assign-section {
  margin-left: 36rem;
  padding: 1rem 2rem;
}

.year-half-section {
  position: absolute;
  top: 0;
  right: 0;
  margin-top: -1rem;
  gap: 1rem;
}

.created-feedback {
  margin-top: 2rem;
  box-shadow: 0rem 0rem 0.6rem 0rem rgba(0, 0, 0, 0.1);
  height: 15rem !important;
}

.feedback-content {
  font-size: 1.4rem;
  line-height: 1.6;
  margin-bottom: 1rem;
  word-wrap: break-word;
  word-break: break-word;
  overflow-wrap: break-word;
  white-space: pre-wrap;
  max-height: 100%;
  overflow-y: auto;
  padding: 1.5rem;
}

.center-message {
  text-align: center;
  color: #888;
  font-size: 1.6rem;
}

.created-feedback {
  margin-top: 2rem;
  box-shadow: 0rem 0rem 0.6rem 0rem rgba(0, 0, 0, 0.1);
  height: 15rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
</style>