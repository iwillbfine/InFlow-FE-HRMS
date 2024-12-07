<template>
  <CommonArticle label="휴가 정책 등록" w="95%">
    <TableItem gtc="1fr 2fr 1fr 2fr">
      <TableRow>
        <TableCell th fs="1.6rem" topl>휴가 정책명</TableCell>
        <TableCell fs="1.6rem">
          <input
            v-model="vacationPolicyName"
            name="policy_name_input"
            type="text"
            placeholder="휴가 정책명을 입력해주세요."
            maxlength="20"
          />
        </TableCell>
        <TableCell th fs="1.6rem">휴가 정책 설명</TableCell>
        <TableCell fs="1.6rem" topr>
          <input
            v-model="vacationPolicyDescription"
            name="policy_description_input"
            type="text"
            placeholder="휴가에 대한 설명을 입력해주세요."
            maxlength="50"
          />
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell th fs="1.6rem">휴가 지급일 수</TableCell>
        <TableCell fs="1.6rem">
          <input
            v-model="allocationDays"
            name="allocation_days_input"
            type="text"
            placeholder="휴가 지급일 수를 입력해주세요."
            maxlength="3"
          />
        </TableCell>
        <TableCell th fs="1.6rem">휴가 유형</TableCell>
        <TableCell class="h-7 pl-2" fs="1.6rem">
          <DropdownItem
            w="12rem"
            :list="dropdownVacationTypeList"
            placeholder="휴가 유형"
            @update:selected-item="updateSelectedVacationType"
          ></DropdownItem>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell th fs="1.6rem">휴가 정책 적용 대상</TableCell>
        <TableCell class="h-7 pl-2" fs="1.6rem">
          <DropdownItem
            w="16rem"
            :list="vacationPolicyStatusList"
            placeholder="정책 적용 대상"
            @update:selected-item="updateSelectedVacationPolicyStatus"
          ></DropdownItem>
        </TableCell>
        <TableCell th fs="1.6rem">휴가 정책 적용 연도</TableCell>
        <TableCell class="h-7 pl-2" fs="1.6rem">
          <YearDropDown
            short
            @valid-date-selected="updateSelectedYear"
          ></YearDropDown>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell th fs="1.6rem" botl>유급 휴가 여부</TableCell>
        <TableCell class="h-7 pl-2" fs="1.6rem">
          <DropdownItem
            w="12rem"
            :list="paidStatusList"
            placeholder="유/무급"
            @update:selected-item="updateSelectedPaidStatus"
          ></DropdownItem>
        </TableCell>
        <TableCell th fs="1.6rem">휴가 자동지급 주기</TableCell>
        <TableCell class="h-7 pl-2" fs="1.6rem" botr>
          <DropdownItem
            w="12rem"
            :list="autoAllocationCycleList"
            placeholder="지급 주기"
            @update:selected-item="updateSelectedAutoAllocationCycle"
          ></DropdownItem>
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
  <CommonArticle label="등록된 휴가 정책" w="95%">
    <TableItem gtc="2.5fr 1fr 1fr 5fr 1.5fr 1fr 1fr 1fr">
      <TableRow>
        <TableCell th fs="1.6rem" topl>휴가 정책명</TableCell>
        <TableCell th fs="1.6rem">휴가 유형</TableCell>
        <TableCell th fs="1.6rem">연도</TableCell>
        <TableCell th fs="1.6rem">설명</TableCell>
        <TableCell th fs="1.6rem">적용 대상</TableCell>
        <TableCell th fs="1.6rem">지급일 수</TableCell>
        <TableCell th fs="1.6rem">유/무급</TableCell>
        <TableCell th fs="1.6rem" topr>지급 주기</TableCell>
      </TableRow>
      <TableRow
        v-for="(item, index) in vacationPolicyList"
        v-if="!isEmpty"
        :key="index"
      >
        <TableCell
          class="mid"
          fs="1.6rem"
          :botl="index === vacationPolicyList.length - 1"
          >{{ item.vacation_policy_name }}</TableCell
        >
        <TableCell class="mid" fs="1.6rem">{{
          item.vacation_type_name
        }}</TableCell>
        <TableCell class="mid" fs="1.6rem">{{ item.year }}</TableCell>
        <TableCell class="mid" fs="1.6rem">{{
          item.vacation_policy_description
        }}</TableCell>
        <TableCell class="mid" fs="1.6rem">{{
          parseVacationPolicyStatus(item.vacation_policy_status)
        }}</TableCell>
        <TableCell class="mid" fs="1.6rem">{{
          item.allocation_days
        }}</TableCell>
        <TableCell class="mid" fs="1.6rem">{{
          item.paid_status === 'Y' ? '유급' : '무급'
        }}</TableCell>
        <TableCell
          class="mid"
          fs="1.6rem"
          :botr="index === vacationPolicyList.length - 1"
        >
          {{ parseAutoAllocationCycle(item.auto_allocation_cycle) }}
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
      등록된 휴가 정책이 없습니다.
    </FlexItem>
  </CommonArticle>
