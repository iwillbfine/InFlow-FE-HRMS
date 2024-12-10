<template>
  <GridItem
    class="salary-table"
    h="90%"
    w="90%"
    maxh="800px"
    maxw="1200px"
    br="0.5rem"
    bgc="#fff"
    gtc="repeat(4, 1fr)"
    b="1px solid #ddd"
  >
    <!-- 테이블 헤더 -->
    <FlexItem
      class="header"
      fs="1.8rem"
      th
      bgc="#f8f8f8"
      fw="700"
      b="1px solid #dadada"
    >
      항목
    </FlexItem>
    <FlexItem
      class="header"
      fs="1.8rem"
      th
      bgc="#f8f8f8"
      fw="700"
      b="1px solid #dadada"
    >
      금액
    </FlexItem>
    <FlexItem
      class="header"
      fs="1.8rem"
      th
      bgc="#f8f8f8"
      fw="700"
      b="1px solid #dadada"
    >
      항목
    </FlexItem>
    <FlexItem
      class="header"
      fs="1.8rem"
      th
      bgc="#f8f8f8"
      fw="700"
      b="1px solid #dadada"
    >
      금액
    </FlexItem>

    <!-- 지급내역 -->
    <FlexItem class="body title" fs="1.7rem" b="1px solid #dadada"
      >계약월급</FlexItem
    >
    <FlexItem class="body amount" fs="1.7rem" b="1px solid #dadada">{{
      formatCurrency(salaryData.monthlySalary)
    }}</FlexItem>
    <FlexItem class="body title" fs="1.7rem" b="1px solid #dadada"
      >국민연금</FlexItem
    >
    <FlexItem class="body amount" fs="1.7rem" b="1px solid #dadada">{{
      formatCurrency(salaryData.nationalPensionDeductible)
    }}</FlexItem>

    <FlexItem class="body title" fs="1.7rem" b="1px solid #dadada"
      >식대</FlexItem
    >
    <FlexItem class="body amount" fs="1.7rem" b="1px solid #dadada">{{
      formatCurrency(salaryData.nonTaxableAmount)
    }}</FlexItem>
    <FlexItem class="body title" fs="1.7rem" b="1px solid #dadada"
      >건강보험</FlexItem
    >
    <FlexItem class="body amount" fs="1.7rem" b="1px solid #dadada">{{
      formatCurrency(salaryData.healthInsuranceDeductible)
    }}</FlexItem>

    <FlexItem class="body title" fs="1.7rem" b="1px solid #dadada"></FlexItem>
    <FlexItem class="body amount" fs="1.7rem" b="1px solid #dadada"></FlexItem>
    <FlexItem class="body title" fs="1.7rem" b="1px solid #dadada"
      >장기요양</FlexItem
    >
    <FlexItem class="body amount" fs="1.7rem" b="1px solid #dadada"></FlexItem>

    <FlexItem class="body title" fs="1.7rem" b="1px solid #dadada"></FlexItem>
    <FlexItem class="body amount" fs="1.7rem" b="1px solid #dadada"></FlexItem>
    <FlexItem class="body title" fs="1.7rem" b="1px solid #dadada"
      >고용보험</FlexItem
    >
    <FlexItem class="body amount" fs="1.7rem" b="1px solid #dadada"></FlexItem>

    <FlexItem class="body title" fs="1.7rem" b="1px solid #dadada"></FlexItem>
    <FlexItem class="body amount" fs="1.7rem" b="1px solid #dadada"></FlexItem>
    <FlexItem class="body title" fs="1.7rem" b="1px solid #dadada"
      >소득세</FlexItem
    >
    <FlexItem class="body amount" fs="1.7rem" b="1px solid #dadada"></FlexItem>

    <FlexItem class="body title" fs="1.7rem" b="1px solid #dadada"></FlexItem>
    <FlexItem class="body amount" fs="1.7rem" b="1px solid #dadada"></FlexItem>
    <FlexItem class="body title" fs="1.7rem" b="1px solid #dadada"
      >지방소득세</FlexItem
    >
    <FlexItem class="body amount" fs="1.7rem" b="1px solid #dadada"></FlexItem>

    <!-- ... 다른 항목 추가 -->

    <!-- 지급/공제 총계 -->
    <FlexItem
      class="footer highlight"
      fs="2rem"
      fw="700"
      bgc="#f4f4f4"
      b="1px solid #dadada"
    >
      지급총액
    </FlexItem>
    <FlexItem
      class="footer highlight"
      fs="2rem"
      fw="700"
      bgc="white"
      b="1px solid #dadada"
    >
      {{ formatCurrency(totalPayment) }}
    </FlexItem>
    <FlexItem
      class="footer highlight"
      fs="2rem"
      fw="700"
      bgc="#f4f4f4"
      b="1px solid #dadada"
    >
      공제총액
    </FlexItem>
    <FlexItem
      class="footer highlight"
      fs="2rem"
      fw="700"
      bgc="white"
      b="1px solid #dadada"
    >
      {{ formatCurrency(salaryData.totalDeductible) }}
    </FlexItem>

    <!-- 차인 지급액 -->
    <FlexItem
      class="footer total highlight"
      fs="2rem"
      fw="700"
      gc="span 3"
      bgc="#f4f4f4"
      b="1px solid #dadada"
    >
      차인지급액
    </FlexItem>
    <FlexItem
      class="footer blank"
      fs="1.2rem"
      fw="700"
      bgc="white"
      b="1px solid #dadada"
    ></FlexItem>
    <FlexItem
      class="footer blank center"
      fs="1.2rem"
      fw="700"
      bgc="white"
      b="1px solid #dadada"
    ></FlexItem>
    <FlexItem
      class="total-pay"
      fs="2rem"
      fw="700"
      bgc="white"
      b="1px solid #dadada"
    >
      {{ formatCurrency(salaryData.actualSalary) }}
    </FlexItem>
  </GridItem>
</template>

<script setup>
import { ref, computed } from 'vue';
import GridItem from '../semantic/GridItem.vue';
import FlexItem from '../semantic/FlexItem.vue';

// 급여 데이터 (props로 받을 수도 있음)
const salaryData = ref({
  monthlySalary: 3000000,
  nonTaxableAmount: 200000,
  nationalPensionDeductible: 135000,
  healthInsuranceDeductible: 106350,
  totalDeductible: 330900,
  actualSalary: 2869100,
});

// 지급 총액 계산
const totalPayment = computed(() => {
  return salaryData.value.monthlySalary + salaryData.value.nonTaxableAmount;
});

// 금액 포맷팅 함수
const formatCurrency = (value) => `${value.toLocaleString()} 원`;
</script>

<style scoped>
.salary-table {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-gap: 0;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  border: 1px solid #ddd;
}

.header {
  text-align: center;
  font-weight: bold;
}

.body {
  text-align: right;
}

.body.title {
  justify-content: center;
  align-items: center;
}
.body.amount {
  justify-content: flex-end;
  align-items: center;
  padding-right: 1rem;
}

.footer {
  text-align: right;
}

.footer.total {
  text-align: center;
}
.footer.blank {
  border-right: none;
}
.footer.blank.center {
  border-right: none;
  border-left: none;
}

.total-pay {
  width: 210px;
  border-left: none;
}
</style>
