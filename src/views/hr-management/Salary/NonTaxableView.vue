<template>
  <CommonArticle label="비과세 급여 항목 등록" w="95%">
    <TableItem gtc="2fr 4fr">
      <TableRow>
        <TableCell th fs="1.7rem" topl>비과세 항목명</TableCell>
        <TableCell fs="1.7rem">
          <input
            v-model="nonTaxableName"
            name="name_input"
            type="text"
            placeholder="비과세 항목명을 입력해주세요."
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
  <CommonArticle label="비과세 급여 항목" w="95%">
    <TableItem gtc="1fr 3fr 2fr">
      <TableRow>
        <TableCell th fs="1.7rem">No</TableCell>
        <TableCell th fs="1.7rem">비과세 항목명</TableCell>
        <TableCell th fs="1.7rem">금액</TableCell>
      </TableRow>
      <TableRow v-for="(nonTaxable, index) in nonTaxableList" :key="index">
        <TableCell class="c1" fs="1.7rem">{{ index + 1 }}</TableCell>
        <TableCell class="name" fs="1.7rem">{{
          nonTaxable.non_taxable_name
        }}</TableCell>
        <TableCell class="amount" fs="1.7rem">{{
          formatCurrency(nonTaxable.amount)
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
import TableItem from '@/components/semantic/TableItem.vue';
import TableRow from '@/components/semantic/TableRow.vue';
import TableCell from '@/components/semantic/TableCell.vue';
import ButtonItem from '@/components/semantic/ButtonItem.vue';
import PaginationComponent from '@/components/common/PaginationComponent.vue';
import { useRouter } from 'vue-router';
import { onMounted, ref } from 'vue';
import { createNonTaxable, getNonTaxablePayrolls } from '@/api/payroll.js';

const router = useRouter();

const nonTaxableList = ref([]);
const pageInfo = ref({});
const curPage = ref(1);

const nonTaxableName = ref('');
const amount = ref(null);

const fetchData = async (page) => {
  const response = await getNonTaxablePayrolls(page);
  nonTaxableList.value = response.content.elements || [];
  pageInfo.value = response.content;
};

const handlePageChange = (page) => {
  curPage.value = page;
  fetchData(curPage.value);
  router.push({
    name: 'hr-management-salary-non-taxable-payrolls',
    query: { page: curPage.value },
  });
};

const handleOnclick = async () => {
  if (!nonTaxableName.value) {
    alert('항목명을 입력해주세요.');
    return;
  }

  if (!amount.value) {
    alert('금액을 입력해주세요.');
    return;
  }

  const won = Number(amount.value);
  if (isNaN(won) || won < 0) {
    alert('금액은 0보다 큰 숫자여야 합니다..');
    return;
  }

  const formData = {
    non_taxable_name: nonTaxableName.value,
    amount: won,
  };

  nonTaxableName.value = '';
  amount.value = null;

  const response = await createNonTaxable(formData);

  if (response.success) {
    alert('비과세 항목이 성공적으로 등록되었습니다.');
  } else {
    alert('비과세 항목 등록 실패! 다시 시도해주세요.');
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
