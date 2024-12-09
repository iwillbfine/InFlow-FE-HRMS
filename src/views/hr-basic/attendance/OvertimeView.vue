<template>
  <CommonArticle label="초과근무 신청" w="90%">
    <TableItem gtc="2fr 6fr">
      <TableRow>
        <TableCell class="h-7" th fs="1.6rem" topl>초과근무 시간</TableCell>
        <TableCell class="h-7 pl-1 g-2" fs="1.6rem" topr>
          <strong>금일</strong>
          <ThirtyMinuteDropDown
            after-work
            @valid-time-selected="updateSelectedStartTime"
          ></ThirtyMinuteDropDown>
          <strong>~</strong>
          <strong v-if="isTommorow">익일</strong>
          <ThirtyMinuteDropDown
            @valid-time-selected="updateSelectedEndTime"
          ></ThirtyMinuteDropDown>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell class="h-7" th fs="1.6rem" botl>초과근무 사유</TableCell>
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
  <CommonArticle label="초과근무 연장" w="90%">
    <TableItem gtc="2fr 6fr">
      <TableRow>
        <TableCell class="h-7" th fs="1.6rem" topl botl
          >초과근무 종료 시간</TableCell
        >
        <TableCell class="h-7 pl-1 g-2" fs="1.6rem" topr botr>
          <strong v-if="isExtendTommorow">익일</strong>
          <ThirtyMinuteDropDown
            @valid-time-selected="updateExtendEndTime"
          ></ThirtyMinuteDropDown>
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
      @click="handleExtend"
      >연장</ButtonItem
    >
  </CommonArticle>
  <hr />
  <CommonArticle class="pos-rel" label="초과근무 신청 내역" w="90%">
    <MoreListButton @click="goMoreList"></MoreListButton>
    <TableItem gtc="2fr 4fr 2fr 1fr 1.25fr">
      <TableRow>
        <TableCell th fs="1.6rem" topl>초과근무 시간</TableCell>
        <TableCell th fs="1.6rem">초과근무 사유</TableCell>
        <TableCell th fs="1.6rem">신청일</TableCell>
        <TableCell th fs="1.6rem">상태</TableCell>
        <TableCell th fs="1.6rem" topr>취소 요청</TableCell>
      </TableRow>
      <TableRow
        v-for="(item, index) in overtimeRequestList"
        v-if="!isEmpty"
        :key="index"
      >
        <TableCell
          class="mid"
          fs="1.6rem"
          :botl="index === overtimeRequestList.length - 1"
          >{{
            parseTime(item.start_date) + ' ~ ' + parseTime(item.end_date)
          }}</TableCell
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
          :botr="index === overtimeRequestList.length - 1"
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
import ThirtyMinuteDropDown from '@/components/dropdowns/ThirtyMinuteDropDown.vue';
import CancelRequestModal from '@/components/attendance/CancelRequestModal.vue';
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import {
  getOvertimesByEmployeeId,
  getOvertimeRequestPreviewsByEmployeeId,
  extendOvertime,
  createOvertimeRequest,
} from '@/api/attendance';

const eid = ref(null);
const overtime = ref(null);
const overtimeList = ref([]);
const overtimeRequestList = ref([]);
const isEmpty = ref(true);
const isModalOpen = ref(false);
const isTommorow = ref(false);
const isExtendTommorow = ref(false);
const isOvertimeNow = ref(false);

const selectedStartTime = ref('');
const selectedStartDate = ref('');
const selectedEndTime = ref('');
const selectedEndDate = ref('');
const requestReason = ref('');

const extendEndTime = ref('');
const extendEndDate = ref('');

const tryCancelItem = ref(null);

const router = useRouter();

const fetchOvertimeData = async (eid, date) => {
  const response = await getOvertimesByEmployeeId(eid, date);

  if (response.success) {
    overtimeList.value = response.content;
    if (overtimeList.value.length > 0) {
      const startTime = new Date(overtimeList.value[0].start_time);
      const endTime = new Date(overtimeList.value[0].end_time);
      const now = new Date();

      if (now >= startTime && now <= endTime) {
        overtime.value = overtimeList.value[0];
        isOvertimeNow.value = true;
      } else {
        isOvertimeNow.value = false;
      }
    }
  } else {
    overtimeList.value = [];
  }
};

