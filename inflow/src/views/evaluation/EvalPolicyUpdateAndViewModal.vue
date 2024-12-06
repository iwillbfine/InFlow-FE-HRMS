<template>
  <CrudModal :h="'70rem'" :w="'92rem'" @close="handleClose">
    <h2 class="modal-title">
      평가 정책 {{ isEditing ? '수정' : '상세 정보' }}
    </h2>

    <div class="modal-content">
      <TableItem gtc="0.25fr 0.75fr 0.25fr 0.75fr">
        <TableRow>
          <TableCell th fs="1.6rem">과제유형</TableCell>
          <TableCell fs="1.6rem">
            <template v-if="isEditing">
              <DropdownItem
                placeholder="선택"
                :list="taskTypes"
                :initialSelected="policyDetails.task_type_id"
                w="34%"
                @update:selectedItem="handleTypeSelection"
                class="typeDropdown task-input"
              />
            </template>
            <template v-else>
              {{ getTaskTypeName(policyDetails.task_type_id) }}
            </template>
          </TableCell>
          <TableCell th fs="1.6rem">상대평가기준 사원 수</TableCell>
          <TableCell fs="1.6rem">
            <template v-if="isEditing">
              <input
                type="number"
                class="edit-input"
                v-model="editForm.min_rel_eval_count"
                min="0"
              />
            </template>
            <template v-else>
              {{ policyDetails.min_rel_eval_count }}명
            </template>
          </TableCell>
        </TableRow>

        <TableRow>
          <TableCell th fs="1.6rem">평가 시작일</TableCell>
          <TableCell fs="1.6rem">
            <template v-if="isEditing">
              <DateDropDown
                :initialDate="formatDate(policyDetails.start_date)"
                @valid-date-selected="
                  (date) => handleDateUpdate('start_date', date)
                "
              />
            </template>
            <template v-else>
              {{ formatDate(policyDetails.start_date) }}
            </template>
          </TableCell>
          <TableCell th fs="1.6rem">평가 종료일</TableCell>
          <TableCell fs="1.6rem">
            <template v-if="isEditing">
              <DateDropDown
                :initialDate="formatDate(policyDetails.end_date)"
                @valid-date-selected="
                  (date) => handleDateUpdate('end_date', date)
                "
              />
            </template>
            <template v-else>
              {{ formatDate(policyDetails.end_date) }}
            </template>
          </TableCell>
        </TableRow>

        <TableRow>
          <TableCell th fs="1.6rem">정책 수정 가능 시기</TableCell>
          <TableCell fs="1.6rem">
            <template v-if="isEditing">
              <YearMonthDropDown
                :initialDate="formatDate(policyDetails.modifiable_date)"
                @valid-date-selected="
                  (date) => handleDateUpdate('modifiable_date', date)
                "
              />
            </template>
            <template v-else>
              {{ formatDate(policyDetails.modifiable_date) }}
            </template>
          </TableCell>
          <TableCell th fs="1.6rem">적용 시기</TableCell>
          <TableCell fs="1.6rem">
            <template v-if="isEditing">
              <FlexItem class="year-half-section" fld="row">
                <YearDropDown
                  :initialYear="policyDetails.year"
                  @valid-date-selected="handleYearUpdate"
                />
                <HalfDropdown
                  :initialHalf="policyDetails.half"
                  @half-selected="handleHalfUpdate"
                />
              </FlexItem>
            </template>
            <template v-else>
              {{ policyDetails.year }}년 {{ policyDetails.half }}반기
            </template>
          </TableCell>
        </TableRow>

        <TableRow>
          <TableCell th fs="1.6rem">유형별 적용 비율</TableCell>
          <TableCell fs="1.6rem" gc="span 3">
            <template v-if="isEditing">
              <input
                type="number"
                class="edit-input"
                v-model="editForm.task_ratio"
                min="0"
                max="1"
                step="0.1"
              />
            </template>
            <template v-else>
              {{ (policyDetails.task_ratio * 100).toFixed(1) }}%
            </template>
          </TableCell>
        </TableRow>

        <TableRow>
          <TableCell th fs="1.6rem">정책설명</TableCell>
          <TableCell gc="span 3">
            <template v-if="isEditing">
              <textarea
                class="policy-description edit-textarea"
                v-model="editForm.policy_description"
              ></textarea>
            </template>
            <template v-else>
              <div class="policy-description">
                {{ policyDetails.policy_description }}
              </div>
            </template>
          </TableCell>
        </TableRow>
      </TableItem>
    </div>

    <div class="button-container">
      <ButtonItem
        h="3.6rem"
        w="7.2rem"
        bgc="#003566"
        br="0.6rem"
        c="#fff"
        fs="1.6rem"
        @click="handleEditToggle"
      >
        {{ isEditing ? '취소' : '수정하기' }}
      </ButtonItem>

      <ButtonItem
        v-if="isEditing"
        h="3.6rem"
        w="7.2rem"
        bgc="#003566"
        br="0.6rem"
        c="#fff"
        fs="1.6rem"
        @click="handleUpdate"
        :disabled="!isFormValid"
      >
        저장
      </ButtonItem>
    </div>
  </CrudModal>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import CrudModal from '@/components/modals/CrudModal.vue';
