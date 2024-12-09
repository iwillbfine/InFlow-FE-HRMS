<template>
  <CommonArticle label="계약서 목록" minh="29rem" w="90%">
    <TableItem gtc="repeat(5, 1fr)" br="1rem">
      <TableRow bgc="#aaa">
        <TableCell th fs="1.6rem">계약서 종류</TableCell>
        <TableCell th fs="1.6rem">등록 시각</TableCell>
        <TableCell th fs="1.6rem">동의 여부</TableCell>
        <TableCell th fs="1.6rem">계약서 상태</TableCell>
        <TableCell th fs="1.6rem">등록 및 조회</TableCell>
      </TableRow>

      <!-- 계약서 데이터 반복 렌더링 -->
      <TableRow v-for="contract in contracts" :key="contract.contract_id">
        <TableCell class="mid" fs="1.6rem">{{
          contract.contract_type === 'EMPLOYMENT'
            ? '근로계약서'
            : '비밀유지서약서'
        }}</TableCell>
        <TableCell class="mid" fs="1.6rem">{{
          formatDateTime(contract.created_at)
        }}</TableCell>
        <TableCell class="mid" fs="1.6rem">{{
          contract.consent_status === 'Y' ? '동의함' : '비동의'
        }}</TableCell>
        <TableCell class="mid" fs="1.6rem">{{
          contract.contract_status === 'REGISTERED' ? '등록됨' : '서명전'
        }}</TableCell>
        <TableCell class="mid" fs="1.6rem">
          <template v-if="contract.file_url">
            <button @click="selectContract(contract.contract_id)" class="btn">
              조회
            </button>
          </template>
          <template v-else>
            <button
              v-if="contract.contract_type === 'EMPLOYMENT'"
              @click="openEmployeeContractModal(contract)"
              class="btn"
            >
              등록
            </button>
            <button
              v-else
              @click="openSecurityContractModal(contract)"
              class="btn"
            >
              등록
            </button>
          </template>
        </TableCell>
      </TableRow>
    </TableItem>
  </CommonArticle>

  <!-- EmployeeContractModal -->
  <EmployeeContractModal
    v-if="showEmployeeModal"
    :contract-data="selectedContract"
    @close="handleEmployeeModalClose"
  />

  <!-- SecurityContractModal -->
  <SecurityContractModal
    v-if="showSecurityModal"
    :contract-data="selectedContract"
    @close="handleSecurityModalClose"
  />
</template>

<script setup>
import { ref, onMounted } from 'vue';
import {
  getEmploymentContract,
  getContractList,
  getContract,
} from '@/api/emp_info'; // API 호출 메서드 임포트
import TableCell from '@/components/semantic/TableCell.vue';
import TableRow from '@/components/semantic/TableRow.vue';
import TableItem from '@/components/semantic/TableItem.vue';
import CommonArticle from '@/components/common/CommonArticle.vue';
import EmployeeContractModal from '@/views/hr-basic/document/EmployeeContractModal.vue';
import SecurityContractModal from '@/views/hr-basic/document/SecurityContractModal.vue';

// 상태 변수 정의
const contracts = ref([]);
const modalData = ref({});
const showEmployeeModal = ref(false);
const showSecurityModal = ref(false);
const selectedContract = ref(null);

// 로컬 스토리지에서 employeeId와 token 가져오기
const employeeId = localStorage.getItem('employeeId');
const token = localStorage.getItem('authToken');

// 계약서 목록 조회 함수
const fetchContractList = async () => {
  try {
    const data = await getContractList(employeeId, token);
    contracts.value = data;
  } catch (error) {
    console.error('계약서 목록을 가져오는 데 실패했습니다:', error);
  }
};

// 조회 버튼 클릭 메서드
const selectContract = async (contractId) => {
  try {
    const accessToken = localStorage.getItem('accessToken'); // 로컬스토리지에서 토큰 가져오기

    // 계약서 정보 조회 API 호출
    const contractData = await getContract(contractId, accessToken);

    // file_url 확인
    if (contractData.file_url) {
      // 새 창에서 열기
      window.open(contractData.file_url, '_blank');
    } else {
      alert('계약서 파일 URL이 없습니다.');
    }
  } catch (error) {
    console.error('계약서 조회 실패:', error);
    alert('계약서 정보를 조회하는 데 실패했습니다.');
  }
};

// 날짜 포맷 함수
const formatDateTime = (datetime) => {
  if (!datetime) return '미등록';
  const date = new Date(datetime);
  return date
    .toLocaleString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
    })
    .replace(/년|월|일/g, (match) => match.trim() + ' ');
};

// "등록" 버튼 클릭 시 호출되는 함수
// 근로계약서 등록 모달 열기
const openEmployeeContractModal = async (contract) => {
  try {
    const data = await getEmploymentContract(employeeId, token);
    selectedContract.value = { ...data, ...contract };
    showEmployeeModal.value = true;
  } catch (error) {
    console.error('근로계약서를 조회하는 데 실패했습니다:', error);
  }
};

// 비밀유지서약서 등록 모달 열기
const openSecurityContractModal = async (contract) => {
  try {
    const data = await getEmploymentContract(employeeId, token);
    selectedContract.value = { ...data, ...contract };
    showSecurityModal.value = true;
  } catch (error) {
    console.error('비밀유지서약서를 조회하는 데 실패했습니다:', error);
  }
};

// 근로계약서 모달 닫기
const handleEmployeeModalClose = () => {
  showEmployeeModal.value = false;
  fetchContractList();
};

// 비밀유지서약서 모달 닫기
const handleSecurityModalClose = () => {
  showSecurityModal.value = false;
  fetchContractList();
};
// 컴포넌트가 마운트되면 계약서 목록을 가져옵니다.
onMounted(fetchContractList);
</script>

<style scoped>
.cotract-wrapper {
  padding: 2rem;
  background-color: #fff;
  border-radius: 8px;
  width: 100%;
  height: 100%;
}

.btn {
  padding: 0.2rem 2rem;
  background-color: #003566;
  color: #fff;
  border: none;
  border-radius: 2px;
  cursor: pointer;
  font-size: 1.2rem;
}

.btn:hover {
  background-color: #00509e;
}
.mid {
  justify-content: center;
  align-items: center;
}
</style>
