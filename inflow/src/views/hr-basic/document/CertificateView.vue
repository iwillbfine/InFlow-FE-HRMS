<template>
  <div class="certificate-wrapper">
    <CommonArticle label="재직증명서 발급" minh="29rem" w="90%">
      <TableItem gtc="auto 150px" br="1rem">
        <TableRow bgc="#aaa">
          <TableCell th fs="1.6rem">재직 증명서 요청</TableCell>
          <TableCell th fs="1.6rem">발급하기</TableCell>
        </TableRow>

        <TableRow>
          <!-- 텍스트 입력 필드 -->
          <TableCell class="mid" fs="1.6rem">
            <input 
              type="text" 
              class="input-field" 
              placeholder="재직증명서 요청 사유를 입력하세요. (최대 20자)" 
              v-model="requestReason"
              @input="checkLength"
            />
            <div class="char-counter">{{ requestReason.length }} / 20</div>
          </TableCell>
          <!-- 발급하기 버튼 -->
          <TableCell class="mid issue-cell" fs="1.6rem">
            <button class="btn" @click="issueCertificate">발급하기</button>
          </TableCell>
        </TableRow>
      </TableItem>
    </CommonArticle>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import CommonArticle from '@/components/common/CommonArticle.vue';
import TableCell from '@/components/semantic/TableCell.vue';
import TableRow from '@/components/semantic/TableRow.vue';
import TableItem from '@/components/semantic/TableItem.vue';

// 재직증명서 요청 사유
const requestReason = ref('');

// 글자 수 체크 및 경고
const checkLength = () => {
  if (requestReason.value.length > 20) {
    alert('입력은 최대 20자까지 가능합니다.');
    requestReason.value = requestReason.value.slice(0, 20); // 초과 글자를 제거
  }
};

// 발급하기 버튼 클릭 이벤트
const issueCertificate = () => {
  if (!requestReason.value.trim()) {
    alert('재직증명서 요청 사유를 입력해주세요.');
    return;
  }
  alert(`재직증명서를 요청했습니다: ${requestReason.value}`);
};
</script>

<style scoped>
.certificate-wrapper {
  padding: 2rem;
  background-color: #fff;
  border-radius: 8px;
  width: 100%;
  height: 100%;
}

.mid {
  justify-content: center;
  align-items: center;
}

/* 입력 필드 스타일 */
.input-field {
  width: 90%;
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 2px;
  font-size: 1.2rem;
  box-sizing: border-box;
}

/* 글자 수 카운터 스타일 */
.char-counter {
  text-align: right;
  font-size: 1.4rem;
  color: #555;
  margin-top: 0.3rem;
  margin-left: 1rem;
}

/* 버튼 스타일 */
.btn {
  padding: 0.5rem 2rem;
  background-color: #003566;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1.2rem;
}

.btn:hover {
  background-color: #00509e;
}
</style>
