import apiClient from '@/api/axios'; // Axios 설정이 적용된 apiClient 사용

// 1. 휴가 신청
export const createVacationRequest = async (formData) => {
  try {
    const response = await apiClient.post(`/vacation-requests`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('createVacationRequest 에러:', error);
    throw error;
  }
};

// 2. 사원 ID로 휴가 최근 신청 내역 조회
export const getVacationRequestPreviewsByEmployeeId = async (eid) => {
  try {
    const response = await apiClient.get(
      `/vacation-requests/preview?eid=${eid}`
    );
    return response.data;
  } catch (error) {
    console.error('getVacationRequestPreviewsByEmployeeId 에러:', error);
    throw error;
  }
};

// 3. 사원 ID, 페이지번호, 날짜(yyyy-MM)로 휴가 전체 신청 내역 페이지별 조회
export const getVacationRequestsByEmployeeId = async (eid, page, date) => {
  try {
    const response = await apiClient.get(
      `/vacation-requests?eid=${eid}&page=${page}&date=${date}`
    );
    return response.data;
  } catch (error) {
    console.error('getVacationRequestsByEmployeeId 에러:', error);
    throw error;
  }
};

// 4. 휴가 정책 등록
export const createVacationPolicy = async (formData) => {
  try {
    const response = await apiClient.post(`/vacation-policies`, formData);
    return response.data;
  } catch (error) {
    console.error('createVacationPolicy 에러:', error);
    throw error;
  }
};

// 5. 휴가 정책 수정
export const updateVacationPolicy = async (id, formData) => {
  try {
    const response = await apiClient.put(`/vacation-policies/${id}`, formData);
    return response.data;
  } catch (error) {
    console.error('updateVacationPolicy 에러:', error);
    throw error;
  }
};

// 6. 연도별 휴가 정책 조회
export const getVacationPoliciesByYear = async (year) => {
  try {
    const response = await apiClient.get(`/vacation-policies?year=${year}`);
    return response.data;
  } catch (error) {
    console.error('getVacationPoliciesByYear 에러:', error);
    throw error;
  }
};

// 7. 연도별 비정기 휴가 정책 조회
export const getIrregularVacationPoliciesByYear = async (year) => {
  try {
    const response = await apiClient.get(
      `/vacation-policies/irregular?year=${year}`
    );
    return response.data;
  } catch (error) {
    console.error('getIrregularVacationPoliciesByYear 에러:', error);
    throw error;
  }
};

// 8. 휴가 종류 조회
export const getVacationTypes = async () => {
  try {
    const response = await apiClient.get(`/vacation-types`);
    return response.data;
  } catch (error) {
    console.error('getVacationTypes 에러:', error);
    throw error;
  }
};

// 9. 휴가 지급
export const createVacation = async (formData) => {
  try {
    const response = await apiClient.post(`/vacations`, formData);
    return response.data;
  } catch (error) {
    console.error('createVacation 에러:', error);
    throw error;
  }
};

// 10. 사원별 잔여 휴가 조회
export const getLeftVacationsByEmployeeId = async (eid, page) => {
  try {
    const response = await apiClient.get(
      `/vacations/left?eid=${eid}&page=${page}`
    );
    return response.data;
  } catch (error) {
    console.error('getLeftVacationsByEmployeeId 에러:', error);
    throw error;
  }
};

// 11. 사원별 사용 휴가 조회
export const getUsedVacationsByEmployeeId = async (eid, page) => {
  try {
    const response = await apiClient.get(
      `/vacations/used?eid=${eid}&page=${page}`
    );
    return response.data;
  } catch (error) {
    console.error('getUsedVacationsByEmployeeId 에러:', error);
    throw error;
  }
};

// 12. 사원별 잔여 휴가 전체 조회
export const getLeftAllVacationsByEmployeeId = async (eid) => {
  try {
    const response = await apiClient.get(`/vacations/left-all?eid=${eid}`);
    return response.data;
  } catch (error) {
    console.error('getLeftAllVacationsByEmployeeId 에러:', error);
    throw error;
  }
};

// 13. 휴가 신청 취소
export const cancelVacationRequest = async (id, formData) => {
  try {
    const response = await apiClient.patch(
      `/vacation-requests/${id}`,
      formData
    );
    return response.data;
  } catch (error) {
    console.error('createVacation 에러:', error);
    throw error;
  }
};
