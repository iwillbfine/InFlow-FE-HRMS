<template>
  <CommonArticle label="비정기 수당 항목 등록" w="95%">
    <TableItem gtc="2fr 4fr">
      <TableRow>
        <TableCell th fs="1.7rem" topl>비정기 수당 항목명</TableCell>
        <TableCell fs="1.7rem">
          <input
            v-model="irregularAllowanceName"
            name="name_input"
            type="text"
            placeholder="비정기 수당명을 입력해주세요."
            maxlength="20"
          />
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell th fs="1.7rem">금액</TableCell>
        <TableCell fs="1.7rem" topr>
          <input
            v-model="amount"
            name="amount_input"
            type="text"
            placeholder="금액을 입력해주세요."
            maxlength="9"
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
      >등록</ButtonItem
    >
  </CommonArticle>
  <hr />
  <CommonArticle label="비정기 수당 항목" w="95%">
    <TableItem gtc="1fr 3fr 2fr">
      <TableRow>
        <TableCell th fs="1.7rem">No</TableCell>
        <TableCell th fs="1.7rem">비정기 수당명</TableCell>
        <TableCell th fs="1.7rem">금액</TableCell>
      </TableRow>
      <TableRow v-for="(allowance, index) in allowanceList" :key="index">
        <TableCell class="c1" fs="1.7rem">{{ index + 1 }}</TableCell>
        <TableCell class="name" fs="1.7rem">{{
          allowance.irregular_allowance_name
        }}</TableCell>
        <TableCell class="amount" fs="1.7rem">{{
          formatCurrency(allowance.amount)
        }}</TableCell>
      </TableRow>
    </TableItem>
    <PaginationComponent
      class="pagination"
      :data="pageInfo"
      @changePage="handlePageChange"
    ></PaginationComponent>
  </CommonArticle>
</template>
<script setup>
import CommonArticle from '@/components/common/CommonArticle.vue';
import TableRow from '@/components/semantic/TableRow.vue';
import TableCell from '@/components/semantic/TableCell.vue';
import TableItem from '@/components/semantic/TableItem.vue';
import ButtonItem from '@/components/semantic/ButtonItem.vue';
import { onMounted, ref } from 'vue';
import {
  createIrregularAllowance,
  getIrregularAllowance,
} from '@/api/payroll.js';
import PaginationComponent from '@/components/common/PaginationComponent.vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const allowanceList = ref([]);
const pageInfo = ref({});
const curPage = ref(1);

const irregularAllowanceName = ref('');
const amount = ref(null);

const fetchData = async (page) => {
  const response = await getIrregularAllowance(page);
  allowanceList.value = response.content.elements || [];
  pageInfo.value = response.content;
};

const handlePageChange = (page) => {
  curPage.value = page;
  fetchData(curPage.value);
  router.push({
    name: 'hr-management-salary-irregular-allowance',
    query: { page: curPage.value },
  });
};

const handleOnclick = async () => {
  if (!irregularAllowanceName.value) {
    alert('항목명을 입력해주세요.');
    return;
  }

  if (!amount.value) {
    alert('금액을 입력해주세요.');
    return;
  }

  const won = Number(amount.value);
  if (isNaN(won) || won <= 0) {
    alert('금액은 0보다 큰 숫자여야 합니다..');
    return;
  }

  const formData = {
    irregular_allowance_name: irregularAllowanceName.value,
    amount: won,
  };

  irregularAllowanceName.value = '';
  amount.value = null;

  const response = await createIrregularAllowance(formData);

  if (response.success) {
    alert('비정기 수당 항목이 성공적으로 등록되었습니다.');
  } else {
    alert('비정기 수당 항목 등록 실패! 다시 시도해주세요.');
  }
  window.location.reload();
};

const formatCurrency = (value) => `${value.toLocaleString()} 원`;

onMounted((page) => {
  curPage.value = page;
  fetchData(curPage.value);
});
</script>

<style scoped>
.submit-btn {
  margin-top: 3.2rem;
  align-self: center;
}

.c1 {
  justify-content: center;
  align-items: center;
}

.name {
  justify-content: center;
  align-items: center;
}

.amount {
  justify-content: flex-end;
  align-items: center;
}
</style>
