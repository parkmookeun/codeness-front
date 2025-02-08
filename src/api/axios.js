import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_SERVER_URL,
  withCredentials: true
});

// 요청 인터셉터
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('jwtToken');
    if (token) {
      // 모든 요청 헤더에 토큰 추가
      config.headers.Authorization = `Bearer ${token}`;  // 대문자로 통일
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 응답 인터셉터
api.interceptors.response.use(
  (response) => {
    // 대소문자 구분 없이 헤더 검색
    const newToken = response.headers['authorization'] || response.headers['Authorization'];
    if (newToken && newToken.startsWith('Bearer ')) {
      const token = newToken.substring(7);
      localStorage.setItem('jwtToken', token);
      // axios 기본 헤더도 업데이트
      api.defaults.headers.common.Authorization = `Bearer ${token}`;
    }
    return response;
  },
  async (error) => {
    if (error.response?.status === 401 && !error.config._retry) {
      error.config._retry = true;
      console.log("에러에 들어옴");
      const newToken = error.response.headers['authorization'] || error.response.headers['Authorization'];
      console.log("새 토큰은 ", newToken);
      if (newToken && newToken.startsWith('Bearer ')) {
        const token = newToken.substring(7);
        localStorage.setItem('jwtToken', token);
        api.defaults.headers.common.Authorization = `Bearer ${token}`;
        
        console.log('에러에서 나온 토큰: ', token);
        console.log('스토리지에 있는 토큰: ', localStorage.getItem('jwtToken'));

        // 완전히 새로운 요청 객체 생성
        return api({
          ...error.config,
          headers: {
            ...error.config.headers,
            Authorization: `Bearer ${token}`
          }
        });
      }
    }
    return Promise.reject(error);
  }
);

export default api;