import React, { useEffect } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import api from '../../api/axios';
import MentorRecommendation from './MentorRecommendation';
import MainNewsList from '../news/MainNews';
import CompanyInfo from './CompanyInfo';
import MainPosts from './MainPosts';

function Home() {
  const history = useHistory();
  const location = useLocation();

  useEffect(() => {
    // URL에서 토큰 파라미터 확인 (소셜 로그인 리다이렉트)
    const params = new URLSearchParams(location.search);
    const token = params.get("access_token"); // access_token으로 수정

    if (token) {
      // 토큰을 로컬 스토리지에 저장
      localStorage.setItem("jwtToken", token);

      // api의 기본 헤더에 토큰 설정
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      // 로그인 후 루트('/')로 리디렉션
      history.replace("/"); // 페이지를 루트로 리디렉션
    }

    // 로컬 스토리지에서 이미 저장된 토큰을 가져와 api 헤더 설정 (로그인 상태 유지)
    const savedToken = localStorage.getItem("jwtToken");
    if (savedToken) {
      api.defaults.headers.common["Authorization"] = `Bearer ${savedToken}`;
    }

  }, [location, history]); // 의존성 배열에 location, history 추가

  return (
      <div>
        <MentorRecommendation />
        <div style={{
          display: 'grid',
          gridTemplateColumns: '2fr 1fr',
          gap: '40px',
          width: '95%',
          margin: '0 auto',
          padding: '20px',
          minHeight: '400px'
        }}>
          <div style={{ width: '100%' }}>
            <MainNewsList />
            <div style={{ marginTop: '40px' }}>
              <MainPosts />
            </div>
          </div>
          <div style={{ width: '100%' }}>
            <CompanyInfo />
          </div>
        </div>
      </div>
  );
}

export default Home;
