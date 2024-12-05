<!-- TaskEvalCreateAndUpdateModal.vue -->
<template>
    <CrudModal :h="'40rem'" :w="'47rem'" @close="handleClose">
      <h2 class="modal-title">평가하기</h2>
      
      <!-- 등록된 과제 정보 -->
      <TableItem gtc="2fr 8fr" class="task-info">
        <TableRow>
          <TableCell th fs="1.6rem">과제명</TableCell>
          <TableCell fs="1.6rem">{{ taskData.task_name }}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell th fs="1.6rem">과제 내용</TableCell>
          <TableCell fs="1.6rem">{{ taskData.task_content }}</TableCell>
        </TableRow>

        
        <TableRow>
          <TableCell th fs="1.6rem">점수</TableCell>
          <TableCell fs="1.6rem">
            <input 
              type="number" 
              v-model="score"
              class="score-input"
              min="0"
              max="100"
              @input="handleScoreInput"
            />
          </TableCell>
        </TableRow>
      </TableItem>
  
      <!-- 버튼 그룹 -->
      <FlexItem class="button-group" fld="row">
        <ButtonItem
          h="3.6rem"
          w="7.2rem"
          bgc="#003566"
          br="0.6rem"
          c="#fff"
          fs="1.6rem"
          :disabled="isLoading"
          @click="handleSubmit"
        >
          {{ isLoading ? '처리중...' : '저장' }}
        </ButtonItem>
      </FlexItem>
    </CrudModal>
  </template>
  
  <script setup>
  import { ref, computed, onMounted } from 'vue';
  import CrudModal from '@/components/modals/CrudModal.vue';
  import TableItem from '@/components/semantic/TableItem.vue';
  import TableRow from '@/components/semantic/TableRow.vue';
  import TableCell from '@/components/semantic/TableCell.vue';
  import FlexItem from '@/components/semantic/FlexItem.vue';
  import ButtonItem from '@/components/semantic/ButtonItem.vue';
  import { createTaskEval } from '@/api/evaluation';
  
  const props = defineProps({
    taskData: {
      type: Object,
      required: true
    },
    year: {
      type: Number,
      required: true
    },
    half: {
      type: Number,
      required: true
    },
    employeeId: {
      type: Number,
      required: true
    }
  });
  
  const emit = defineEmits(['close', 'submit']);
  
  const score = ref(null);
  const isLoading = ref(false);
  
  // 점수 입력 처리
  const handleScoreInput = (event) => {
    let value = parseInt(event.target.value);
    
    if (isNaN(value)) {
      score.value = null;
      return;
    }
  
    if (value > 100) value = 100;
    if (value < 0) value = 0;
    
    score.value = value;
  };
  
  // 저장 처리
  const handleSubmit = async () => {
    if (!score.value) {
      alert('점수를 입력해주세요.');
      return;
    }
  
    try {
      isLoading.value = true;
  
      const requestDTO = {
        task_eval_name: props.taskData.task_name,       
        task_eval_content: props.taskData.task_content, 
        score: score.value,
        set_ratio: props.taskData.set_ratio || 0.5,
        performance_input: props.taskData.performance_input || "",
        evaluation_id: props.taskData.evaluation_id,
        task_type_id: props.taskData.task_type_id,
        task_item_id: props.taskData.task_item_id
      };
  
      const response = await createTaskEval(requestDTO, props.year, props.half, props.employeeId);
      
      if (response.success) {
        alert('평가가 등록되었습니다.');
        emit('submit', response.content);
        emit('close');
      }
    } catch (error) {
      console.error('평가 등록 중 에러:', error);
      alert('평가 등록 중 오류가 발생했습니다.');
    } finally {
      isLoading.value = false;
    }
  };
  
  const handleClose = () => {
    emit('close');
  };

  </script>
  
  <style scoped>
  .modal-title {
    font-size: 2.4rem;
    font-weight: 700;
    color: #003566;
    margin-bottom: 2rem;
    text-align: center;
  }
  
  .task-info {
    padding: 0rem;
    margin-bottom: 2rem;
  }
  
  .score-input {
    width: 30%;
    height: 3rem;
    border: 1px solid #ccc;
    border-radius: 0.4rem;
    padding: 0 1rem;
    font-size: 1.6rem;
  }
  
  .button-group {
    justify-content: flex-end;
    padding: 0 2rem 2rem 2rem;
  }
  </style>