</template>

<script setup>
import CommonArticle from '@/components/common/CommonArticle.vue';
import TableCell from '@/components/semantic/TableCell.vue';
import TableRow from '@/components/semantic/TableRow.vue';
import TableItem from '@/components/semantic/TableItem.vue';
import FlexItem from '@/components/semantic/FlexItem.vue';
import ButtonItem from '@/components/semantic/ButtonItem.vue';
import DropdownItem from '@/components/dropdowns/DropdownItem.vue';
import YearDropDown from '@/components/dropdowns/YearDropDown.vue';
import { ref, onMounted } from 'vue';
import {
  getVacationTypes,
  getVacationPoliciesByYear,
  createVacationPolicy,
} from '@/api/vacation';

const eid = ref(null);
const vacationTypeList = ref([]);
const vacationPolicyList = ref([]);
const dropdownVacationTypeList = ref([]);
const isEmpty = ref(true);

const vacationPolicyName = ref('');
const vacationPolicyDescription = ref('');
const allocationDays = ref(null);
const selectedVacationPolicyStatus = ref('');
const selectedVacationType = ref(null);
const selectedYear = ref(null);
const selectedPaidStatus = ref('');
const selectedAutoAllocationCycle = ref('');

const vacationPolicyStatusList = [
  { id: 'NORMAL', name: '모든 사원' },
  { id: 'WOMAN_ONLY', name: '여성 사원' },
  { id: 'LONG_TERM', name: '장기 근속 사원' },
  { id: 'ROOKIE', name: '신입 사원' },
];

const parseVacationPolicyStatus = (status) => {
  switch (status) {
    case 'NORMAL':
      return '모든 사원';
    case 'WOMAN_ONLY':
      return '여성 사원';
    case 'LONG_TERM':
      return '장기 근속 사원';
    case 'ROOKIE':
      return '신입 사원';
    default:
      return '모든사원';
  }
};

const parseAutoAllocationCycle = (cycle) => {
  switch (cycle) {
    case '0 0 0 1 1 *':
      return '1년마다';
    case '0 0 0 1 * *':
      return '1달마다';
    default:
      return '-';
  }
};

const paidStatusList = [
  { id: 'Y', name: '유급' },
  { id: 'N', name: '무급' },
];

const autoAllocationCycleList = [
  { id: null, name: '선택 안함' },
  { id: '0 0 0 1 1 *', name: '1년마다' },
  { id: '0 0 0 1 * *', name: '1달마다' },
];

const fetchVacationTypeData = async () => {
  const response = await getVacationTypes();

  if (response.success) {
    vacationTypeList.value = response.content;
    for (const vacationType of vacationTypeList.value) {
      dropdownVacationTypeList.value.push({
        id: vacationType.vacation_type_id,
        name: vacationType.vacation_type_name,
      });
    }
  } else {
    vacationTypeList.value = [];
  }
};

