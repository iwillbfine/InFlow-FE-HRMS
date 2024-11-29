<template>
  <div class="profile-wrapper">
    <div class="profile-buttons-container">
      <span class="profile-label">인적사항</span>
      <div class="profile-buttons">
        <button @click="editProfile" class="btn">수정</button>
      </div>
    </div>
    <div class="profile-container">
      <div class="profile-header">
        <img :src="employee.photoUrl" alt="Profile Photo" class="profile-photo" />
        <table class="employee-info-table">
          <tr>
            <th>사원번호</th>
            <td>{{ employee.employeeCode }}</td>
            <th>성별</th>
            <td>{{ employee.gender }}</td>
            <th>생년월일</th>
            <td>{{ employee.birthDate }}</td>
          </tr>
          <tr>
            <th>사원명</th>
            <td>{{ employee.employeeName }}</td>
            <th>직무</th>
            <td>{{ employee.jobRole }}</td>
            <th>퇴사일</th>
            <td>{{ employee.retirementDate || 'N/A' }}</td>
          </tr>
          <tr>
            <th>입사일</th>
            <td>{{ employee.hireDate }}</td>
            <th>직위</th>
            <td>{{ employee.position }}</td>
            <th>주소</th>
            <td>{{ employee.address }}</td>
          </tr>
          <tr>
            <th>입사유형</th>
            <td>{{ employee.hireType }}</td>
            <th>직책</th>
            <td>{{ employee.jobTitle }}</td>
            <th></th>
            <td></td>
          </tr>
          <tr>
            <th>휴대폰번호</th>
            <td>{{ employee.phone }}</td>
            <th>이메일</th>
            <td>{{ employee.email }}</td>
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
import ResetPasswordModal from '@/components/modals/ResetPasswordModal.vue'; // 모달 컴포넌트 추가
import { getEmployeeDetailById } from '@/api/emp_info'; // API 함수 가져오기

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
  photoUrl: '',
});

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

    // API 응답 데이터를 employee 객체에 할당
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
      address: `${data.street_address} ${data.detailed_address}`,
      photoUrl: data.profile_img_url || 'https://via.placeholder.com/150',
    };
  } catch (error) {
    console.error('fetchEmployeeData 에러:', error);
  }
};

// 페이지 렌더링 시 데이터 로드
onMounted(() => {
  fetchEmployeeData();
});


const editProfile = () => {
  alert('프로필 수정 페이지로 이동하는 로직 구현');
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

.profile-photo {
  width: 12rem; /* 사진 크기 조정 */
  height: 15rem;
  object-fit: cover;
}


.employee-info-table {
  border-collapse: collapse; /* 셀 간 간격을 제거 */
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

