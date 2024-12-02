<template>
  <CommonArticle label="휴가 신청" w="90%">
    <TableItem gtc="2fr 6fr">
      <TableRow>
        <TableCell class="h-7" th fs="1.6rem" topl>휴가 선택</TableCell>
        <TableCell class="h-7 pl-1 g-2" fs="1.6rem" topr>
          <DropdownItem
            placeholder="사용할 휴가를 선택하세요."
            w="56rem"
            :list="dropdownVacationList"
            @update:selected-item="updateSelectedVacation"
          ></DropdownItem>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell class="h-7" th fs="1.6rem">휴가 기간</TableCell>
        <TableCell class="h-7 pl-1 g-2" fs="1.6rem">
          <DateDropDown
            short
            @valid-date-selected="updateSelectedStartDate"
          ></DateDropDown>
          <strong>~</strong>
          <DateDropDown
            short
            @valid-date-selected="updateSelectedEndDate"
          ></DateDropDown>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell class="h-7" th fs="1.6rem">휴가 사유</TableCell>
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
  <CommonArticle class="pos-rel" label="휴가 신청 내역" w="90%">
    <MoreListButton @click="goMoreList"></MoreListButton>
    <TableItem gtc="3fr 3fr 1.5fr 1fr 1.25fr">
      <TableRow>
        <TableCell th fs="1.6rem" topl>휴가 기간</TableCell>
        <TableCell th fs="1.6rem">휴가 사유</TableCell>
        <TableCell th fs="1.6rem">신청일</TableCell>
        <TableCell th fs="1.6rem">상태</TableCell>
        <TableCell th fs="1.6rem" topr>취소 요청</TableCell>
      </TableRow>
      <TableRow
        v-for="(item, index) in vacationRequestList"
        v-if="!isEmpty"
        :key="index"
      >
        <TableCell
          class="mid"
          fs="1.6rem"
          :botl="index === vacationRequestList.length - 1"
          >{{
            parseDate(item.start_date) + ' ~ ' + parseDate(item.end_date)
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
          :botr="index === vacationRequestList.length - 1"
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
  getLeftAllVacationsByEmployeeId,
  getVacationRequestPreviewsByEmployeeId,
  createVacationRequest,
} from '@/api/vacation';
import DropdownItem from '@/components/dropdowns/DropdownItem.vue';

const eid = ref(null);
const dropdownVacationList = ref([]);
const vacationList = ref([]);
const vacationRequestList = ref([]);
const isEmpty = ref(true);
const isModalOpen = ref(false);

const arrayIndex = ref(null);
const selectedVacation = ref(null);
const selectedStartDate = ref('');
const selectedEndDate = ref('');
const requestReason = ref('');
const fileList = ref([]);

const tryCancelItem = ref(null);

const router = useRouter();

const fetchVacationData = async (eid) => {
  const response = await getLeftAllVacationsByEmployeeId(eid);

  if (response.success) {
    vacationList.value = response.content;
    for (const vacation of vacationList.value) {
      dropdownVacationList.value.push({
        id: vacation.vacation_id,
        name:
          vacation.vacation_name +
          ' / 잔여일 수 : ' +
          vacation.vacation_left +
          ' / 만료일 : ' +
          parseDate(vacation.expired_at),
      });
    }

    isEmpty.value = vacationList.value.isEmpty ? true : false;
  } else {
    vacationList.value = [];
    isEmpty.value = true;
  }
};

const fetchVacationRequestData = async (eid) => {
  const response = await getVacationRequestPreviewsByEmployeeId(eid);

  if (response.success) {
    vacationRequestList.value = response.content;
    isEmpty.value = vacationRequestList.value.length === 0 ? true : false;
  } else {
    vacationRequestList.value = [];
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

const updateSelectedVacation = (id, index) => {
  selectedVacation.value = id;
  arrayIndex.value = index;
};

const updateSelectedStartDate = (date) => {
  selectedStartDate.value = date;
};

const updateSelectedEndDate = (date) => {
  selectedEndDate.value = date;
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

  if (startDate > endDate) {
    alert('휴가 종료일자는 휴가 시작일자보다 이전일 수 없습니다.');
    return;
  }

  const expireDate = new Date(vacationList.value[arrayIndex.value].expired_at);
  if (endDate > expireDate) {
    alert('휴가 종료일자는 휴가 만료일보다 이전이어야 합니다.');
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

const goMoreList = () => {
  router.push('/hr-basic/attendance/vacation/requests');
};

onMounted(() => {
  eid.value = localStorage.getItem('employeeId');
  fetchVacationData(eid.value);
  fetchVacationRequestData(eid.value);
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
