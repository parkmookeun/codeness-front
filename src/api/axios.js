import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_SERVER_URL,
  withCredentials: true
});

// 요청 인터셉터 추가
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('jwtToken');
    // 토큰이 있을 때만 헤더에 추가
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 기존 응답 인터셉터
api.interceptors.response.use(
  (response) => {
    console.log('성공 응답 헤더:', response.headers);
    const newToken = response.headers['authorization'];
    if (newToken && newToken.startsWith('Bearer ')) {
      const token = newToken.substring(7);
      console.log('저장될 새 토큰:', token);
      localStorage.setItem('jwtToken', token);
    }
    return response;
  },
  async (error) => {
    console.log('에러 응답:', error.response);
    console.log('에러 응답 헤더:', error.response?.headers);
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const newToken = error.response.headers['authorization'];
      console.log('401 에러에서 받은 새 토큰:', newToken);
      
      if (newToken && newToken.startsWith('Bearer ')) {
        const token = newToken.substring(7);
        console.log('401 에러에서 저장될 토큰:', token);
        localStorage.setItem('jwtToken', token);
        
        originalRequest.headers['Authorization'] = `Bearer ${token}`;
        return api(originalRequest);
      }
    }

    return Promise.reject(error);
  }
);

export default api;