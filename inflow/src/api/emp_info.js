// 사원 기본 관련 api 모음

import apiClient from '@/api/axios';  // Axios 설정이 적용된 apiClient 사용

// 설명. 1. 사원 ID로 사원 정보 조회하기
export const getEmployeeById = async (employeeId, token) => {
  try {
      const response = await apiClient.get(`/employees/id/${employeeId}`, {
          headers: {
              Authorization: `Bearer ${token}`, // Bearer 토큰 헤더 추가
          },
      });
      return response.data.content; // 사원 정보를 반환
  } catch (error) {
      console.error('getEmployeeById 에러:', error);
      throw error; // 에러를 호출한 쪽으로 전달
  }
};
