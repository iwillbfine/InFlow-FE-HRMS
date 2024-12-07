<template>
  <CommonArticle label="평가 유형 등록" w="90%">
    <TableItem gtc="2fr 0.3fr">
      <TableRow>
        <TableCell th fs="1.6rem">유형</TableCell>
        <TableCell th fs="1.6rem">등록</TableCell>
      </TableRow>

      <TableRow>
        <TableCell class="button-cell">
          <input
            type="text"
            v-model="taskName"
            class="task-input"
            placeholder="과제 유형을 입력하세요"
          />
        </TableCell>

        <TableCell class="button-cell">
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
        </TableCell>
      </TableRow>
    </TableItem>
  </CommonArticle>

  <hr />

  <CommonArticle class="pos-rel" label=" 유형 목록" w="90%">
    <TableItem gtc="0.25fr 2fr 0.25fr">
      <TableRow>
        <TableCell th fs="1.6rem">No</TableCell>
        <TableCell th fs="1.6rem">유형</TableCell>
        <TableCell th fs="1.6rem">관리</TableCell>
      </TableRow>
      <TableRow
        v-for="(type, index) in taskTypes"
        :key="type.task_type_id"
        class="task-row"
      >
        <TableCell class="mid" fs="1.6rem">{{ index + 1 }}</TableCell>
        <TableCell class="mid" fs="1.6rem">{{ type.task_type_name }}</TableCell>
        <TableCell class="button-cell">
          <ButtonItem
            class="submit-btn"
            h="3.6rem"
            w="7.2rem"
            bgc="#003566"
            br="0.6rem"
            c="#fff"
            fs="1.6rem"
            @click="handleDelete(type.task_type_id)"
          >
            삭제
          </ButtonItem>
        </TableCell>
      </TableRow>
    </TableItem>
    <FlexItem
      v-if="taskTypes.length === 0"
      class="empty-message"
      fld="row"
      h="6rem"
      w="100%"
      fs="1.6rem"
    >
      등록된 과제 유형이 없습니다.
    </FlexItem>
  </CommonArticle>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import CommonArticle from '@/components/common/CommonArticle.vue';
import TableCell from '@/components/semantic/TableCell.vue';
import TableRow from '@/components/semantic/TableRow.vue';
import TableItem from '@/components/semantic/TableItem.vue';
import FlexItem from '@/components/semantic/FlexItem.vue';
import ButtonItem from '@/components/semantic/ButtonItem.vue';
import XmarkButton from '@/components/buttons/XmarkButton.vue';
import {
  createTaskType,
  findAllTaskTypes,
  deleteTaskTypeById,
} from '@/api/evaluation';

const taskTypes = ref([]);
const taskName = ref('');

// 과제 유형 목록 조회
const fetchTaskTypes = async () => {
  try {
    const response = await findAllTaskTypes();
    if (response.success) {
      taskTypes.value = response.content || [];
    }
  } catch (error) {
    console.error('과제 유형 목록 조회 실패:', error);
    alert('과제 유형 목록 조회에 실패했습니다.');
  }
};

// 과제 유형 등록
const handleSubmit = async () => {
  if (!taskName.value.trim()) {
    alert('과제 유형을 입력해주세요.');
    return;
  }

  try {
    const requestData = {
      task_type_name: taskName.value,
    };

    const response = await createTaskType(requestData);

    if (response.success) {
      alert('과제 유형 등록에 성공하였습니다.');
      taskName.value = ''; // 입력 필드 초기화
      fetchTaskTypes(); // 목록 새로고침
    } else {
      alert('과제 유형 등록에 실패하였습니다.');
    }
  } catch (error) {
    console.error('과제 유형 등록 실패:', error);
    alert('과제 유형 등록에 실패하였습니다.');
  }
};

// 과제 유형 삭제 처리
const handleDelete = async (taskTypeId) => {
  if (!confirm('정말로 이 과제 유형을 삭제하시겠습니까?')) {
    return;
  }

  try {
    const response = await deleteTaskTypeById(taskTypeId);
    if (response.success) {
      alert('과제 유형이 성공적으로 삭제되었습니다.');
      fetchTaskTypes(); // 목록 새로고침
    } else {
      alert(
        '과제 유형 삭제에 실패했습니다: ' +
          (response.message || '알 수 없는 오류가 발생했습니다.')
      );
    }
  } catch (error) {
    if (error.response?.data?.message) {
      alert(`과제 유형 삭제 실패: ${error.response.data.message}`);
    } else {
      alert('과제 유형 삭제 중 오류가 발생했습니다.');
    }
    console.error('과제 유형 삭제 실패:', error);
  }
};

// 컴포넌트 마운트 시 과제 유형 목록 조회
onMounted(() => {
  fetchTaskTypes();
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

.button-cell {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 4rem;
}

.submit-btn {
  margin: 0;
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
  text-align: center;
}

.task-input::placeholder {
  font-size: 1.6rem;
  color: #666;
}

.mid {
  justify-content: center;
  align-items: center;
  word-break: keep-all;
}

.delete-btn {
  margin-left: 1rem;
  padding-left: 0rem;
  justify-content: center;
}

.delete-btn:hover {
  background-color: #f0f0f0;
}
</style>
