<template>
<CommonArticle label="재택근무 신청" minh="29rem" w="90%">
  <TableItem gtc="2fr 4fr">
    <TableRow>
      <TableCell class="h-7" th fs="1.6rem">재택근무 요청 날짜</TableCell>
      <TableCell class="h-7 pl-1" fs="1.6rem">
        <DateDropDown @valid-date-selected=""></DateDropDown>
      </TableCell>
    </TableRow>
    <TableRow>
      <TableCell class="h-7" th fs="1.6rem">재택근무 사유</TableCell>
      <TableCell class="h-7 pl-1" fs="1.6rem">
        <input type="text" name="reason-input" placeholder="사유를 작성해주세요."/>
      </TableCell>
    </TableRow>
  </TableItem>
  <ButtonItem class="submit-btn" h="3.6rem" w="7.2rem" bgc="#003566" br="0.6rem" c="#fff" fs="1.6rem" @click="handleOnclick">신청</ButtonItem>
</CommonArticle>
<hr/>
<CommonArticle label="재택근무 신청 내역" minh="30rem" w="90%">
  <TableItem gtc="2fr 4fr 6fr 3fr 3fr">
    <TableRow>
      <TableCell th fs="1.6rem">신청 ID</TableCell>
      <TableCell th fs="1.6rem">재택근무 요청 날짜</TableCell>
      <TableCell th fs="1.6rem">재택근무 사유</TableCell>
      <TableCell th fs="1.6rem">상태</TableCell>
      <TableCell th fs="1.6rem">취소 요청</TableCell>
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
</CommonArticle>
</template>

<script setup>
import CommonArticle from '@/components/common/CommonArticle.vue';
import TableCell from '@/components/semantic/TableCell.vue';
import TableItem from '@/components/semantic/TableItem.vue';
import FlexItem from '@/components/semantic/FlexItem.vue';
import ButtonItem from '@/components/semantic/ButtonItem.vue';
import TableRow from '@/components/semantic/TableRow.vue';
import DateDropDown from '@/components/dropdowns/DateDropDown.vue';
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { getRemoteRequestPreviewsByEmployeeId } from '@/api/attendance';

const eid = ref(null);
const remoteRequestList = ref([]);
const isEmpty = ref(true);

const router = useRouter();

const fetchRemoteRequestData = async (eid) => {
  const response = await getRemoteRequestPreviewsByEmployeeId(eid);

  if (response.success) {
    remoteRequestList.value = response.content;
    isEmpty.value = remoteRequestList.value.isEmpty ? true : false;
  } else {
    remoteRequestList.value = [];
    isEmpty.value = true;
  }
}

const handleOnclick = () => {

};

onMounted(() => {
  eid.value = localStorage.getItem('employeeId');
  if (eid.value == null) {
    alert("로그인이 필요합니다.");
    router.push('/login');
  }
  fetchRemoteRequestData(eid.value);
});
</script>

<style scoped>
hr {
  width: 90%;
  margin-bottom: 3rem;
  border: 1px solid #DADADA;
}

.h-7 {
  height: 7rem !important;
}

.pl-1 {
  padding-left: 2rem;
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
