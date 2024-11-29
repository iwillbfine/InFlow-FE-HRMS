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

// 2. 재택근무 신청
export const createRemoteRequest = async (formData) => {
  try {
    const response = await apiClient.post(`/attendance-requests/commute/remote`, formData);
    return response.data;
  } catch (error) {
    console.error('createRemoteRequest 에러:', error);
    throw error;
  }
};

// 3. 사원 ID로 재택근무 최근 신청 내역 조회
export const getRemoteRequestPreviewsByEmployeeId = async (eid) => {
  try {
    const response = await apiClient.get(`/attendance-requests/commute/remote/preview?eid=${eid}`);
    return response.data;
  } catch (error) {
    console.error('getRemoteRequestPreviewsByEmployeeId 에러:', error);
    throw error;
  }
};

// 4. 사원 ID, 페이지번호, 날짜(yyyy-MM)로 재택근무 전체 신청 내역 페이지별 조회
export const getRemoteRequestsByEmployeeId = async (eid, page, date) => {
  try {
    const response = await apiClient.get(`/attendance-requests/commute/remote?eid=${eid}&page=${page}&date=${date}`);
    return response.data;
  } catch (error) {
    console.error('getRemoteRequestsByEmployeeId 에러:', error);
    throw error;
  }
};

// 5. 초과근무 신청
export const createOvertimeRequest = async (formData) => {
  try {
    const response = await apiClient.post(`/attendance-requests/commute/overtime`, formData);
    return response.data;
  } catch (error) {
    console.error('createOvertimeRequest 에러:', error);
    throw error;
  }
};

// 6. 사원 ID로 초과근무 최근 신청 내역 조회
export const getOvertimeRequestPreviewsByEmployeeId = async (eid) => {
  try {
    const response = await apiClient.get(`/attendance-requests/commute/overtime/preview?eid=${eid}`);
    return response.data;
  } catch (error) {
    console.error('getOvertimeRequestPreviewsByEmployeeId 에러:', error);
    throw error;
  }
};

// 7. 사원 ID, 페이지번호, 날짜(yyyy-MM)로 초과근무 전체 신청 내역 페이지별 조회
export const getOvertimeRequestsByEmployeeId = async (eid, page, date) => {
  try {
    const response = await apiClient.get(`/attendance-requests/commute/overtime?eid=${eid}&page=${page}&date=${date}`);
    return response.data;
  } catch (error) {
    console.error('getOvertimeRequestsByEmployeeId 에러:', error);
    throw error;
  }
};
