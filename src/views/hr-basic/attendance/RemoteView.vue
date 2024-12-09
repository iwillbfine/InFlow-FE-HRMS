<template>
  <CommonArticle label="재택근무 신청" w="90%">
    <TableItem gtc="2fr 5fr">
      <TableRow>
        <TableCell class="h-7" th fs="1.6rem" topl>재택근무 날짜</TableCell>
        <TableCell class="h-7 pl-1" fs="1.6rem" topr>
          <DateDropDown
            short
            @valid-date-selected="updateSelectedDate"
          ></DateDropDown>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell class="h-7" th fs="1.6rem" botl>재택근무 사유</TableCell>
        <TableCell class="h-7 pl-1" fs="1.6rem" botr>
          <input
            v-model="requestReason"
            class="reason-input"
            type="text"
            name="reason-input"
            placeholder="사유를 작성해주세요."
            maxlength="20"
          />
        </TableCell>
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
  <CommonArticle class="pos-rel" label="재택근무 신청 내역" w="90%">
    <MoreListButton @click="goMoreList"></MoreListButton>
    <TableItem gtc="2fr 4fr 2fr 1fr 1.25fr">
      <TableRow>
        <TableCell th fs="1.6rem" topl>재택근무 날짜</TableCell>
        <TableCell th fs="1.6rem">재택근무 사유</TableCell>
        <TableCell th fs="1.6rem">신청일</TableCell>
        <TableCell th fs="1.6rem">상태</TableCell>
        <TableCell th fs="1.6rem" topr>취소 요청</TableCell>
      </TableRow>
      <TableRow
        v-for="(item, index) in remoteRequestList"
        v-if="!isEmpty"
        :key="index"
      >
        <TableCell
          class="mid"
          fs="1.6rem"
          :botl="index === remoteRequestList.length - 1"
          >{{ parseDate(item.start_date) }}</TableCell
        >
        <TableCell class="mid" fs="1.6rem">{{ item.request_reason }}</TableCell>
        <TableCell class="mid" fs="1.6rem">{{
          parseDate(item.created_at)
        }}</TableCell>
        <TableCell class="mid" fs="1.6rem">{{
          parseRequestStatus(item.request_status)
        }}</TableCell>
        <TableCell
          class="mid"
          fs="1.6rem"
          :botr="index === remoteRequestList.length - 1"
        >
          <span v-if="item.cancel_status == 'Y'">취소 완료</span>
          <ButtonItem
            v-else-if="
              item.cancel_status == 'N' && item.request_status == 'WAIT'
            "
            h="3rem"
            w="6.4rem"
            br="0.4rem"
            fs="1.2rem"
            bgc="#003566"
            c="#fff"
            @click="toggleCancelRequestModal(item)"
          >
            취소 요청
          </ButtonItem>
          <span v-else>-</span>
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
    <CancelRequestModal
      v-if="isModalOpen"
      :item="tryCancelItem"
      @close="toggleCancelRequestModal"
    ></CancelRequestModal>
  </CommonArticle>
</template>

<script setup>
import CommonArticle from '@/components/common/CommonArticle.vue';
import TableCell from '@/components/semantic/TableCell.vue';
import TableRow from '@/components/semantic/TableRow.vue';
import TableItem from '@/components/semantic/TableItem.vue';
import FlexItem from '@/components/semantic/FlexItem.vue';
import ButtonItem from '@/components/semantic/ButtonItem.vue';
import MoreListButton from '@/components/buttons/MoreListButton.vue';
import DateDropDown from '@/components/dropdowns/DateDropDown.vue';
import CancelRequestModal from '@/components/attendance/CancelRequestModal.vue';
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import {
  getRemoteRequestPreviewsByEmployeeId,
  createRemoteRequest,
} from '@/api/attendance';

const eid = ref(null);
const remoteRequestList = ref([]);
const isEmpty = ref(true);
const isModalOpen = ref(false);

const selectedDate = ref('');
const requestReason = ref('');

const tryCancelItem = ref(null);

const router = useRouter();

const fetchRemoteRequestData = async (eid) => {
  const response = await getRemoteRequestPreviewsByEmployeeId(eid);

  if (response.success) {
    remoteRequestList.value = response.content;
    isEmpty.value = remoteRequestList.value.length === 0 ? true : false;
  } else {
    remoteRequestList.value = [];
    isEmpty.value = true;
  }
};

const toggleCancelRequestModal = (item) => {
  tryCancelItem.value = item;
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

const updateSelectedDate = (date) => {
  selectedDate.value = date;
};

const checkValidDate = () => {
  // selectedDate를 Date 객체로 변환
  const selected = new Date(selectedDate.value);

  // 오늘 날짜를 Date 객체로 변환
  const today = new Date();
  today.setHours(0, 0, 0, 0); // 시간 비교를 위해 00:00:00으로 설정

  // selectedDate가 오늘보다 이전인지 비교
  if (selected < today) {
    return false;
  }

  return true;
};

const handleOnclick = async () => {
  if (!selectedDate.value) {
    alert('재택근무 날짜를 선택하세요.');
    return;
  }

  if (!checkValidDate()) {
    alert('재택근무 날짜는 오늘보다 이전일 수 없습니다.');
    return;
  }

  if (!requestReason.value) {
    alert('재택근무 사유를 입력하세요.');
    return;
  }

  if (requestReason.value.length > 20) {
    alert('신청 사유는 20자 이내로 작성해주세요.');
    return;
  }

  const response = await createRemoteRequest({
    request_reason: requestReason.value,
    start_date: selectedDate.value,
    employee_id: eid.value,
    attendance_request_type_id: 1,
  });

  selectedDate.value = ''; // 무한 요청 방지
  requestReason.value = ''; // 무한 요청 방지

  if (response.success) {
    alert('재택근무 신청이 성공적으로 전송되었습니다.');
  } else {
    alert('재택근무 신청 실패! 다시 시도해주세요.');
  }
  window.location.reload();
};

const goMoreList = () => {
  router.push('/hr-basic/attendance/remote/requests');
};

onMounted(() => {
  eid.value = localStorage.getItem('employeeId');
  fetchRemoteRequestData(eid.value);
});
</script>

<style scoped>
.reason-input {
  height: 100%;
  width: 100%;
}

.pos-rel {
  position: relative;
}

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

.mid {
  justify-content: center;
  align-items: center;
}

.submit-btn {
  margin-top: 3.2rem;
  align-self: center;
}

.more-list-btn {
  position: absolute;
  top: 0;
  right: 0;
  gap: 0.3rem;
  align-self: flex-end;
}

.empty-message {
  justify-content: center;
  align-items: center;
}
</style>
