import axios from 'axios';

// Axios 인스턴스 생성
const apiClient = axios.create({
  baseURL: 'http://localhost:5000/api', // API 기본 경로
});

// 요청 인터셉터: 모든 요청에 Authorization 헤더 추가
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');

    // 액세스 토큰이 있는 경우 Authorization 헤더에 추가
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 응답 인터셉터: 401 오류 시 리프레시 토큰으로 재발급 처리
apiClient.interceptors.response.use(
  (response) => response, // 응답이 성공적인 경우 그대로 반환
  async (error) => {
    const originalRequest = error.config;

    // 401 Unauthorized 에러 처리
    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true; // 무한 루프 방지

      try {
        const refreshToken = localStorage.getItem('refreshToken');

        if (!refreshToken) {
          console.error('리프레시 토큰이 없습니다.');
          return Promise.reject(error);
        }

        // 리프레시 토큰으로 새로운 액세스 토큰 요청
        const { data } = await axios.post(
          'http://localhost:5000/api/auth/refresh-token',
          { refresh_token: refreshToken }, // JSON 형식으로 데이터 전달
          {
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );

        const { access_token: newAccessToken, refresh_token: newRefreshToken } =
          data.content;

        // 새로운 토큰 저장
        if (newAccessToken) {
          localStorage.setItem('accessToken', newAccessToken);
        }
        if (newRefreshToken) {
          localStorage.setItem('refreshToken', newRefreshToken);
        }

        // 원래 요청을 새로운 액세스 토큰으로 재시도
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return apiClient(originalRequest); // 재요청
      } catch (refreshError) {
        console.error('리프레시 토큰 요청 실패:', refreshError);
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error); // 다른 오류는 그대로 반환
  }
);

export default apiClient;
