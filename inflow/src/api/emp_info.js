// 사원 기본 관련 api 모음 파일

import apiClient from '@/api/axios';  // Axios 설정이 적용된 apiClient 사용

// 설명. 1. 이메일 전송 API (회원가입 시 실행)
export const sendSignupVerificationEmail = async (email) => {
  try {
    const response = await apiClient.post('/users/verification-email/signup', { email });
    return response.data;
  } catch (error) {
    console.error('sendSignupVerificationEmail 에러:', error);
    throw error;
  }
};
