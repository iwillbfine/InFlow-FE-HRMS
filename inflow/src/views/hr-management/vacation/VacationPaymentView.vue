<template>
  <ArticleItem
    class="search-emp"
    h="calc(100% - 23.6rem)"
    w="32rem"
    bgc="#f8f8f8"
  >
    <FlexItem
      class="search-bar"
      fld="row"
      w="100%"
      fs="1.5rem"
      bgc="#fff"
      b="0.6px solid #ccc"
      br="0.3rem"
    >
      <input
        name="search-emp-input"
        type="text"
        placeholder="사원코드 및 사원명으로 검색"
      />
      <SearchButton
        h="4rem"
        w="4rem"
        bgc="#E6E6E6"
        c="#5a5a5a"
        fs="1.7rem"
        br="0rem 0.3rem 0.3rem 0rem"
      ></SearchButton>
    </FlexItem>
    <UlItem
      v-if="!isEmpty"
      class="emp-list"
      fld="column"
      h="calc(100% - 4rem)"
      w="100%"
    >
      <LiItem
        v-for="(item, index) in employeeList"
        :key="index"
        class="emp-item"
        w="100%"
        h="10rem"
        bgc="#fff"
        b="0.6px solid #ccc"
        br="0.3rem"
        @click="handleSelected(item)"
      >
        <span class="emphasize">{{ item.employee_name }}</span>
        <span class="normal">{{ item.employee_number }}</span>
        <span class="normal">{{ item.department_path }}</span>
      </LiItem>
    </UlItem>
    <FlexItem
      v-if="isEmpty"
      class="empty-message"
      fld="row"
      h="6rem"
      w="100%"
      fs="1.4rem"
    >
      검색된 사원이 없습니다.
    </FlexItem>
  </ArticleItem>
  <SectionItem class="payment-section" h="100%" w="calc(100% - 48rem)">
    <CommonArticle label="휴가 지급">
      <FlexItem
        class="profile"
        fld="row"
        w="100%"
        h="18rem"
        bgc="#fff"
        br="0.6rem"
      >
        <FigureItem
          v-if="selectedEmployee"
          class="profile-img-wrapper"
          h="100%"
          w="13rem"
        >
          <img :src="selectedEmployee.profile_image_url" alt="Profile Image" />
        </FigureItem>
        <FlexItem
          v-if="selectedEmployee"
          class="emp-info"
          fld="column"
          h="100%"
        >
          <span class="emphasize">{{ selectedEmployee.employee_name }}</span>
          <span class="normal">{{ selectedEmployee.employee_number }}</span>
          <span class="normal">{{ selectedEmployee.department_path }}</span>
        </FlexItem>
        <FlexItem
          v-else
          class="empty-message"
          fld="row"
          h="100%"
          w="100%"
          fs="2rem"
        >
          사원을 검색해주세요.
        </FlexItem>
      </FlexItem>
      <TableItem gtc="2fr 7fr">
        <TableRow>
          <TableCell class="h-8" th fs="1.6rem" topl>휴가 정책</TableCell>
          <TableCell class="h-8 pl-2" fs="1.6rem" topr>
            <DropdownItem
              placeholder="적용할 휴가 정책을 선택하세요."
              w="34rem"
              :list="dropdownVacationPolicyList"
              @update:selected-item="updateSelectedVacationPolicy"
            ></DropdownItem>
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell class="h-8" th fs="1.6rem" botl>휴가 만료일</TableCell>
          <TableCell class="h-8 pl-2" fs="1.6rem" botr>
            <DateDropDown
              short
              @valid-date-selected="updateSelectedDate"
            ></DateDropDown>
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
        >지급
      </ButtonItem>
    </CommonArticle>
  </SectionItem>
</template>

<script setup>
import SearchButton from '@/components/buttons/SearchButton.vue';
import ArticleItem from '@/components/semantic/ArticleItem.vue';
import FlexItem from '@/components/semantic/FlexItem.vue';
import LiItem from '@/components/semantic/LiItem.vue';
import UlItem from '@/components/semantic/UlItem.vue';
import SectionItem from '@/components/semantic/SectionItem.vue';
import CommonArticle from '@/components/common/CommonArticle.vue';
import FigureItem from '@/components/semantic/FigureItem.vue';
import TableItem from '@/components/semantic/TableItem.vue';
import TableRow from '@/components/semantic/TableRow.vue';
import TableCell from '@/components/semantic/TableCell.vue';
import ButtonItem from '@/components/semantic/ButtonItem.vue';
import DropdownItem from '@/components/dropdowns/DropdownItem.vue';
import DateDropDown from '@/components/dropdowns/DateDropDown.vue';
import { ref, onMounted } from 'vue';
import { getEmployeesByKeywordOrDepartmentCode } from '@/api/department';
import {
  getIrregularVacationPoliciesByYear,
  createVacation,
} from '@/api/vacation';

