<!-- TaskEvalModal.vue -->
<template>
  <div class="modal-overlay" @click="handleOverlayClick">
    <div class="modal-content" @click.stop>
      <div class="modal-header">
        <CommonArticle label="과제 평가" w="100%" />
      </div>

      <div class="modal-body">
        <TableItem gtc="0.5fr 2fr">
          <TableRow>
            <TableCell th fs="1.6rem">과제명</TableCell>
            <TableCell fs="1.6rem">{{ task.task_name }}</TableCell>
          </TableRow>

          <TableRow>
            <TableCell th fs="1.6rem">실적</TableCell>
            <TableCell>
              <textarea
                v-model="evaluationData.performanceInput"
                class="performance-input"
                placeholder="실적을 입력하세요"
              />
            </TableCell>
          </TableRow>

          <TableRow>
            <TableCell th fs="1.6rem">가중치</TableCell>
            <TableCell>
              <input
                type="number"
                v-model="evaluationData.setRatio"
                class="score-input"
                placeholder="0과 1 사이의 가중치를 입력하세요"
                min="0"
                max="1"
                step="0.1"
              />
            </TableCell>
          </TableRow>

          <TableRow>
            <TableCell th fs="1.6rem">점수</TableCell>
            <TableCell>
              <input
                type="number"
                v-model="evaluationData.score"
                class="score-input"
                placeholder="점수를 입력하세요"
                min="0"
                max="100"
                step="0.1"
              />
            </TableCell>
          </TableRow>
        </TableItem>

        <div class="button-group">
          <ButtonItem
            h="3.6rem"
            w="7.2rem"
            bgc="#003566"
            br="0.6rem"
            c="#fff"
            fs="1.6rem"
            @click="handleSubmit"
          >
            저장
          </ButtonItem>

          <ButtonItem
            h="3.6rem"
            w="7.2rem"
            bgc="#6B7280"
            br="0.6rem"
            c="#fff"
            fs="1.6rem"
            @click="$emit('close')"
          >
            취소
          </ButtonItem>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, defineProps, defineEmits } from 'vue';
import TableItem from '@/components/semantic/TableItem.vue';
import TableRow from '@/components/semantic/TableRow.vue';
import TableCell from '@/components/semantic/TableCell.vue';
import ButtonItem from '@/components/semantic/ButtonItem.vue';
import CommonArticle from '@/components/common/CommonArticle.vue';
import {
  createTaskEval,
  findEvaluationByEmpIdAndYearAndHalf,
} from '@/api/evaluation';

// 여기에서 사용중인 findIndividualTaskListByEvaluationId는 평가 테이블에서 자기평가에 해당하는 평가ID를 추출하기 위함입니다.
// 해당 모달은 자기평가를 위한 기능을 하므로 리더평가는 고려하지 않습니다.

const props = defineProps({
  task: {
    type: Object,
    required: true,
  },
  selectedYear: {
    type: Number,
    required: true,
  },
  selectedHalf: {
    type: String,
    required: true,
  },
});

const emit = defineEmits(['close', 'submit']);

const evaluationData = ref({
  performanceInput: '',
  score: null,
  setRatio: null,
});

const handleOverlayClick = (event) => {
  if (event.target === event.currentTarget) {
    emit('close');
  }
};

const handleSubmit = async () => {
  if (
    !evaluationData.value.performanceInput ||
    !evaluationData.value.score ||
    !evaluationData.value.setRatio
  ) {
    alert('모든 항목을 입력해주세요.');
    return;
  }

  // 점수 범위 검증
  if (evaluationData.value.score < 0 || evaluationData.value.score > 100) {
    alert('점수는 0에서 100 사이의 값이어야 합니다.');
    return;
  }

  // 가중치 범위 검증
  if (evaluationData.value.setRatio < 0 || evaluationData.value.setRatio > 1) {
    alert('가중치는 0에서 1 사이의 값이어야 합니다.');
    return;
  }

  const employeeId = localStorage.getItem('employeeId');

  try {
    const evaluationResponse = await findEvaluationByEmpIdAndYearAndHalf(
      props.selectedYear,
      props.selectedHalf,
      Number(employeeId)
    );

    const evaluationId = evaluationResponse.content.evaluation_id;

    const createTaskEvalRequestDTO = {
      task_eval_name: props.task.task_name,
      task_eval_content: props.task.task_content,
      score: parseFloat(evaluationData.value.score),
      set_ratio: parseFloat(evaluationData.value.setRatio),
      performance_input: evaluationData.value.performanceInput,
      task_type_id: props.task.task_type_id,
      task_item_id: props.task.task_item_id,
      evaluation_id: evaluationId,
    };

    const response = await createTaskEval(
      createTaskEvalRequestDTO,
      props.selectedYear,
      props.selectedHalf,
      employeeId
    );

    if (response.success) {
      alert('평가가 등록되었습니다.');
      emit('submit');
      emit('close');
    }
  } catch (error) {
    console.error('API Error Full Details:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
    });
    alert('평가 등록에 실패하였습니다.');
  }
};
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(2, 2, 2, 0.2);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  padding: 2rem;
  border-radius: 0.8rem;
  width: 80%;
  max-width: 550px;
}

.modal-header {
  margin-bottom: 2rem;
}

.modal-body {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.performance-input {
  width: 100%;
  min-height: 100px;
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 0.4rem;
  font-size: 1.4rem;
  resize: vertical;
}

.score-input {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 0.4rem;
  font-size: 1.4rem;
}

.button-group {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 2rem;
}
</style>
