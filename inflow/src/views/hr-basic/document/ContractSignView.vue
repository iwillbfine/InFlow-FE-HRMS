<template>
    <div class="cotract-wrapper">
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
        <TableCell class="mid" fs="1.6rem" >{{ contract.contract_type === 'EMPLOYMENT' ? '근로계약서' : '비밀유지서약서' }}</TableCell>
        <TableCell class="mid" fs="1.6rem" >{{ formatDateTime(contract.created_at) }}</TableCell>
        <TableCell class="mid" fs="1.6rem" >{{ contract.consent_status === 'Y' ? '동의함' : '비동의' }}</TableCell>
        <TableCell class="mid" fs="1.6rem" >{{ contract.contract_status  === 'REGISTERED' ? '등록됨' : '서명전' }}</TableCell>
        <TableCell class="mid" fs="1.6rem">
          <template v-if="contract.file_url">
            <button @click="selectContract" class="btn">조회</button>
          </template>
          <template v-else>
            <button @click="registerContract" class="btn">등록</button>
          </template>
        </TableCell>

      </TableRow>
    </TableItem>
  </CommonArticle>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { getEmploymentContract, getSecurityAgreement, getContractList } from '@/api/emp_info'; // API 호출 메서드 임포트
import TableCell from '@/components/semantic/TableCell.vue';
import TableRow from '@/components/semantic/TableRow.vue';
import TableItem from '@/components/semantic/TableItem.vue';
import CommonArticle from '@/components/common/CommonArticle.vue';

// 상태 변수 정의
const contracts = ref([]);

// 로컬 스토리지에서 employeeId와 token 가져오기
const employeeId = localStorage.getItem('employeeId');
const token = localStorage.getItem('authToken');

const fetchContractList = async () => {
  try {

    const data = await getContractList(employeeId, token);
    contracts.value = data;
  } catch (error) {
    console.error('계약서 목록을 가져오는 데 실패했습니다:', error);
  }
};

// 날짜 포맷 함수
const formatDateTime = (datetime) => {
  if (!datetime) return '미등록';

  const date = new Date(datetime);
  return date.toLocaleString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    hour12: true, // 12시간제를 사용하여 오전/오후 표시
  }).replace(/년|월|일/g, match => match.trim() + ' ');
};


// 조회 버튼 클릭 메서드
const selectContract = () => {
  window.alert('조회 버튼 호출됨');
};

// 등록 버튼 클릭 메서드
const registerContract = () => {
  window.alert('등록 버튼 호출됨');
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
  /* border: 1px solid #ddd; */
  }


/* 버튼 스타일 */
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

.table {
  width: 100%;
  border-collapse: collapse;
}
.mid {
  justify-content: center;
  align-items: center;
}

.table th, .table td {
  padding: 10px;
  text-align: center;
  border: 1px solid #ddd;
}
</style>
