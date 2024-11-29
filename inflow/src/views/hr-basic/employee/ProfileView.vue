<template>
  <div class="profile-wrapper">
    <div class="profile-buttons-container">
      <span class="profile-label">인적사항</span>
      <div class="profile-buttons">
        <button @click="resetPassword" class="btn">비밀번호 재설정</button>
        <button @click="editProfile" class="btn">수정</button>
      </div>
    </div>
    <div class="profile-container">
      <div class="profile-header">
        <img :src="employee.photoUrl" alt="Profile Photo" class="profile-photo" />
        <table class="employee-info-table">
          <tr>
            <th>사원코드</th>
            <td>{{ employee.employeeCode }}</td>
            <th>성별</th>
            <td>{{ employee.gender }}</td>
          </tr>
          <tr>
            <th>사원명</th>
            <td>{{ employee.employeeName }}</td>
            <th>생년월일</th>
            <td>{{ employee.birthDate }}</td>
          </tr>
          <tr>
            <th>입사일</th>
            <td>{{ employee.hireDate }}</td>
            <th>퇴사일</th>
            <td>{{ employee.retirementDate }}</td>
          </tr>
          <tr>
            <th>입사유형</th>
            <td>{{ employee.hireType }}</td>
            <th>직책</th>
            <td>{{ employee.jobTitle }}</td>
          </tr>
          <tr>
            <th>휴대폰번호</th>
            <td>{{ employee.phone }}</td>
            <th>이메일</th>
            <td>{{ employee.email }}</td>
          </tr>
          <tr>
            <th>주소</th>
            <td colspan="3">{{ employee.address }}</td>
          </tr>
        </table>
      </div>
    </div>
  </div>


</template>

<script setup>
import { ref } from 'vue';

const employee = ref({
  employeeCode: '22HR005',
  gender: '남',
  employeeName: '이진욱',
  birthDate: '1996-09-16',
  hireDate: '2022-02-28',
  retirementDate: '',
  hireType: '경력 입사',
  jobTitle: '과장',
  phone: '010-3248-0022',
  email: 'ejsaf@naver.com',
  address: '가나다구 아차차로 14길 21',
  photoUrl: 'https://via.placeholder.com/150', // 프로필 이미지 URL
});

const resetPassword = () => {
  alert('비밀번호 재설정 모달을 띄우는 로직 구현');
};

const editProfile = () => {
  alert('프로필 수정 페이지로 이동하는 로직 구현');
};
</script>

<style scoped>
.profile-wrapper {
  padding: 2rem;
  background-color: #fff;
  border-radius: 8px;
  width: 100%;
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
  gap: 2rem;
  align-items: flex-start;
}

.profile-photo {
  width: 150px;
  height: 150px;
  border-radius: 8px;
  object-fit: cover;
}

.employee-info-table {
  border-collapse: collapse;
  width: 100%;
}

.employee-info-table th,
.employee-info-table td {
  padding: 8px 12px;
  border: 1px solid #ddd;
}

.employee-info-table th {
  background-color: #f4f4f4;
  text-align: left;
}

.btn {
  padding: 0.5rem 1rem;
  background-color: #003566;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
}

.btn:hover {
  background-color: #00509e;
}
</style>
