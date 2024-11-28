import apiClient from '@/api/axios';  // Axios 설정이 적용된 apiClient 사용

// 1. 사원 ID와 날짜(yyyy-MM)로 월별 출퇴근 내역 조회
export const getCommutesByEmployeeId = async (eid, date) => {
  try {
    const response = await apiClient.get(`/commutes?eid=${eid}&date=${date}`);
    return response.data;
  } catch (error) {
    console.error('getCommutesByEmployeeId 에러:', error);
    throw error;
  }
};

// 2. 사원 ID로 재택근무 최근 신청 내역 조회
export const getRemoteRequestPreviewsByEmployeeId = async (eid) => {
  try {
    const response = await apiClient.get(`/attendance-requests/commute/remote/preview?eid=${eid}`);
    return response.data;
  } catch (error) {
    console.error('getRemoteRequestPreviewsByEmployeeId 에러:', error);
    throw error;
  }
};
