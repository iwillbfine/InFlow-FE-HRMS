<template>
  <div class="profile-wrapper">
    <!-- 로딩 중일 때 표시 -->
    <LoadingOverlay
      :isVisible="loading"
      message="수정 중입니다. 잠시만 기다려 주세요..."
    />

    <div class="profile-buttons-container">
      <span class="profile-label">인적사항</span>
      <div class="profile-buttons">
        <button
          v-if="props.employee_id === undefined"
          @click="toggleEditMode"
          class="btn"
        >
          {{ editMode ? '수정 요청' : '수정' }}
        </button>
      </div>
    </div>
    <div class="profile-container">
      <div class="profile-header">
        <!-- 프로필 사진 -->
        <div
          class="profile-photo-container"
          @mouseover="hoverPhoto = true"
          @mouseleave="hoverPhoto = false"
        >
          <img
            :src="previewPhoto || employee.photoUrl"
            alt="Profile Photo"
            class="profile-photo"
            @click="handlePhotoUpload"
          />
          <div v-if="hoverPhoto && editMode" class="photo-edit-overlay">
            사진 수정
          </div>
          <input
            ref="photoInput"
            type="file"
            accept="image/*"
            style="display: none"
            @change="onPhotoChange"
          />
        </div>
        <table class="employee-info-table">
          <tbody>
            <tr>
              <th>사원번호</th>
              <td>{{ employee.employeeCode }}</td>
              <th>성별</th>
              <td>{{ employee.gender }}</td>
              <th>휴대폰번호</th>
              <td style="position: relative">
                <template v-if="editMode">
                  <input
                    type="text"
                    v-model="form.phone"
                    class="editable-input"
                    :class="{ 'invalid-row': !isValidPhone }"
                    @input="formatPhone"
                    @focus="showPhoneModal"
                    @blur="hidePhoneModal"
                  />
                  <div v-if="isPhoneModalVisible" class="phone-modal">
                    <div class="phone-modal-content">
                      <h3>휴대폰 번호 입력 형식</h3>
                      <ul>
                        <li>
                          숫자를 입력하면 <b>자동으로 포맷</b>이 변경됩니다!
                        </li>
                        <li>
                          <span style="color: #00509e; font-weight: bold"
                            >예시:</span
                          >
                          <span
                            style="text-decoration: line-through; color: #999"
                            >01012345678</span
                          >
                          →
                          <span style="color: #333; font-weight: bold"
                            >010-1234-5678</span
                          >
                        </li>
                      </ul>
                    </div>
                  </div>
                </template>
                <template v-else>{{ employee.phone }}</template>
              </td>
              <td></td>
            </tr>
            <tr>
              <th>사원명</th>
              <td>{{ employee.employeeName }}</td>
              <th>직무</th>
              <td>{{ employee.jobRole }}</td>
              <th>이메일</th>
              <td style="position: relative">
                <template v-if="editMode">
                  <input
                    type="email"
                    v-model="form.email"
                    class="editable-input"
                    :class="{ 'invalid-row': !isValidEmail }"
                    @input="validateEmail"
                    @focus="showEmailModal"
                    @blur="hideEmailModal"
                  />
                  <div v-if="isEmailModalVisible" class="email-modal">
                    <div class="email-modal-content">
                      <h3>이메일 입력 형식</h3>
                      <ul>
                        <li>
                          유효한 이메일 주소를
                          <b style="color: #00509e">정확히</b> 입력해주세요.
                        </li>
                        <li>
                          <span
                            style="color: #999; text-decoration: line-through"
                            >example@domain</span
                          >
                          →
                          <span style="color: #333; font-weight: bold"
                            >example@domain.com</span
                          >
                        </li>
                      </ul>
                    </div>
                  </div>
                </template>
                <template v-else>{{ employee.email }}</template>
              </td>
              <td></td>
            </tr>
            <tr>
              <th>입사일</th>
              <td>{{ employee.hireDate }}</td>
              <th>직위</th>
              <td>{{ employee.position }}</td>
              <th>주소</th>
              <td>
                <template v-if="editMode">
                  <div class="address-input-group">
                    <!-- 주소 입력 필드 -->
                    <input
                      type="text"
                      v-model="form.address"
                      class="editable-input"
                      readonly
                      placeholder="주소를 검색하세요"
                    />
                    <button class="btn-address" @click="openAddressSearch">
                      주소 검색
                    </button>
                  </div>
                </template>
                <template v-else>{{ employee.address }} </template>
              </td>
              <td></td>
            </tr>
            <tr>
              <th>입사유형</th>
              <td>{{ employee.hireType }}</td>
              <th>직책</th>
              <td>{{ employee.jobTitle }}</td>
              <th>상세주소</th>
              <td>
                <template v-if="editMode">
                  <input
                    type="text"
                    v-model="form.detailAddress"
                    class="editable-input"
                  />
                </template>
                <template v-else>{{ employee.detailAddress }}</template>
              </td>
              <td></td>
            </tr>
            <tr>
              <th>생년월일</th>
              <td>{{ employee.birthDate }}</td>
              <th>퇴사일</th>
              <td>{{ employee.retirementDate || 'N/A' }}</td>
              <th></th>
              <td></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue';
