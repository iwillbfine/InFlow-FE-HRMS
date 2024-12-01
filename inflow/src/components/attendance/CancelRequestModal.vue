<template>
  <CrudModal h="52rem">
    <FlexItem class="modal-content" h="100%" w="100%">
      <span class="title">신청 정보</span>
      <TableItem gtc="2fr 4fr 1fr">
        <TableRow>
          <TableCell th fs="1.6rem">신청일</TableCell>
          <TableCell th fs="1.6rem">신청 사유</TableCell>
          <TableCell th fs="1.6rem">상태</TableCell>
        </TableRow>
        <TableRow>
          <TableCell class="mid" fs="1.6rem">{{
            parseDate(props.item.created_at)
          }}</TableCell>
          <TableCell class="mid" fs="1.6rem">{{
            props.item.request_reason
          }}</TableCell>
          <TableCell class="mid" fs="1.6rem">{{
            parseRequestStatus(props.item.request_status)
          }}</TableCell>
        </TableRow>
      </TableItem>
      <span class="title">취소 요청 사유</span>
      <FlexItem
        class="cancel-reason-input-wrapper"
        fld="row"
        w="90%"
        h="8rem"
        bgc="#fff"
        br="0.6rem"
      >
        <input
          v-model="cancelReason"
          name="cancel-reason-input"
          type="text"
          maxlength="40"
          placeholder="사유를 작성해주세요."
        />
      </FlexItem>
      <ButtonItem
        h="4rem"
        w="10rem"
        br="0.4rem"
        fs="1.4rem"
        bgc="#003566"
        c="#fff"
        @click="handleCancelRequest"
      >
        취소 요청
      </ButtonItem>
    </FlexItem>
  </CrudModal>
</template>

<script setup>
import CrudModal from '@/components/modals/CrudModal.vue';
import FlexItem from '@/components/semantic/FlexItem.vue';
import ButtonItem from '@/components/semantic/ButtonItem.vue';
import TableItem from '@/components/semantic/TableItem.vue';
import TableRow from '@/components/semantic/TableRow.vue';
import TableCell from '@/components/semantic/TableCell.vue';
import { ref } from 'vue';
import { cancelAttendanceRequest } from '@/api/attendance';
import { cancelVacationRequest } from '@/api/vacation';

const cancelReason = ref('');

const props = defineProps({
  item: {
    type: Object,
    required: true,
  },
});

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

const handleCancelRequest = async () => {
  if (!props.item) {
    alert('취소할 신청 내역을 선택하세요');
    return;
  }

  if (cancelReason.value.length > 40) {
    alert('취소 요청 사유는 40자 이내로 작성해주세요.');
    return;
  }

  const formData = {
    cancel_reason: cancelReason.value,
  };

  let response = null;
  if (props.item.attendance_request_id) {
    response = await cancelAttendanceRequest(
      props.item.attendance_request_id,
      formData
    );
  } else if (props.item.vacation_request_id) {
    response = await cancelVacationRequest(
      props.item.vacation_request_id,
      formData
    );
  }

  cancelReason.value = '';

  if (response != null && response.success) {
    alert('취소 요청이 성공적으로 전송되었습니다.');
  } else {
    alert('취소 요청 실패! 다시 시도해주세요.');
  }
  window.location.reload();
};
</script>

<style scoped>
.modal-content {
  gap: 3rem;
  align-items: center;
}

.title {
  color: #003566;
  font-size: 2.2rem;
  font-weight: 700;
}

.mid {
  justify-content: center;
  align-items: center;
}

.modal-content .table {
  width: 90% !important;
}

.cancel-reason-input-wrapper {
  padding: 2rem;
  gap: 3rem;
  box-shadow: 0rem 0rem 0.6rem 0rem rgba(0, 0, 0, 0.2);
}

.cancel-reason-input-wrapper input {
  height: 100%;
  width: 100%;
  font-size: 1.6rem;
}
</style>
