import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import api from '../../../api/axios';
import { jwtDecode } from 'jwt-decode';
import '../../../styles/mypage/profile/UserUpdate.css'

const UserUpdate = () => {
  const history = useHistory();
  const [formData, setFormData] = useState({
    nickname: '',
    phoneNumber: '',
    region: '',
    field: 'FRONTEND',
    career: '',
    mbti: '',
    siteLink: '',
  });
  const [profileImage, setProfileImage] = useState(null);
  const [provider, setProvider] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('jwtToken');
      if (!token) {
        throw new Error('토큰이 없습니다.');
      }

      const decoded = jwtDecode(token);
      setProvider(decoded.provider);

      const response = await api.get('/users', {
        headers: { Authorization: `Bearer ${token}` }
      });

      const data = response.data.data;
      console.log('Fetched user data:', data);

      setFormData({
        nickname: data.nickname || '',
        phoneNumber: data.phoneNumber || '',
        region: data.region || '',
        field: data.field || 'FRONTEND',
        career: data.career?.toString() || '',
        mbti: data.mbti || '',
        siteLink: data.siteLink || '',
      });

      setLoading(false);
    } catch (error) {
      console.error('Error fetching user data:', error);
      setError(error.message);
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    setProfileImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('jwtToken');

    const formDataToSend = new FormData();

    // 기존 폼 데이터 추가
    formDataToSend.append('nickname', formData.nickname);
    formDataToSend.append('phoneNumber', formData.phoneNumber);
    formDataToSend.append('region', formData.region);
    formDataToSend.append('field', formData.field);
    formDataToSend.append('career', formData.career);
    formDataToSend.append('mbti', formData.mbti);
    formDataToSend.append('siteLink', formData.siteLink);

    // 프로필 이미지 추가
    if (profileImage) {
      formDataToSend.append('multipartFile', profileImage);
    }

    try {
      const response = await api.patch('/users', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        }
      });

      alert('사용자 정보가 성공적으로 업데이트되었습니다.');
      history.push('/mypage');
    } catch (error) {
      console.error('Error updating user:', error);
      alert('사용자 정보 업데이트 중 오류가 발생했습니다.');
    }
  };

  if (loading) return <div className="loading-container">로딩 중...</div>;
  if (error) return <div className="error-container">오류: {error}</div>;

  return (
      <div className="user-update-container">
        <h2>프로필 수정</h2>
        <form onSubmit={handleSubmit} className="user-update-form">

          <div className="user-update-form-group">
            <label htmlFor="nickname">닉네임</label>
            <input
                type="text"
                id="nickname"
                name="nickname"
                value={formData.nickname}
                onChange={handleChange}
                placeholder="닉네임을 입력하세요"
            />
          </div>
          <div className="user-update-form-group">
            <label htmlFor="phoneNumber">전화번호</label>
            <input
                type="text"
                id="phoneNumber"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                placeholder="전화번호를 입력하세요"
            />
          </div>
          <div className="user-update-form-group">
            <label htmlFor="region">지역</label>
            <input
                type="text"
                id="region"
                name="region"
                value={formData.region}
                onChange={handleChange}
                placeholder="지역을 입력하세요"
            />
          </div>
          <div className="user-update-form-group">
            <label htmlFor="field">분야</label>
            <select
                id="field"
                name="field"
                value={formData.field}
                onChange={handleChange}
            >
              <option value="FRONTEND">프론트엔드</option>
              <option value="BACKEND">백엔드</option>
            </select>
          </div>
          <div className="user-update-form-group">
            <label htmlFor="career">경력</label>
            <input
                type="number"
                id="career"
                name="career"
                value={formData.career}
                onChange={handleChange}
                placeholder="경력을 입력하세요"
            />
          </div>
          <div className="user-update-form-group">
            <label htmlFor="mbti">MBTI</label>
            <input
                type="text"
                id="mbti"
                name="mbti"
                value={formData.mbti}
                onChange={handleChange}
                placeholder="MBTI를 입력하세요"
            />
          </div>
          <div className="user-update-form-group">
            <label htmlFor="siteLink">사이트 링크</label>
            <input
                type="text"
                id="siteLink"
                name="siteLink"
                value={formData.siteLink}
                onChange={handleChange}
                placeholder="사이트 링크를 입력하세요"
            />
          </div>
          <div className="user-update-form-group">
            <label htmlFor="profileImage">프로필 이미지</label>
            <input
                type="file"
                id="profileImage"
                onChange={handleImageChange}
                accept="image/*"
            />
          </div>
          <div className="user-update-button-group">
            <button
                type="button"
                className="btn-secondary"
                onClick={() => history.push('/password-update')}
            >
              비밀번호 변경
            </button>
            <button
                type="submit"
                className="btn-primary"
            >
              정보 수정
            </button>
          </div>
        </form>
      </div>
  );
};

export default UserUpdate;