import { getEmployeeDetailById, updateEmployeeInfo } from '@/api/emp_info'; // API 함수 가져오기
import LoadingOverlay from '@/components/common/LoadingOverlay.vue';

const loading = ref(false); // 로딩 상태
const editMode = ref(false); // 편집 가능 모드
const isPhoneModalVisible = ref(false); // 휴대폰 모달 표시 여부
const isEmailModalVisible = ref(false); // 이메일 모달 표시 여부
const hoverPhoto = ref(false);
const previewPhoto = ref(null);
// photoInput을 참조할 ref 선언
const photoInput = ref(null);

const employee = ref({
  employeeCode: '',
  gender: '',
  employeeName: '',
  birthDate: '',
  hireDate: '',
  retirementDate: '',
  hireType: '',
  jobTitle: '',
  jobRole: '',
  position: '',
  phone: '',
  email: '',
  address: '',
  detailAddress: '',
  photoUrl: '',
});

const form = ref({
  phone: '',
  email: '',
  address: '',
  detailAddress: '',
  photoFile: null,
});

const props = defineProps({
  employee_id: {
    type: String,
    required: false,
  },
});

// API에서 데이터 가져오는 함수
const fetchEmployeeData = async () => {
  try {
    // 로컬 스토리지에서 employeeId와 accessToken 가져오기
    const employeeId = props.employee_id || localStorage.getItem('employeeId');
    const token = localStorage.getItem('accessToken');

    if (!employeeId || !token) {
      throw new Error('유효한 employeeId나 accessToken이 없습니다.');
    }

    // API 호출
    const data = await getEmployeeDetailById(employeeId, token);

    // API 응답 데이터를 employee 객체에 반영
    employee.value = {
      employeeCode: data.employee_number,
      gender: data.gender === 'FEMALE' ? '여' : '남',
      employeeName: data.name,
      birthDate: data.birth_date,
      hireDate: data.join_date,
      retirementDate: data.resignation_date,
      hireType: data.join_type === 'ROOKIE' ? '신입' : '경력',
      jobTitle: data.duty_name,
      jobRole: data.role_name,
      position: data.position_name,
      phone: data.phone_number,
      email: data.email,
      address: data.street_address,
      detailAddress: data.detailed_address,
      photoUrl: data.profile_img_url,
    };
  } catch (error) {
    console.error('fetchEmployeeData 에러:', error);
  }
};

// 수정 후 데이터를 업데이트하고 다시 조회하는 함수
const updateEmployeeAndRefresh = async () => {
  try {
    loading.value = true; // 로딩 시작

    const employeeId = localStorage.getItem('employeeId');
    const token = localStorage.getItem('accessToken');

    // form 데이터를 FormData에 추가
    const formData = new FormData();
    formData.append('phone_number', form.value.phone || employee.value.phone);
    formData.append('email', form.value.email || employee.value.email);
    formData.append(
      'street_address',
      form.value.address || employee.value.address
    );
    formData.append(
      'detailed_address',
      form.value.detailAddress || employee.value.detailAddress
    );
    if (form.value.photoFile) {
      formData.append('profile_img', form.value.photoFile);
    }

    // 수정 요청
    await updateEmployeeInfo(employeeId, formData, token);

    // 수정 후 데이터 다시 조회
    await fetchEmployeeData();

    alert('수정이 완료되었습니다.');
  } catch (error) {
    console.error('수정 요청 중 에러 발생:', error);
    alert('수정 요청 중 문제가 발생했습니다.');
  } finally {
    loading.value = false; // 로딩 종료
  }
};

// 전화번호 유효성 검사
const isValidPhone = computed(() => {
  const phonePattern = /^010-\d{4}-\d{4}$/; // 유효한 전화번호 형식
  return phonePattern.test(form.value.phone);
});

// 전화번호 입력 처리 및 포맷팅
const formatPhone = (event) => {
  let input = event.target.value.replace(/[^0-9]/g, ''); // 숫자 이외 제거
  if (input.startsWith('010')) {
    if (input.length > 3 && input.length <= 7) {
      input = `${input.slice(0, 3)}-${input.slice(3)}`;
    } else if (input.length > 7) {
      input = `${input.slice(0, 3)}-${input.slice(3, 7)}-${input.slice(7, 11)}`;
    }
  }
  form.value.phone = input; // 업데이트된 포맷 저장
};