const fetchOvertimeRequestData = async (eid) => {
  const response = await getOvertimeRequestPreviewsByEmployeeId(eid);

  if (response.success) {
    overtimeRequestList.value = response.content;
    isEmpty.value = overtimeRequestList.value.length === 0 ? true : false;
  } else {
    overtimeRequestList.value = [];
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

// 시간만 파싱
const parseTime = (dateStr) => {
  const date = new Date(dateStr);

  const hour = date.getHours();
  const minute = date.getMinutes();

  const formattedDate = `${hour}시 ${minute}분`;
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

// 이번 달 가져오기
const getCurMonth = () => {
  const today = new Date();

  const year = today.getFullYear(); // 연도 가져오기
  const month = String(today.getMonth() + 1).padStart(2, '0'); // 월 가져오기 (0부터 시작하므로 +1, 두 자리로 맞춤)

  const curMonth = `${year}-${month}`;
  return curMonth;
};

const updateSelectedStartTime = (time) => {
  selectedStartTime.value = time;

  // 현재 날짜와 시간 가져오기
  const currentDate = new Date();
  selectedStartDate.value = `${currentDate.getFullYear()}-${(currentDate.getMonth() + 1).toString().padStart(2, '0')}-${currentDate.getDate().toString().padStart(2, '0')}${time}`;
};

const updateSelectedEndTime = (time) => {
  selectedEndTime.value = time;

  // 현재 날짜와 시간 가져오기
  const currentDate = new Date();

  // "T" 이후 시간을 분리하여 시각을 가져옵니다
  const timePart = time.substring(1); // "T" 이후 부분만 추출
  const [hour, minute] = timePart.split(':'); // 시와 분을 분리

  // 시각을 Date 객체로 변환
  const selectedTime = new Date(currentDate);
  selectedTime.setHours(hour, minute, 0, 0); // 현재 날짜에 시간만 설정

  // "T18:30" 이후 시간을 오늘 날짜로 설정
  const timeThreshold = new Date(currentDate.setHours(18, 30, 0, 0)); // 오늘 18:30
  if (selectedTime >= timeThreshold) {
    selectedEndDate.value = `${currentDate.getFullYear()}-${(currentDate.getMonth() + 1).toString().padStart(2, '0')}-${currentDate.getDate().toString().padStart(2, '0')}${time}`;
    isTommorow.value = false;
  }

  // "T00:00"부터 "T17:30" 사이의 시간을 내일 날짜로 설정
  else {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1); // 내일 날짜로 설정
    selectedEndDate.value = `${tomorrow.getFullYear()}-${(tomorrow.getMonth() + 1).toString().padStart(2, '0')}-${tomorrow.getDate().toString().padStart(2, '0')}${time}`;
    isTommorow.value = true;
  }
};

const updateExtendEndTime = (time) => {
  extendEndTime.value = time;

  // 현재 날짜와 시간 가져오기
  const currentDate = new Date();

  // "T" 이후 시간을 분리하여 시각을 가져옵니다
  const timePart = time.substring(1); // "T" 이후 부분만 추출
  const [hour, minute] = timePart.split(':'); // 시와 분을 분리

  // 시각을 Date 객체로 변환
  const selectedTime = new Date(currentDate);
  selectedTime.setHours(hour, minute, 0, 0); // 현재 날짜에 시간만 설정

  // "T18:30" 이후 시간을 오늘 날짜로 설정
  const timeThreshold = new Date(currentDate.setHours(18, 30, 0, 0)); // 오늘 18:30
  if (selectedTime >= timeThreshold) {
    extendEndDate.value = `${currentDate.getFullYear()}-${(currentDate.getMonth() + 1).toString().padStart(2, '0')}-${currentDate.getDate().toString().padStart(2, '0')}${time}`;
    isExtendTommorow.value = false;
  }

  // "T00:00"부터 "T17:30" 사이의 시간을 내일 날짜로 설정
  else {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1); // 내일 날짜로 설정
    extendEndDate.value = `${tomorrow.getFullYear()}-${(tomorrow.getMonth() + 1).toString().padStart(2, '0')}-${tomorrow.getDate().toString().padStart(2, '0')}${time}`;
    isExtendTommorow.value = true;
  }
};

const checkValidDate = (startDate, endDate) => {
  // selectedStartDate와 selectedEndDate가 Date 객체라면 getTime()을 사용하여 시간을 밀리초로 반환
  const start = new Date(startDate);
  const end = new Date(endDate);

  // 시간 차이를 밀리초 단위로 계산
  const timeDifference = Math.abs(end.getTime() - start.getTime());

  // 4시간을 밀리초로 계산 (4시간 * 60분 * 60초 * 1000밀리초)
  const maxTimeDifference = 4 * 60 * 60 * 1000;

  // 시간 차이가 4시간 이하인지 확인
  if (timeDifference > maxTimeDifference) {
    return false;
  }

  return true;
};

const handleOnclick = async () => {
  if (isOvertimeNow.value) {
    alert('이미 초과근무중입니다.');
    return;
  }

  if (!selectedStartTime.value) {
    alert('초과근무 시작 시간을 선택하세요.');
    return;
  }

  if (!selectedEndTime.value) {
    alert('초과근무 종료 시간을 선택하세요.');
    return;
  }

  if (selectedStartDate.value) {
    const today = new Date();

    const startDate = new Date(selectedStartDate.value);
    const startHour = startDate.getHours();

    if (startHour < 18) {
      alert('초과근무 시작 시간은 18시 이후여야 합니다.');
      return;
    }

    if (startDate.getTime() < today.getTime()) {
      alert('시작 시간은 현재 시간보다 이전일 수 없습니다.');
      return;
    }
  }

  if (selectedStartTime.value == selectedEndTime.value) {
    alert('초과근무 시작 시간과 종료시간이 동일합니다.');
    return;
  }

  if (!checkValidDate(selectedStartDate.value, selectedEndDate.value)) {
    alert('초과근무 시간은 하루 최대 4시간 까지 입니다.');
    return;
  }

  if (!requestReason.value) {
    alert('초과근무 사유를 입력하세요.');
    return;
  }

  if (requestReason.value.length > 20) {
    alert('신청 사유는 20자 이내로 작성해주세요.');
    return;
  }

  const response = await createOvertimeRequest({
    request_reason: requestReason.value,
    start_date: selectedStartDate.value,
    end_date: selectedEndDate.value,
    employee_id: eid.value,
    attendance_request_type_id: 2,
  });

  selectedStartTime.value = ''; // 무한 요청 방지
  selectedEndTime.value = ''; // 무한 요청 방지
  selectedStartDate.value = ''; // 무한 요청 방지
  selectedEndDate.value = ''; // 무한 요청 방지
  requestReason.value = ''; // 무한 요청 방지

  if (response.success) {
    alert('초과근무 신청이 성공적으로 전송되었습니다.');
  } else {
    alert('초과근무 신청 실패! 다시 시도해주세요.');
  }
  window.location.reload();
};

const handleExtend = async () => {
  if (!isOvertimeNow.value) {
    alert('초과근무중이 아닙니다.');
    return;
  }

  if (!extendEndTime.value) {
    alert('초과근무 종료 시간을 선택해주세요.');
    return;
  }

  if (new Date(overtime.value.end_time) >= new Date(extendEndDate.value)) {
    alert(
      '연장 종료 시간은 기존 종료 시간보다 이후여야 합니다.' +
        '\n기존 초과근무 종료 시간 : ' +
        parseTime(overtime.value.end_time)
    );
    return;
  }

  if (!checkValidDate(overtime.value.start_time, extendEndDate.value)) {
    alert(
      '초과근무 시간은 하루 최대 4시간 까지 입니다.' +
        '\n초과근무 시작 시간 : ' +
        parseTime(overtime.value.start_time)
    );
    return;
  }

  const response = await extendOvertime(overtime.value.attendance_request_id, {
    end_time: extendEndDate.value,
  });

  extendEndTime.value = '';
  extendEndDate.value = '';

  if (response.success) {
    alert('초과근무 시간이 성공적으로 연장되었습니다.');
  } else {
    alert('초과근무 연장 실패! 다시 시도해주세요.');
  }
  window.location.reload();
};

const goMoreList = () => {
  router.push('/hr-basic/attendance/overtime/requests');
};

onMounted(() => {
  eid.value = localStorage.getItem('employeeId');
  fetchOvertimeData(eid.value, getCurMonth());
  fetchOvertimeRequestData(eid.value);
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
