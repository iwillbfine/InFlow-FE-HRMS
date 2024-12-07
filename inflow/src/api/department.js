import apiClient from '@/api/axios';

// 1. 사원 전체 조회(검색)
export const getAllDepartmentMembers = async () => {
  try {
    const response = await apiClient.get(`/departments/search/all-members`);
    return response.data;
  } catch (error) {
    console.error('getAllDepartmentMembers 에러:', error);
    throw error;
  }
};

// 2. 키워드로 사원 검색
export const getEmployeesByKeywordOrDepartmentCode = async (keyword) => {
  try {
    const response = await apiClient.get(
      `/departments/search/members?keyword=${keyword}`
    );
    return response.data;
  } catch (error) {
    console.error('getEmployeesByKeywordOrDepartmentCode 에러:', error);
    throw error;
  }
};

// 3. 부서 구성원 조회(일반)
export const getEmployeesByDepartmentCode = async (dcode) => {
  try {
    const response = await apiClient.get(
      `/departments/search/members?departmentCode=${dcode}`
    );
    return response.data;
  } catch (error) {
    console.error('getEmployeesByDepartmentCode 에러:', error);
    throw error;
  }
};

// 4. 부서 구성원 조회(팀장)
export const getMyDepartmentMemberListByDepartmentCode = async (
  departmentCode
) => {
  try {
    const response = await apiClient.get(
      `/departments/my-department/${departmentCode}/members`
    );
    return response.data;
  } catch (error) {
    console.error('getMyDepartmentMemberListByDepartmentCode 에러:', error);
    throw error;
  }
};
