<template>
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
          <button
            class="btn"
            @click="handleIssueCertificate"
            :disabled="isSubmitting"
          >
            <i v-if="isSubmitting" class="fas fa-spinner fa-spin"></i>
            <i v-else class="fas fa-file"></i>
            발급하기
          </button>
        </TableCell>
      </TableRow>
    </TableItem>
  </CommonArticle>

  <!-- 모달 -->
  <CertificateModal
    v-if="showModal"
    :certificate-data="certificateData"
    @close="closeModal"
  />
</template>

<script setup>
import { ref } from 'vue';
import CommonArticle from '@/components/common/CommonArticle.vue';
import TableCell from '@/components/semantic/TableCell.vue';
import TableRow from '@/components/semantic/TableRow.vue';
import TableItem from '@/components/semantic/TableItem.vue';
import CertificateModal from '@/views/hr-basic/document/CertificateModal.vue';
import { getEmploymentCertificate } from '@/api/emp_info';

// 상태 변수
const requestReason = ref(''); // 요청 사유
const certificateData = ref(null); // API 응답 데이터
const showModal = ref(false); // 모달 표시 여부
const isSubmitting = ref(false); // 로딩 상태

// 사용자 ID와 토큰 (예: 로컬 스토리지에서 가져오기)
const employeeId = localStorage.getItem('employeeId');
const token = localStorage.getItem('authToken');

// 글자 수 제한
const checkLength = () => {
  if (requestReason.value.length > 20) {
    alert('입력은 최대 20자까지 가능합니다.');
    requestReason.value = requestReason.value.slice(0, 20);
  }
};

// 발급하기 버튼 클릭 핸들러
const handleIssueCertificate = async () => {
  if (!requestReason.value.trim()) {
    alert('재직증명서 요청 사유를 입력해주세요.');
    return;
  }

  isSubmitting.value = true;

  try {
    const response = await getEmploymentCertificate(
      employeeId,
      requestReason.value,
      token
    );
    certificateData.value = response; // API 응답 저장
    showModal.value = true; // 모달 표시
  } catch (error) {
    alert('재직증명서를 발급하는 데 실패했습니다.');
    console.error('Error issuing certificate:', error);
  } finally {
    isSubmitting.value = false;
  }
};

// 모달 닫기
const closeModal = () => {
  showModal.value = false;
  certificateData.value = null;
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
  font-size: 1.4rem;
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