const fetchVacationPolicyData = async (year) => {
  const response = await getVacationPoliciesByYear(year);

  if (response.success) {
    vacationPolicyList.value = response.content;
    isEmpty.value = vacationPolicyList.value.length === 0 ? true : false;
  } else {
    vacationPolicyList.value = [];
    isEmpty.value = true;
  }
};

const updateSelectedVacationType = (id) => {
  selectedVacationType.value = id;
};

const updateSelectedYear = (year) => {
  selectedYear.value = year;
};

const updateSelectedVacationPolicyStatus = (status) => {
  selectedVacationPolicyStatus.value = status;
};

const updateSelectedPaidStatus = (status) => {
  selectedPaidStatus.value = status;
};

const updateSelectedAutoAllocationCycle = (cycle) => {
  selectedAutoAllocationCycle.value = cycle;
};

const handleOnclick = async () => {
  if (!vacationPolicyName.value) {
    alert('휴가 정책명을 입력해주세요.');
    return;
  }

  if (vacationPolicyName.value.length > 20) {
    alert('휴가 정책명을 20자 이내로 입력해주세요.');
    return;
  }

  if (!vacationPolicyDescription.value) {
    alert('휴가 정책에 대한 설명을 입력해주세요.');
    return;
  }

  if (vacationPolicyDescription.value.length > 50) {
    alert('휴가 정책에 대한 설명을 50자 이내로 입력해주세요.');
    return;
  }

  if (!allocationDays.value) {
    alert('휴가 지급일 수를 입력해주세요.');
    return;
  }

  const days = Number(allocationDays.value);
  if (isNaN(days) || days <= 0) {
    alert('휴가 지급일 수는 0보다 큰 숫자여야 합니다.');
    return;
  }

  if (!allocationDays.value) {
    alert('휴가 지급일 수를 입력해주세요.');
    return;
  }

  if (!selectedVacationType.value) {
    alert('휴가 유형을 선택해주세요.');
    return;
  }

  if (!selectedVacationPolicyStatus.value) {
    alert('정책 적용 대상을 선택해주세요.');
    return;
  }

  if (!selectedYear.value) {
    alert('정책 적용 연도를 선택해주세요.');
    return;
  }

  if (!selectedPaidStatus.value) {
    alert('유급 휴가 여부를 선택해주세요.');
    return;
  }

  const formData = {
    vacation_policy_name: vacationPolicyName.value,
    vacation_policy_description: vacationPolicyDescription.value,
    vacation_policy_status: selectedVacationPolicyStatus.value,
    allocation_days: days,
    paid_status: selectedPaidStatus.value,
    year: selectedYear.value,
    auto_allocation_cycle: selectedAutoAllocationCycle.value
      ? selectedAutoAllocationCycle.value
      : null,
    vacation_type_id: selectedVacationType.value,
    policy_register_id: Number(eid.value),
  };

  vacationPolicyName.value = '';
  vacationPolicyDescription.value = '';
  selectedVacationPolicyStatus.value = '';
  allocationDays.value = null;
  selectedPaidStatus.value = '';
  selectedAutoAllocationCycle.value = null;
  selectedVacationType.value = '';

  const response = await createVacationPolicy(formData);

  if (response.success) {
    alert('휴가 정책이 성공적으로 등록되었습니다.');
  } else {
    alert('휴가 정책 등록 실패! 다시 시도해주세요.');
  }
  window.location.reload();
};

onMounted(() => {
  eid.value = localStorage.getItem('employeeId');
  const year = new Date().getFullYear();
  fetchVacationTypeData();
  fetchVacationPolicyData(year);
});
</script>

<style scoped>
hr {
  width: 95%;
  margin-top: 3rem;
  margin-bottom: 3rem;
  border: 1px solid #dadada;
}

.h-7 {
  height: 7rem !important;
}

.pl-2 {
  padding-left: 2rem;
}

.g-2 {
  gap: 2rem;
}

.mid {
  justify-content: center;
}

.tc input {
  height: 100%;
  width: 100%;
  padding: 1rem;
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
