<template>
  <SearchEmployeeComponent
    @employee-selected="handleSelected"
  ></SearchEmployeeComponent>
  <SectionItem class="payment-section" h="100%" w="calc(100% - 52rem)">
    <CommonArticle label="휴가 지급">
      <FlexItem
        class="profile"
        fld="row"
        w="100%"
        h="14rem"
        bgc="#fff"
        br="0.6rem"
      >
        <FigureItem
          v-if="selectedEmployee"
          class="profile-img-wrapper"
          h="100%"
          w="10.5rem"
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
          사원을 선택해주세요.
        </FlexItem>
      </FlexItem>
      <TableItem gtc="2fr 7fr">
        <TableRow>
          <TableCell class="h-7" th fs="1.6rem" topl>휴가 정책</TableCell>
          <TableCell class="h-7 pl-2" fs="1.6rem" topr>
            <DropdownItem
              placeholder="적용할 휴가 정책을 선택하세요."
              w="34rem"
              :list="dropdownVacationPolicyList"
              @update:selected-item="updateSelectedVacationPolicy"
            ></DropdownItem>
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell class="h-7" th fs="1.6rem" botl>휴가 만료일</TableCell>
          <TableCell class="h-7 pl-2" fs="1.6rem" botr>
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
import FlexItem from '@/components/semantic/FlexItem.vue';
import SectionItem from '@/components/semantic/SectionItem.vue';
import CommonArticle from '@/components/common/CommonArticle.vue';
import FigureItem from '@/components/semantic/FigureItem.vue';
import TableItem from '@/components/semantic/TableItem.vue';
import TableRow from '@/components/semantic/TableRow.vue';
import TableCell from '@/components/semantic/TableCell.vue';
import ButtonItem from '@/components/semantic/ButtonItem.vue';
import DropdownItem from '@/components/dropdowns/DropdownItem.vue';
import DateDropDown from '@/components/dropdowns/DateDropDown.vue';
import SearchEmployeeComponent from '@/components/common/SearchEmployeeComponent.vue';
import { ref, onMounted } from 'vue';
import {
  getIrregularVacationPoliciesByYear,
  createVacation,
} from '@/api/vacation';

const vacationPolicyList = ref([]);
const dropdownVacationPolicyList = ref([]);
const isEmpty = ref(true);

const selectedEmployee = ref(null);
const selectedVacationPolicy = ref(null);
const selectedDate = ref(null);

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

    isEmpty.value = vacationPolicyList.value.length === 0 ? true : false;
  } else {
    vacationPolicyList.value = [];
    isEmpty.value = true;
  }
};

const handleSelected = (item) => {
  selectedEmployee.value = item;
};

const updateSelectedVacationPolicy = (_, index) => {
  selectedVacationPolicy.value = vacationPolicyList.value[index];
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

  const today = new Date();
  const minimumDate = new Date(
    today.getTime() +
      selectedVacationPolicy.value.allocation_days * 24 * 60 * 60 * 1000
  ); // 밀리초로 날짜 계산

  if (new Date(selectedDate.value) <= minimumDate) {
    alert(
      '휴가 만료일은 휴가 지급 날짜에서 지급일 수를 더한 날짜보다 이후여야 합니다.'
    );
    return;
  }

  const formData = {
    expired_at: selectedDate.value,
    employee_id: Number(selectedEmployee.value.department_member_id),
    vacation_policy_id: Number(selectedVacationPolicy.value.vacation_policy_id),
  };

  const response = await createVacation(formData);

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
  const year = new Date().getFullYear();
  fetchVacationPolicyData(year);
});
</script>

<style scoped>
.emphasize {
  font-size: 2.2rem;
  font-weight: 500;
}

.normal {
  font-size: 1.2rem;
  font-weight: 400;
}

.h-7 {
  height: 7rem !important;
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
  padding: 2rem;
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
  margin-top: 2rem;
}

.submit-btn {
  margin-top: 3.2rem;
  align-self: center;
}
</style>