// 이메일 유효성 검사
const isValidEmail = computed(() => {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // 간단한 이메일 형식
  return emailPattern.test(form.value.email);
});

// 이메일 유효성 확인
const validateEmail = (event) => {
  const input = event.target.value.trim(); // 양쪽 공백 제거
  form.value.email = input;
};

const loadDaumPostcode = () => {
  return new Promise((resolve, reject) => {
    if (window.daum && window.daum.Postcode) {
      resolve(); // 이미 로드된 경우
      return;
    }

    const script = document.createElement('script');
    script.src =
      'https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js';
    script.onload = () => resolve();
    script.onerror = () => reject('카카오 주소 검색 API 로드 실패');
    document.body.appendChild(script);
  });
};

// 카카오 주소 검색 창 열기
const openAddressSearch = async () => {
  try {
    await loadDaumPostcode(); // 스크립트 로드
    new daum.Postcode({
      oncomplete: (data) => {
        form.value.address = data.address;
      },
    }).open();
  } catch (error) {
    console.error(error);
    alert('주소 검색 기능을 사용할 수 없습니다.');
  }
};

// 수정 모드 토글
const toggleEditMode = () => {
  if (editMode.value) {
    // 유효성 검사
    if (!isValidPhone.value) {
      alert('휴대폰 번호가 올바르지 않습니다.');
      return; // 수정 요청 중단
    }
    if (!isValidEmail.value) {
      alert('이메일 형식이 올바르지 않습니다.');
      return; // 수정 요청 중단
    }
    if (!form.value.address) {
      alert('주소를 입력해 주세요.');
      return; // 수정 요청 중단
    }

    // 모든 유효성 검사를 통과하면 수정 요청
    updateEmployeeAndRefresh(); // 수정 후 다시 데이터 조회
  } else {
    // 기존 데이터를 form에 복사
    form.value = {
      phone: employee.value.phone,
      email: employee.value.email,
      address: employee.value.address,
      detailAddress: employee.value.detailAddress,
      photoFile: null,
    };
  }
  editMode.value = !editMode.value; // 수정 모드 상태 변경
};

// 파일 선택 핸들링
const handlePhotoUpload = () => {
  if (!editMode.value) {
    return; // 수정 모드가 아니면 아무 작업도 하지 않음
  }
  if (photoInput.value) {
    photoInput.value.click();
  } else {
  }
};

const onPhotoChange = (event) => {
  const file = event.target.files[0];
  if (file) {
    form.value.photoFile = file;
    const reader = new FileReader();
    reader.onload = (e) => {
      previewPhoto.value = e.target.result;
    };
    reader.readAsDataURL(file);
  } else {
    console.warn('파일이 선택되지 않았습니다.');
  }
};

// 휴대폰 모달 제어
const showPhoneModal = () => {
  isPhoneModalVisible.value = true;
};

const hidePhoneModal = () => {
  isPhoneModalVisible.value = false;
};

// 이메일 모달 제어
const showEmailModal = () => {
  isEmailModalVisible.value = true;
};

const hideEmailModal = () => {
  isEmailModalVisible.value = false;
};

// 컴포넌트가 마운트될 때 데이터 조회
onMounted(() => {
  fetchEmployeeData();
});

watch(
  () => props.employee_id,
  (newVal) => {
    if (newVal) {
      fetchEmployeeData();
    }
  },
  { immediate: true }
);
</script>

<style scoped>
/* 로딩 오버레이 스타일 */
.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  color: white;
  font-size: 1.5rem;
  text-align: center;
}

