<template>
  <div class="profile-wrapper">
    <div class="profile-buttons-container">
      <span class="profile-label">인적사항</span>
      <div class="profile-buttons">
   <button @click="toggleEditMode" class="btn">{{ editMode ? '수정요청' : '수정' }}</button>
      </div>
    </div>
    <div class="profile-container">
      <div class="profile-header">
         <!-- 프로필 사진 -->
         <div class="profile-photo-container" @mouseover="hoverPhoto = true" @mouseleave="hoverPhoto = false">
            <img
            :src="previewPhoto || employee.photoUrl"
            alt="Profile Photo"
            class="profile-photo"
            @click="handlePhotoUpload"
            />
            <div v-if="hoverPhoto && editMode" class="photo-edit-overlay">사진 수정</div>
            <input
              ref="photoInput"
              type="file"
              accept="image/*"
              style="display: none"
              @change="onPhotoChange"
            />
        </div>
        <table class="employee-info-table">
          <tr>
            <th>사원번호</th>
            <td>{{ employee.employeeCode }}</td>
            <th>성별</th>
            <td>{{ employee.gender }}</td>
            <th>휴대폰번호</th>
            <td>
              <template v-if="editMode">
                <input type="text" v-model="form.phone" class="editable-input" />
              </template>
              <template v-else>{{ employee.phone }}</template>
            </td>
          </tr>
          <tr>
            <th>사원명</th>
            <td>{{ employee.employeeName }}</td>
            <th>직무</th>
            <td>{{ employee.jobRole }}</td>
            <th>이메일</th>
            <td>
              <template v-if="editMode">
                <input type="email" v-model="form.email" class="editable-input" />
              </template>
              <template v-else>{{ employee.email }}</template>
            </td>
          </tr>
          <tr>
            <th>입사일</th>
            <td>{{ employee.hireDate }}</td>
            <th>직위</th>
            <td>{{ employee.position }}</td>
            <th>주소</th>
            <td>
              <template v-if="editMode">
                <input type="text" v-model="form.address" class="editable-input" />
              </template>
              <template v-else>{{ employee.address }}</template>
            </td>
          </tr>
          <tr>
            <th>입사유형</th>
            <td>{{ employee.hireType }}</td>
            <th>직책</th>
            <td>{{ employee.jobTitle }}</td>
            <th>상세주소</th>
            <td>
              <template v-if="editMode">
                <input type="text" v-model="form.detailAddress" class="editable-input" />
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
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { getEmployeeDetailById, updateEmployeeInfo } from '@/api/emp_info'; // API 함수 가져오기

const editMode = ref(false);
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

// API에서 데이터 가져오는 함수
const fetchEmployeeData = async () => {
  try {
    // 로컬 스토리지에서 employeeId와 accessToken 가져오기
    const employeeId = localStorage.getItem('employeeId');
    const token = localStorage.getItem('accessToken');

    if (!employeeId || !token) {
      throw new Error('유효한 employeeId나 accessToken이 없습니다.');
    }

    // API 호출
    const data = await getEmployeeDetailById(employeeId, token);
    console.log("API에서 가져온 데이터:", data);

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
    const employeeId = localStorage.getItem('employeeId');
    const token = localStorage.getItem('accessToken');

    // form 데이터를 FormData에 추가
    const formData = new FormData();
    formData.append('phone_number', form.value.phone || employee.value.phone);
    formData.append('email', form.value.email || employee.value.email);
    formData.append('street_address', form.value.address || employee.value.address);
    formData.append('detailed_address', form.value.detailAddress || employee.value.detailAddress);
    if (form.value.photoFile) {
      formData.append('profile_img', form.value.photoFile);
    }

    // 수정 요청
    await updateEmployeeInfo(employeeId, formData, token);
    console.log("수정 요청 완료. 데이터 다시 조회 중...");

    // 수정 후 데이터 다시 조회
    await fetchEmployeeData();

    alert('수정이 완료되었습니다.');
  } catch (error) {
    console.error('수정 요청 중 에러 발생:', error);
    alert('수정 요청 중 문제가 발생했습니다.');
  }
};

// 컴포넌트가 마운트될 때 데이터 조회
onMounted(() => {
  console.log('photoInput 초기화 상태:', photoInput.value);
  fetchEmployeeData();
});

// 수정 모드 토글
const toggleEditMode = () => {
  if (editMode.value) {
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
  console.log('handlePhotoUpload 호출됨');
  if (photoInput.value) {
    photoInput.value.click();
    console.log('photoInput 클릭 실행됨');
  } else {
    console.error('photoInput 참조가 유효하지 않습니다.');
  }
};

const onPhotoChange = (event) => {
  console.log('파일 탐색기 열림');
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

</script>


<style scoped>
.profile-wrapper {
  padding: 2rem;
  background-color: #fff;
  border-radius: 8px;
  width: 95%;
  height: 100%;
}

.profile-buttons-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.profile-label {
  font-size: 1.7rem;
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
  width: 12rem; /* 사진 크기 조정 */
  height: 15rem;
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
  background: rgba(0, 0, 0, 0.6); /* 투명도 살짝 증가 */
  color: #ffffff;
  border-radius: 8px; /* 이미지 모서리와 일치시키기 위해 둥글게 */
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

/* 테이블 스타일링 */.employee-info-table {
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

/* 버튼 스타일 */
.btn {
  padding: 0.2rem 2rem;
  background-color: #003566;
  color: #fff;
  border: none;
  border-radius: 2px;
  cursor: pointer;
  font-size: 1.2rem;
}

.btn:hover {
  background-color: #00509e;
}

</style>