import TableCell from '@/components/semantic/TableCell.vue';
import TableRow from '@/components/semantic/TableRow.vue';
import TableItem from '@/components/semantic/TableItem.vue';
import FlexItem from '@/components/semantic/FlexItem.vue';
import ButtonItem from '@/components/semantic/ButtonItem.vue';
import DateDropDown from '@/components/dropdowns/DateDropDown.vue';
import YearMonthDropDown from '@/components/dropdowns/YearMonthDropDown.vue';
import YearDropDown from '@/components/dropdowns/YearDropDown.vue';
import HalfDropdown from '@/components/dropdowns/HalfDropdown.vue';
import DropdownItem from '@/components/dropdowns/DropdownItem.vue';
import {
  findEvaluationPolicyById,
  updateEvaluationPolicy,
} from '@/api/evaluation';

const props = defineProps({
  policyId: {
    type: Number,
    required: true,
  },
  taskTypes: {
    type: Array,
    required: true,
  },
});

const emit = defineEmits(['close', 'update']);

const policyDetails = ref({});
const isEditing = ref(false);
const editForm = ref({});

// 수정 폼 초기화 함수
const initializeEditForm = () => {
  editForm.value = {
    task_type_id: policyDetails.value.task_type_id,
    start_date: policyDetails.value.start_date,
    end_date: policyDetails.value.end_date,
    year: policyDetails.value.year,
    half: policyDetails.value.half,
    task_ratio: policyDetails.value.task_ratio,
    min_rel_eval_count: policyDetails.value.min_rel_eval_count,
    modifiable_date: policyDetails.value.modifiable_date,
    policy_description: policyDetails.value.policy_description,
  };
};

// 유효성 검사
const isFormValid = computed(() => {
  if (!editForm.value) return false;

  return (
    editForm.value.task_type_id &&
    editForm.value.min_rel_eval_count > 0 &&
    editForm.value.start_date &&
    editForm.value.end_date &&
    editForm.value.modifiable_date &&
    editForm.value.policy_description?.trim() !== '' &&
    editForm.value.year &&
    editForm.value.half &&
    editForm.value.task_ratio > 0 &&
    editForm.value.task_ratio <= 1
  );
});

const getTaskTypeName = (taskTypeId) => {
  const taskType = props.taskTypes.find((type) => type.id === taskTypeId);
  return taskType ? taskType.name : '-';
};

const formatDate = (dateString) => {
  if (!dateString) return '-';
  const date = new Date(dateString);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
};

const handleTypeSelection = (typeId) => {
  editForm.value.task_type_id = typeId;
};

// 날짜 업데이트 핸들러
const handleDateUpdate = (field, date) => {
  if (field === 'modifiable_date') {
    editForm.value[field] = `${date}-01T00:00:00`;
  } else {
    editForm.value[field] =
      `${date}T${field === 'end_date' ? '23:59:59' : '00:00:00'}`;
  }
};

const handleYearUpdate = (year) => {
  editForm.value.year = year;
};

const handleHalfUpdate = (half) => {
  editForm.value.half = half;
};

const handleEditToggle = () => {
  if (isEditing.value) {
    isEditing.value = false;
    initializeEditForm();
  } else {
    isEditing.value = true;
    initializeEditForm();
  }
};

const handleUpdate = async () => {
  try {
    const response = await updateEvaluationPolicy(
      props.policyId,
      editForm.value
    );
    if (response.success) {
      alert('평가 정책이 성공적으로 수정되었습니다.');
      isEditing.value = false;
      await fetchPolicyDetails();
      emit('update');
    } else {
      alert(
        `정책 수정 실패: ${response.message || '알 수 없는 오류가 발생했습니다.'}`
      );
    }
  } catch (error) {
    console.error('정책 수정 실패:', error);
    alert(`정책 수정 중 오류가 발생했습니다: ${error.message}`);
  }
};

const handleClose = () => {
  emit('close');
};

const fetchPolicyDetails = async () => {
  try {
    const response = await findEvaluationPolicyById(props.policyId);
    if (response.success) {
      policyDetails.value = response.content;
      initializeEditForm();
    } else {
      console.error('정책 상세 조회 실패:', response);
    }
  } catch (error) {
    console.error('정책 상세 조회 중 오류 발생:', error);
  }
};

onMounted(() => {
  fetchPolicyDetails();
});
</script>

<style scoped>
.modal-title {
  font-size: 2.4rem;
  font-weight: 700;
  color: #003566;
  margin-bottom: 2rem;
  text-align: center;
}

.modal-content {
  padding: 2rem;
  height: 55rem;
  width: 90rem;
}

.policy-description {
  min-height: 10rem;
  padding: 1rem;
  border: 1px solid #ccc;
  border-radius: 0.4rem;
  background-color: #f9f9f9;
  white-space: pre-wrap;
}

.edit-input {
  width: 100%;
  height: 3rem;
  border: 1px solid #ccc;
  border-radius: 0.375rem;
  padding: 0.25rem 0.5rem;
  font-size: 1.4rem;
  text-align: center;
}

.edit-textarea {
  width: 100%;
  min-height: 10rem;
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 0.375rem;
  font-size: 1.4rem;
  resize: vertical;
}

.button-container {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 2rem;
}

.year-half-section {
  gap: 1rem;
}
</style>
<!-- 테이블 크기 및 너비 height: 48rem; width: 100rem;  / 모달 전체 크기 height: 74rem; -->
