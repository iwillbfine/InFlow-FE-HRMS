import apiClient from "@/api/axios";

apiClient.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem('accessToken')}`

/* 1. 사원별 연월별 급여 명세서 조회 */
export const getPaymentByEmployeeIdAndYearAndMonth = async(eid, year, month) => {
  if (!eid || !year || !month) {
    throw new Error(`유효하지 않은 파라미터: eid=${eid}, year=${year}, month=${month}`);
  }
  try {
    const response = await apiClient.get(`/payrolls/details/${eid}`, {
      params: { year, month },
    });
    return response.data;
  } catch (error) {
    console.error('getPaymentByEmployeeIdAndYearAndMonth 에러: ', error);
    throw error;
  }
};
