import React, { useState } from 'react';
import api from '../../../api/axios';
import { useHistory } from 'react-router-dom';
import '../../../styles/mypage/delete-user/DeleteUser.css'

const UserDeletePage = () => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const history = useHistory();

  const handleDelete = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('jwtToken');

    try {
      const response = await api.delete('/users', {
        headers: {
          Authorization: `Bearer ${token}`
        },
        data: { password }
      });

      if (response.data) {
        localStorage.removeItem('jwtToken');
        alert('회원 탈퇴가 완료되었습니다.');
        history.push('/');
      }
    } catch (err) {
      setError(err.response?.data?.msg || '회원 탈퇴 중 오류가 발생했습니다.');
    }
  };

  return (
      <div className="user-delete-container">
        <h2>회원 탈퇴</h2>
        <form onSubmit={handleDelete}>
          <div>
            <label>비밀번호 확인</label>
            <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
            />
          </div>
          {error && <p style={{color: 'red'}}>{error}</p>}
          <button type="submit">회원 탈퇴</button>
        </form>
      </div>
  );
};

export default UserDeletePage;