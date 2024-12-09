<template>
  <div
    v-if="
      employeeCode &&
      typeof employeeCode === 'object' &&
      Object.keys(employeeCode).length > 0
    "
    class="container"
  >
    <div class="profile">
      <div class="profile-image">
        <img
          v-if="
            employeeCode.profile_img_url && employeeCode.profile_img_url.trim()
          "
          :src="employeeCode.profile_img_url"
          alt="profile-image"
        />
        <span v-else>이미지를 불러올 수 없습니다.</span>
        <!-- <img :src="employeeCode.profile_image_url" alt="profile-image">  -->
      </div>
      <div class="name-and-position">
        <span>{{ employeeCode.employee_name }}</span
        >/
        <span>{{ employeeCode.role_name }}</span>
        <!-- <span>{{ employeeCode }}</span> -->
      </div>
    </div>
    <div class="line"></div>
    <div class="profile-detail">
      <table class="info-table">
        <tbody>
          <tr>
            <td class="label">소속 부서</td>
            <td>{{ employeeCode.department_path }}</td>
          </tr>
          <tr>
            <td class="label">사내 메일</td>
            <td>{{ employeeCode.employee_email }}</td>
          </tr>
          <tr>
            <td class="label">휴대 번호</td>
            <td>{{ employeeCode.employee_phone_number }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
  <div v-else class="no-detail">
    <span> 사원 상세정보가 없습니다. </span>
  </div>
</template>

<script setup>
import { defineProps, watchEffect } from 'vue';

const props = defineProps({
  employeeCode: {
    type: Object,
    default: () => ({}), // 초기값 빈 객체
  },
});
</script>

<style scoped>
.container {
  background-color: white;
  box-shadow: 0px 0px 4px rgba(0, 0, 0, 0.25);
  border-radius: 3px;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.profile {
  width: 90%;
  font-size: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.profile-image {
  width: 50%;
  height: auto;
  margin-top: 50px;
  display: flex;
  justify-content: center;
}

.name-and-position {
  font-size: 2.1rem;
  margin-top: 10px;
  text-align: center;
  font-weight: bold;
}

.line {
  width: 90%;
  height: 1px;
  background-color: #cbcbcb;
  margin: 20px 0;
}

.profile-detail {
  width: 90%;
  display: flex;
  justify-content: center;
}

.info-table {
  width: 100%;
  border-collapse: collapse;
  border: 1px solid #003566;
  text-align: center;
}

.info-table td,
.info-table th {
  border: 1px solid #003566;
  padding: 8px;
  font-size: 14px;
}

.info-table .label {
  background-color: #003566;
  color: white;
  text-align: center;
  width: 30%;
}

.info-table tr:nth-child(2) .label,
.info-table tr:nth-child(3) .label {
  border-top: 1.5px solid white; /* 위쪽에 흰색 구분선 */
}

.no-detail {
  font-size: 1.5rem;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
