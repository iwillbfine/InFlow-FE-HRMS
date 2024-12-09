<template>
  <div class="modal-overlay" @click="handleOverlayClick">
    <div class="modal-content" @click.stop>
      <div class="modal-header">
        <CommonArticle label="평가 등급 수정" w="100%" />
      </div>

      <div class="modal-body">
        <TableItem gtc="0.5fr 2fr">
          <TableRow>
            <TableCell th fs="1.6rem">등급</TableCell>
            <TableCell>
              <input
                type="text"
                v-model="updateForm.grade_name"
                class="input-field"
                placeholder="등급을 입력하세요"
              />
            </TableCell>
          </TableRow>

          <TableRow>
            <TableCell th fs="1.6rem">시작비율</TableCell>
            <TableCell>
              <input
                type="number"
                v-model="updateForm.start_ratio"
                class="input-field"
                placeholder="시작비율을 입력하세요"
                min="0"
                max="100"
                step="0.1"
              />
            </TableCell>
          </TableRow>

          <TableRow>
            <TableCell th fs="1.6rem">종료비율</TableCell>
            <TableCell>
              <input
                type="number"
                v-model="updateForm.end_ratio"
                class="input-field"
                placeholder="종료비율을 입력하세요"
                min="0"
                max="100"
                step="0.1"
              />
            </TableCell>
          </TableRow>

          <TableRow>
            <TableCell th fs="1.6rem">절대평가 점수</TableCell>
            <TableCell>
              <input
                type="number"
                v-model="updateForm.absolute_grade_ratio"
                class="input-field"
                placeholder="절대평가 점수를 입력하세요"
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
            :disabled="!isFormValid"
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
import { ref, computed, defineProps, defineEmits } from 'vue';
import TableItem from '@/components/semantic/TableItem.vue';
import TableRow from '@/components/semantic/TableRow.vue';
import TableCell from '@/components/semantic/TableCell.vue';
import ButtonItem from '@/components/semantic/ButtonItem.vue';
import CommonArticle from '@/components/common/CommonArticle.vue';
import { updateGrade } from '@/api/evaluation';

const props = defineProps({
  grade: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(['close', 'update-success']);

const updateForm = ref({
  grade_name: props.grade.grade_name,
  start_ratio: props.grade.start_ratio,
  end_ratio: props.grade.end_ratio,
  absolute_grade_ratio: props.grade.absolute_grade_ratio,
});

const isFormValid = computed(() => {
  const form = updateForm.value;
  return (
    form.grade_name &&
    form.start_ratio !== null &&
    form.end_ratio !== null &&
    form.absolute_grade_ratio !== null &&
    form.start_ratio >= 0 &&
    form.end_ratio > form.start_ratio &&
    form.end_ratio <= 100 &&
    form.absolute_grade_ratio >= 0
  );
});

const handleOverlayClick = (event) => {
  if (event.target === event.currentTarget) {
    emit('close');
  }
};

const handleSubmit = async () => {
  if (!isFormValid.value) {
    alert('모든 필드를 올바르게 입력해주세요.');
    return;
  }

  try {
    const response = await updateGrade(props.grade.grade_id, {
      grade_name: updateForm.value.grade_name,
      start_ratio: Number(updateForm.value.start_ratio),
      end_ratio: Number(updateForm.value.end_ratio),
      absolute_grade_ratio: Number(updateForm.value.absolute_grade_ratio),
    });

    if (response.success) {
      alert('평가 등급이 성공적으로 수정되었습니다.');
      emit('update-success');
      emit('close');
    } else {
      alert('등급 수정에 실패했습니다.');
    }
  } catch (error) {
    console.error('등급 수정 실패:', error);
    alert('등급 수정 중 오류가 발생했습니다.');
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

.input-field {
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
