<template>
  <CommonArticle label="휴가 정책 등록" w="90%">
    <TableItem gtc="2.5fr 1.5fr 1fr 5fr 1.5fr 2fr">
      <TableRow>
        <TableCell th fs="1.6rem" topl>휴가 정책명</TableCell>
        <TableCell th fs="1.6rem">휴가 유형</TableCell>
        <TableCell th fs="1.6rem">연도</TableCell>
        <TableCell th fs="1.6rem">설명</TableCell>
        <TableCell th fs="1.6rem">유급 휴가 여부</TableCell>
        <TableCell th fs="1.6rem" topr>휴가 자동지급 주기</TableCell>
      </TableRow>
      <TableRow>
        <TableCell botl></TableCell>
        <TableCell></TableCell>
        <TableCell></TableCell>
        <TableCell></TableCell>
        <TableCell></TableCell>
        <TableCell botr></TableCell>
      </TableRow>
    </TableItem>
    <ButtonItem
      class="submit-btn"
      h="3.6rem"
      w="7.2rem"
      bgc="#003566"
      br="0.6rem"
      c="#fff"
      fs="1.6rem"
      @click="handleOnclick"
      >신청</ButtonItem
    >
  </CommonArticle>
  <hr />
  <CommonArticle label="등록된 휴가 정책" w="90%">
    <TableItem gtc="2.5fr 1.5fr 1fr 5fr 1.5fr 2fr">
      <TableRow>
        <TableCell th fs="1.6rem">휴가 정책명</TableCell>
        <TableCell th fs="1.6rem">휴가 유형</TableCell>
        <TableCell th fs="1.6rem">연도</TableCell>
        <TableCell th fs="1.6rem">설명</TableCell>
        <TableCell th fs="1.6rem">유급 휴가 여부</TableCell>
        <TableCell th fs="1.6rem">휴가 자동지급 주기</TableCell>
      </TableRow>
      <TableRow
        v-for="(item, index) in vacationPolicyList"
        v-if="!isEmpty"
        :key="index"
      >
        <TableCell
          class="mid"
          fs="1.6rem"
          :botl="index === vacationPolicyList.length - 1"
          >{{ item.vacation_policy_name }}</TableCell
        >
        <TableCell class="mid" fs="1.6rem">{{
          item.vacation_type_name
        }}</TableCell>
        <TableCell class="mid" fs="1.6rem">{{ item.year }}</TableCell>
        <TableCell class="mid" fs="1.6rem">{{
          item.vacation_policy_description
        }}</TableCell>
        <TableCell class="mid" fs="1.6rem">{{ item.paid_status }}</TableCell>
        <TableCell
          class="mid"
          fs="1.6rem"
          :botr="index === vacationPolicyList.length - 1"
        >
          {{ item.auto_allocation_cycle ? item.auto_allocation_cycle : '-' }}
        </TableCell>
      </TableRow>
    </TableItem>
    <FlexItem
      v-if="isEmpty"
      class="empty-message"
      fld="row"
      h="6rem"
      w="100%"
      fs="1.6rem"
    >
      신청 내역이 존재하지 않습니다.
    </FlexItem>
    <CrudModal v-if="isModalOpen" @close="toggleCancelRequestModal"></CrudModal>
  </CommonArticle>
</template>

<script setup>
import CommonArticle from '@/components/common/CommonArticle.vue';
import TableCell from '@/components/semantic/TableCell.vue';
import TableRow from '@/components/semantic/TableRow.vue';
import TableItem from '@/components/semantic/TableItem.vue';
import FlexItem from '@/components/semantic/FlexItem.vue';
import ButtonItem from '@/components/semantic/ButtonItem.vue';
import CrudModal from '@/components/modals/CrudModal.vue';
import { ref, onMounted } from 'vue';
import {
  getVacationPoliciesByYear,
  createVacationRequest,
} from '@/api/vacation';

const eid = ref(null);
const vacationList = ref([]);
const vacationPolicyList = ref([]);
const isEmpty = ref(true);
const isModalOpen = ref(false);

const arrayIndex = ref(null);
const selectedVacation = ref(null);
const selectedStartDate = ref('');
const selectedEndDate = ref('');
const requestReason = ref('');
const fileList = ref([]);