const employeeList = ref([]);
const vacationPolicyList = ref([]);
const dropdownVacationPolicyList = ref([]);
const isEmpty = ref(true);
const keyword = ref('');

const selectedEmployee = ref(null);
const selectedVacationPolicy = ref(null);
const selectedDate = ref(null);

const fetchSearchedEmployeeData = async (keyword) => {
  const response = await getEmployeesByKeywordOrDepartmentCode(keyword);

  if (response.success) {
    employeeList.value = response.content;
    isEmpty.value = employeeList.value.isEmpty ? true : false;
  } else {
    employeeList.value = [];
    isEmpty.value = true;
  }
};

const fetchVacationPolicyData = async (year) => {
  const response = await getIrregularVacationPoliciesByYear(year);

  if (response.success) {
    vacationPolicyList.value = response.content;
    for (const vacationPolicy of vacationPolicyList.value) {
      dropdownVacationPolicyList.value.push({
        id: vacationPolicy.vacation_policy_id,
        name:
          vacationPolicy.vacation_policy_name +
          ' / 지급일 수 : ' +
          vacationPolicy.allocation_days,
      });
    }

    isEmpty.value = vacationPolicyList.value.isEmpty ? true : false;
  } else {
    vacationPolicyList.value = [];
    isEmpty.value = true;
  }
};

const handleSelected = (item) => {
  selectedEmployee.value = item;
};

const updateSelectedVacationPolicy = (id) => {
  selectedVacationPolicy.value = id;
};

const updateSelectedDate = (date) => {
  selectedDate.value = date;
};

const handleOnclick = async () => {
  if (!selectedEmployee.value) {
    alert('사원을 선택하세요.');
    return;
  }

  if (!selectedVacationPolicy.value) {
    alert('적용할 휴가 정책을 선택하세요.');
    return;
  }

  if (!selectedDate.value) {
    alert('휴가 만료일을 선택하세요.');
    return;
  }

  if (
    new Date(selectedDate.value).setHours(0, 0, 0, 0) <
    new Date().setHours(0, 0, 0, 0)
  ) {
    alert('휴가 만료일은 오늘보다 이전일 수 없습니다.');
    return;
  }

  const response = await createVacation({
    expired_at: selectedDate.value,
    employee_id: selectedEmployee.value.employee_id,
    vacation_policy_id: selectedVacationPolicy.value,
  });

  selectedEmployee.value = null; // 무한 요청 방지
  selectedVacationPolicy.value = null; // 무한 요청 방지
  selectedDate.value = ''; // 무한 요청 방지

  if (response.success) {
    alert('휴가가 성공적으로 지급되었습니다.');
  } else {
    alert('휴가 지급 실패! 다시 시도해주세요.');
  }
  window.location.reload();
};

onMounted(() => {
  keyword.value = '홍길동';
  const year = new Date().getFullYear();
  fetchSearchedEmployeeData(keyword.value);
  fetchVacationPolicyData(year);
});
</script>

<style scoped>
.search-emp {
  position: fixed;
  padding: 0.8rem;
  top: 23.6rem;
  left: 14rem;
  z-index: 2;
}

.search-bar input {
  height: 100%;
  width: calc(100% - 3.6rem);
  padding-left: 1rem;
  border-right: 0.6px solid #ccc;
  overflow: hidden;
}

.emp-list {
  margin-top: 1.5rem;
  gap: 1rem;
  overflow-y: auto;
}

.emp-item {
  padding: 1.2rem;
  gap: 0.3rem;
}

.emphasize {
  font-size: 2.2rem;
  font-weight: 500;
}

.normal {
  font-size: 1.2rem;
  font-weight: 400;
}

.h-8 {
  height: 8rem !important;
}

.pl-2 {
  padding-left: 2rem;
}

.empty-message {
  justify-content: center;
  align-items: center;
}

.payment-section {
  position: fixed;
  top: 23.6rem;
  right: 2rem;
  padding: 3rem;
}

.profile {
  padding: 1rem;
  gap: 3rem;
  box-shadow: 0rem 0rem 0.6rem 0rem rgba(0, 0, 0, 0.2);
}

.profile-img-wrapper img {
  height: 100%;
  width: 100%;
  object-fit: cover;
}

.emp-info {
  justify-content: center;
  gap: 1rem;
}

.table {
  margin-top: 3rem;
}

.submit-btn {
  margin-top: 3.2rem;
  align-self: center;
}
</style>
