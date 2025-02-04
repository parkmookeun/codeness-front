import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080',
  withCredentials: true
});

// 응답 인터셉터
api.interceptors.response.use(
  (response) => {
    console.log('성공 응답 헤더:', response.headers); // 디버깅
    const newToken = response.headers['authorization'];
    if (newToken && newToken.startsWith('Bearer ')) {
      const token = newToken.substring(7);
      console.log('저장될 새 토큰:', token); // 디버깅
      localStorage.setItem('jwtToken', token);
    }
    return response;
  },
  async (error) => {
    console.log('에러 응답:', error.response); // 디버깅
    console.log('에러 응답 헤더:', error.response?.headers); // 디버깅
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const newToken = error.response.headers['authorization'];
      console.log('401 에러에서 받은 새 토큰:', newToken); // 디버깅
      
      if (newToken && newToken.startsWith('Bearer ')) {
        const token = newToken.substring(7);
        console.log('401 에러에서 저장될 토큰:', token); // 디버깅
        localStorage.setItem('jwtToken', token);
        
        originalRequest.headers['Authorization'] = `Bearer ${token}`;
        return api(originalRequest);
      }
    }

    return Promise.reject(error);
  }
);

export default api;