const fetchVacationPolicyData = async (year) => {
  const response = await getVacationPoliciesByYear(year);

  if (response.success) {
    vacationPolicyList.value = response.content;
    isEmpty.value = vacationPolicyList.value.isEmpty ? true : false;
  } else {
    vacationPolicyList.value = [];
    isEmpty.value = true;
  }
};

const toggleCancelRequestModal = () => {
  isModalOpen.value = !isModalOpen.value;
};

// 일까지 파싱
const parseDate = (dateStr) => {
  const date = new Date(dateStr);

  const year = date.getFullYear();
  const month = date.getMonth() + 1; // 월은 0부터 시작하므로 +1 필요
  const day = date.getDate();

  const formattedDate = `${year}년 ${month}월 ${day}일`;
  return formattedDate;
};

const parseRequestStatus = (status) => {
  switch (status) {
    case 'ACCEPT':
      return '승인됨';
    case 'REJECT':
      return '반려됨';
    default:
      return '대기중';
  }
};

const checkValidDate = () => {
  const selectedStart = new Date(selectedStartDate.value);
  const selectedEnd = new Date(selectedEndDate.value);

  // 오늘 날짜를 Date 객체로 변환
  const today = new Date();
  today.setHours(0, 0, 0, 0); // 시간 비교를 위해 00:00:00으로 설정

  if (selectedStart < today || selectedEnd < today) {
    return false;
  }

  return true;
};

const handleOnclick = async () => {
  if (!selectedVacation.value) {
    alert('사용할 휴가를 선택하세요.');
    return;
  }

  if (!selectedStartDate.value) {
    alert('휴가 시작일자를 선택하세요.');
    return;
  }

  if (!selectedEndDate.value) {
    alert('휴가 종료일자를 선택하세요.');
    return;
  }

  const startDate = new Date(selectedStartDate.value);
  const endDate = new Date(selectedEndDate.value);
  const durationDays = (endDate - startDate + 1) / (1000 * 60 * 60 * 24);

  if (vacationList.value[arrayIndex.value].vacation_left < durationDays) {
    alert('잔여 휴가 일수가 선택한 기간보다 적습니다.');
    return;
  }

  if (!checkValidDate()) {
    alert('휴가 날짜는 오늘보다 이전일 수 없습니다.');
    return;
  }

  if (startDate > endDate) {
    alert('휴가 종료일자는 휴가 시작일자보다 이전일 수 없습니다.');
    return;
  }

  if (!requestReason.value) {
    alert('휴가 사유를 입력하세요.');
    return;
  }

  if (requestReason.value.length > 20) {
    alert('신청 사유는 20자 이내로 작성해주세요.');
    return;
  }

  const formData = new FormData();
  formData.append('request_reason', requestReason.value);
  formData.append('start_date', selectedStartDate.value);
  formData.append('end_date', selectedEndDate.value);
  formData.append('employee_id', eid.value);
  formData.append('vacation_id', selectedVacation.value);

  fileList.value.forEach((file) => {
    formData.append(`attachments`, file);
  });

  const response = await createVacationRequest(formData);

  selectedVacation.value = null; // 무한 요청 방지
  selectedStartDate.value = ''; // 무한 요청 방지
  selectedEndDate.value = ''; // 무한 요청 방지
  requestReason.value = ''; // 무한 요청 방지
  fileList.value = []; /// 무한 요청 방지

  if (response.success) {
    alert('휴가 신청이 성공적으로 전송되었습니다.');
  } else {
    alert('휴가 신청 실패! 다시 시도해주세요.');
  }
  window.location.reload();
};

onMounted(() => {
  eid.value = localStorage.getItem('employeeId');
  const year = new Date().getFullYear();
  fetchVacationPolicyData(year);
});
</script>

<style scoped>
hr {
  width: 90%;
  margin-top: 3rem;
  margin-bottom: 3rem;
  border: 1px solid #dadada;
}

.h-7 {
  height: 7rem !important;
}

.pl-1 {
  padding-left: 2rem;
}

.g-2 {
  gap: 2rem;
}

.mid {
  justify-content: center;
  align-items: center;
}

.submit-btn {
  margin-top: 3.2rem;
  align-self: center;
}

.empty-message {
  justify-content: center;
  align-items: center;
}
</style>
