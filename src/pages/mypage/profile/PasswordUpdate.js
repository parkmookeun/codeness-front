import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import api from '../../../api/axios';
import '../../../styles/mypage/profile/PasswordUpdate.css'

const PasswordUpdate = () => {
  const history = useHistory();
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: ''
  });
  const [error, setError] = useState('');

  // 토큰 검증
  useEffect(() => {
    const token = localStorage.getItem('jwtToken');
    if (!token) {
      history.push('/login');
    }
  }, [history]);

  const validateToken = (token) => {
    if (!token) return false;
    try {
      const parts = token.split('.');
      if (parts.length !== 3) return false;
      const payload = JSON.parse(atob(parts[1]));
      return !(payload.exp && payload.exp < Date.now() / 1000);
    } catch {
      return false;
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('jwtToken');

    if (!validateToken(token)) {
      localStorage.removeItem('jwtToken');
      history.push('/login');
      return;
    }

    try {
      await api.patch('/users/password', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('비밀번호가 성공적으로 변경되었습니다.');
      history.push('/profile');
    } catch (error) {
      if (error.response?.status === 401) {
        localStorage.removeItem('jwtToken');
        history.push('/login');
      } else {
        setError('비밀번호 변경에 실패했습니다.');
      }
    }
  };

  return (
      <div className="password-update-container">
        <h2>비밀번호 변경</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>현재 비밀번호</label>
            <input
                type="password"
                name="currentPassword"
                value={formData.currentPassword}
                onChange={handleChange}
                required
            />
          </div>
          <div className="form-group">
            <label>새 비밀번호</label>
            <input
                type="password"
                name="newPassword"
                value={formData.newPassword}
                onChange={handleChange}
                required
                pattern="^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$"
                title="비밀번호는 최소 8글자 이상이며, 영문, 숫자, 특수문자를 1개씩 포함해야합니다."
            />
          </div>
          {error && <div className="error-message">{error}</div>}
          <button type="submit">비밀번호 변경</button>
        </form>
      </div>
  );
};

export default PasswordUpdate;