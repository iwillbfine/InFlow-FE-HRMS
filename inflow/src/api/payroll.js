import apiClient from "@/api/axios";

/* 1. 사원별 연월별 급여 명세서 조회 */
export const getPaymentByEmployeeIdAndYearAndMonth = async(eid, year, month) => {
  try {
    const response = await apiClient.get(`/payrolls/detail/${eid}?year=${year}&month=${month}`);
    return response.data;
  } catch (error) {
    console.error('getPaymentByEmployeeIdAndYearAndMonth 에러: ', error);
    throw error;
  }
};
