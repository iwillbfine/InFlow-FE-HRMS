<template>
  <CommonArticle label="복직 신청" w="90%">
    <TableItem gtc="2fr 6fr">
      <TableRow>
        <TableCell class="h-7" th fs="1.6rem" topl>복직 날짜</TableCell>
        <TableCell class="h-7 pl-1 g-2" fs="1.6rem" topr>
          <DateDropDown
            short
            @valid-date-selected="updateSelectedEndDate"
          ></DateDropDown>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell class="h-7" th fs="1.6rem">복직 사유</TableCell>
        <TableCell class="h-7 pl-1" fs="1.6rem">
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
      <TableRow>
        <TableCell th fs="1.6rem" botl>첨부파일</TableCell>
        <TableCell class="pl-1" fs="1.6rem" botr>
          <div class="file-upload-wrapper">
            <label class="file-upload-label">
              파일 선택
              <input
                type="file"
                class="hidden-file-input"
                accept=".pdf"
                multiple
                @change="handleFileUpload"
              />
            </label>
            <UlItem class="file-list" w="calc(100% - 4.8rem)">
              <LiItem v-for="(file, index) in fileList" :key="index">
                <FileItem
                  :id="index"
                  :name="file.name"
                  @remove-file="handleRemoveFile"
                ></FileItem>
              </LiItem>
            </UlItem>
          </div>
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
  <CommonArticle class="pos-rel" label="복직 신청 내역" w="90%">
    <MoreListButton @click="goMoreList"></MoreListButton>
    <TableItem gtc="3fr 3fr 1.5fr 1fr 1.25fr">
      <TableRow>
        <TableCell th fs="1.6rem" topl>복직 날짜</TableCell>
        <TableCell th fs="1.6rem">복직 사유</TableCell>
        <TableCell th fs="1.6rem">신청일</TableCell>
        <TableCell th fs="1.6rem">상태</TableCell>
        <TableCell th fs="1.6rem" topr>취소 요청</TableCell>
      </TableRow>
      <TableRow
        v-for="(item, index) in returnRequestList"
        v-if="!isEmpty"
        :key="index"
      >
        <TableCell
          class="mid"
          fs="1.6rem"
          :botl="index === returnRequestList.length - 1"
          >{{ parseDate(item.end_date) }}</TableCell
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
          :botr="index === returnRequestList.length - 1"
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
import FileItem from '@/components/common/FileItem.vue';
import UlItem from '@/components/semantic/UlItem.vue';
import LiItem from '@/components/semantic/LiItem.vue';
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import {
  getLeaveReturnsByEmployeeId,
  getReturnRequestPreviewsByEmployeeId,
  createReturnRequest,
} from '@/api/attendance';

const eid = ref(null);
const leaveList = ref([]);
const returnRequestList = ref([]);
const isEmpty = ref(true);
const isModalOpen = ref(false);

const selectedEndDate = ref('');
const requestReason = ref('');
const fileList = ref([]);

const tryCancelItem = ref(null);

const router = useRouter();

const fetchLeaveData = async (eid, page) => {
  const response = await getLeaveReturnsByEmployeeId(eid, page);

  if (response.success) {
    leaveList.value = response.content.elements;
  } else {
    leaveList.value = [];
  }
};

const fetchReturnRequestData = async (eid) => {
  const response = await getReturnRequestPreviewsByEmployeeId(eid);

  if (response.success) {
    returnRequestList.value = response.content;
    isEmpty.value = returnRequestList.value.length === 0 ? true : false;
  } else {
    returnRequestList.value = [];
    isEmpty.value = true;
  }
};

const handleFileUpload = (event) => {
  // event.target.files를 배열로 변환
  const files = Array.from(event.target.files);

  // 선택된 파일들을 fileList에 추가
  fileList.value = [...fileList.value, ...files];

  // 중복 방지
  const uniqueFiles = new Map();
  fileList.value.forEach((file) => uniqueFiles.set(file.name, file));
  fileList.value = Array.from(uniqueFiles.values());

  event.target.value = '';
};

const handleRemoveFile = (index) => {
  fileList.value.splice(index, 1);
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

const updateSelectedEndDate = (date) => {
  selectedEndDate.value = date;
};

const checkValidDate = () => {
  const selectedEnd = new Date(selectedEndDate.value);

  // 오늘 날짜를 Date 객체로 변환
  const today = new Date();
  today.setHours(0, 0, 0, 0); // 시간 비교를 위해 00:00:00으로 설정

  if (selectedEnd < today) {
    return false;
  }

  return true;
};

const handleOnclick = async () => {
  const startDate = new Date(leaveList.value[0].start_date);
  const endDate = new Date(leaveList.value[0].end_date);
  const today = new Date().setHours(0, 0, 0, 0);

  if (leaveList.value.length == 0) {
    alert('휴직 중이 아닙니다.');
    return;
  }

  if (startDate > today) {
    alert('휴직 중이 아닙니다.');
    return;
  }

  if (endDate < today) {
    alert('휴직 중이 아닙니다.');
    return;
  }

  if (!selectedEndDate.value) {
    alert('복직 날짜를 선택하세요.');
    return;
  }

  if (!checkValidDate()) {
    alert('복직 날짜는 오늘보다 이전일 수 없습니다.');
    return;
  }

  if (endDate < new Date(selectedEndDate.value)) {
    alert('복직 날짜는 기존 종료일보다 이후일 수 없습니다.');
    return;
  }

  if (!requestReason.value) {
    alert('복직 사유를 입력하세요.');
    return;
  }

  if (requestReason.value.length > 20) {
    alert('신청 사유는 20자 이내로 작성해주세요.');
    return;
  }

  if (fileList.value.length === 0) {
    alert('복직 신청서 파일을 업로드해주세요.');
    return;
  }

  const formData = new FormData();
  formData.append(
    'attendance_request_id',
    leaveList.value[0].attendance_request_id
  );
  formData.append('request_reason', requestReason.value);
  formData.append('end_date', selectedEndDate.value);
  formData.append('employee_id', eid.value);
  formData.append('attendance_request_type_id', 6);

  fileList.value.forEach((file) => {
    formData.append(`attachments`, file);
  });

  const response = await createReturnRequest(formData);

  selectedEndDate.value = ''; // 무한 요청 방지
  requestReason.value = ''; // 무한 요청 방지
  leaveList.value = []; // 무한 요청 방지
  fileList.value = []; // 무한 요청 방지

  if (response.success) {
    alert('복직 신청이 성공적으로 전송되었습니다.');
  } else {
    alert('복직 신청 실패! 다시 시도해주세요.');
  }
  window.location.reload();
};

const goMoreList = () => {
  router.push('/hr-basic/attendance/return/requests');
};

onMounted(() => {
  eid.value = localStorage.getItem('employeeId');
  fetchLeaveData(eid.value, 1);
  fetchReturnRequestData(eid.value);
});
</script>

<style scoped>
.reason-input {
  height: 100%;
  width: 100%;
}

.hidden-file-input {
  display: none; /* 실제 파일 입력 숨김 */
}

.file-upload-wrapper {
  display: flex;
  gap: 2rem;
  width: 100%;
}

.file-upload-label {
  display: flex;
  justify-content: center;
  align-items: center;
  align-self: center;
  height: 3.8rem;
  width: 7.6rem;
  font-size: 1.4rem;
  color: #fff;
  background-color: #003566;
  border: none;
  border-radius: 0.6rem;
  cursor: pointer;
  text-align: center;
}

.file-list {
  gap: 1rem;
  flex-wrap: wrap;
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
