import apiClient from '@/api/axios';

// 1. 키워드로 사원 검색
export const getEmployeesByKeywordOrDepartmentCode = async (keyword) => {
  try {
    const response = await apiClient.get(`/departments/search/members?keyword=${keyword}`);
    return response.data;
  } catch (error) {
    console.error('getEmployeesByKeywordOrDepartmentCode 에러:', error);
    throw error;
  }
};