.spinner {
  width: 50px;
  height: 50px;
  border: 6px solid rgba(255, 255, 255, 0.3);
  border-top: 6px solid white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

/* 로딩 애니메이션 */
@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.fa-spinner {
  animation: spin 1s linear infinite; /* 기본 Font Awesome 스타일 */
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

/* 로딩 오버레이 스타일 끝*/

.profile-wrapper {
  margin-top: 2.6rem;
  background-color: #fff;
  width: 96%;
  height: 27rem;
}

.profile-buttons-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.profile-label {
  width: 100%;
  height: 4rem;
  font-size: 2rem;
  font-weight: 700;
  color: #003566;
}

.profile-buttons {
  display: flex;
  gap: 1rem;
}

.profile-container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.profile-header {
  display: flex;
  gap: 1rem;
  align-items: flex-start;
}
.profile-photo-container {
  position: relative;
}

.profile-photo {
  width: 16rem; /* 사진 크기 조정 */
  height: 18rem;
  object-fit: cover;
}
.photo-edit-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgba(0, 0, 0, 0.5); /* 반투명 검정 배경 */
  color: #ffffff;
  border-radius: 4px; /* 이미지 모서리와 일치시키기 위해 둥글게 */
  font-size: 1.2rem;
  font-weight: bold;
  text-transform: uppercase; /* 텍스트를 대문자로 */
  transition: opacity 0.3s ease-in-out; /* 부드러운 나타남 효과 */
  opacity: 0; /* 기본적으로 숨김 */
  pointer-events: none; /* 클릭 이벤트 차단 */
}

.profile-photo-container:hover .photo-edit-overlay {
  opacity: 1; /* 호버 시 보이도록 설정 */
}

/* 주소 입력관련 css */
.address-input-group {
  align-items: center;
  width: 100%;
}

.btn-address {
  padding: 0.2rem 1.2rem;
  background-color: #003566;
  color: #fff;
  border: none;
  border-radius: 2px;
  cursor: pointer;
  font-size: 1rem;
  margin-top: 0.5rem;
}

.btn-address:hover {
  background-color: #00509e;
}

.editable-input {
  height: 2.2rem; /* 텍스트 높이와 동일하게 설정 */
  line-height: 2.4rem; /* 가운데 정렬 */
  font-size: 1.2rem; /* 기존 텍스트와 크기 일치 */
  background: #f5f5f5;
  border: 1px solid #ccc;
  border-radius: 2px;
  padding: 0; /* 입력창 내부 여백 제거 */
}

.employee-info-table {
  border-collapse: collapse; /* 셀 간 간격을 제거 */
  table-layout: fixed; /* 고정된 레이아웃 */
  width: 100%;
}

/* 테이블 스타일링 */
.employee-info-table {
  border-collapse: collapse; /* 셀 간격을 제거하고 경계선을 하나로 합침 */
  width: 100%;
}

/* 테이블 스타일링 */
.employee-info-table th,
.employee-info-table td {
  padding: 0.7rem 1.5rem; /* 테이블 셀 간격 조정 */
  font-size: 2rem; /* 기본 글씨 크기 설정 */
  font-weight: 500;
  line-height: 1.5; /* 행 높이 조정 */
  border-bottom: 1px solid #ddd; /* 가로선 추가 */
}

.employee-info-table th {
  text-align: right; /* 헤더 텍스트 오른쪽 정렬 */
  font-size: 1.4rem; /* 헤더 글씨 크기 */
  font-weight: bold; /* 헤더 글씨 굵기 */
}

.employee-info-table td {
  text-align: left; /* 데이터 텍스트 왼쪽 정렬 */
  font-size: 1.2rem; /* 데이터 글씨 크기 */
  color: #333; /* 데이터 텍스트 색상 */
}

.employee-info-table tr:last-child th,
.employee-info-table tr:last-child td {
  border-bottom: none; /* 마지막 행의 하단 경계선 제거 */
}

/* 유효하지않은경우의 css */
.invalid-row {
  background: #ffd8d8 !important;
  border: 2px solid red !important;
}

/* 버튼 스타일 */
.btn {
  height: 3.6rem;
  width: 10rem;
  background-color: #003566;
  color: #fff;
  border: none;
  border-radius: 0.6rem;
  cursor: pointer;
  font-size: 1.6rem;
}

/* 모달 스타일 */
.phone-modal,
.email-modal {
  position: absolute;
  top: calc(100% + 0.5rem); /* 입력창 바로 아래 */
  left: 0;
  background: white;
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 1rem;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
  z-index: 10;
  width: 200%;
  max-width: 300px;
}

.phone-modal-content,
.email-modal-content {
  font-size: 1.2rem;
  color: #333;
  word-break: keep-all; /* 텍스트 줄바꿈 방지 */
}

.phone-modal-content h3,
.email-modal-content h3 {
  font-size: 1.4rem;
  color: #003566;
  margin-bottom: 0.5rem;
}

.phone-modal-content ul,
.email-modal-content ul {
  list-style-type: disc;
  padding-left: 1.5rem;
  margin: 0;
}

.phone-modal-content li,
.email-modal-content li {
  margin-bottom: 0.5rem;
}

.btn-close:hover {
  background: #00509e;
}

.btn-close {
  padding: 0.5rem 1rem;
  background: #003566;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
}
.invalid-row {
  background: #ffd8d8 !important;
  border: 2px solid red !important;
}

.btn:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}
.btn-close:hover {
  background: #00509e;
}
</style>
