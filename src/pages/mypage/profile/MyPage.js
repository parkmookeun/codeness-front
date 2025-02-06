import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import '../../../styles/mypage/profile/MyPage.css'
import placeholder from '../../../assets/icons/profile-placeholder.png'
import api from '../../../api/axios';

const MyPage = () => {
  const [userData, setUserData] = useState(null);
  const history = useHistory();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('jwtToken');
        const response = await api.get('/users', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        setUserData(response.data.data);
      } catch (error) {
        console.error('마이페이지 데이터 가져오기 실패:', error);
      }
    };
    fetchUserData();
  }, []);

  if (!userData) {
    return <div>Loading...</div>;
  }

  const handleUpdateUserInfo = () => {
    history.push('/user/update');
  };

  return (
      <div className="my-page-container">
        <h1>마이페이지</h1>

        <div className="profile-section">
          <img src={userData.profileImageLink} alt="프로필 이미지" className="profile-image" />
          <div className="profile-info">
            <h2>{userData.name}</h2>
            <p>닉네임: {userData.userNickname}</p>
            <p>이메일: {userData.email}</p>
            <p>전화번호: {userData.phoneNumber}</p>
            <p>지역: {userData.region}</p>
          </div>
        </div>

        <div className="details-section">
          <h2>개발 정보</h2>
          <p>분야: {userData.field}</p>
          <p>경력: {userData.career}년</p>
          <p>MBTI: {userData.mbti}</p>
          <p>사이트 링크: <a href={userData.siteLink}>{userData.siteLink}</a></p>
        </div>

        <div className="update-button-container">
          <button className="update-button" onClick={handleUpdateUserInfo}>
            정보 수정
          </button>
        </div>
      </div>
  );
};

export default MyPage;