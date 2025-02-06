import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import '../../styles/auth/SignUp.css'
import api from '../../api/axios';

const SignUp = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    nickname: '',
    phoneNumber: '',
    field: 'FRONTEND',  // FieldType 기본값
    userRole: 'MENTEE'   // UserRole 기본값
  });

  const [errors, setErrors] = useState({});
  const history = useHistory();

  // 이메일 유효성 검사
  const validateEmail = (email) => {
    const regex = /^(?:\w+\.?)*\w+@(?:\w+\.)+\w+$/;
    return regex.test(email);
  };

  // 비밀번호 유효성 검사
  const validatePassword = (password) => {
    const regex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return regex.test(password);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // 실시간 유효성 검사
    const newErrors = { ...errors };

    switch(name) {
      case 'email':
        if (!validateEmail(value)) {
          newErrors.email = '이메일 형식이 올바르지 않습니다.';
        } else {
          delete newErrors.email;
        }
        break;
      case 'password':
        if (!validatePassword(value)) {
          newErrors.password = '비밀번호는 최소 8글자 이상이며, 영문, 숫자, 특수문자를 1개씩 포함해야합니다.';
        } else {
          delete newErrors.password;
        }
        break;
      case 'name':
        if (!value) {
          newErrors.name = '이름은 필수 입력값입니다.';
        } else {
          delete newErrors.name;
        }
        break;
      default:
        break;
    }

    setErrors(newErrors);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 최종 유효성 검사
    const newErrors = {};
    if (!validateEmail(formData.email)) newErrors.email = '이메일 형식이 올바르지 않습니다.';
    if (!validatePassword(formData.password)) newErrors.password = '비밀번호 형식이 올바르지 않습니다.';
    if (!formData.name) newErrors.name = '이름은 필수 입력값입니다.';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      await api.post('/signup', formData);
      alert('회원가입이 완료되었습니다.');
      history.push('/login');
    } catch (error) {
      console.error('회원가입 에러:', error);
      if (error.response?.data?.message) {
        alert(error.response.data.message);
      } else {
        alert('회원가입 중 오류가 발생했습니다.');
      }
    }
  };

  return (
      <div className="signup-container">
        <h2>회원가입</h2>
        <form onSubmit={handleSubmit} className="signup-form">
          <div className="signup-form-group">
            <label>이메일:</label>
            <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                maxLength={30}
            />
            {errors.email && <span className="error-message">{errors.email}</span>}
          </div>

          <div className="signup-form-group">
            <label>비밀번호:</label>
            <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                maxLength={30}
            />
            {errors.password && <span className="error-message">{errors.password}</span>}
          </div>

          <div className="signup-form-group">
            <label>이름:</label>
            <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                maxLength={30}
            />
            {errors.name && <span className="error-message">{errors.name}</span>}
          </div>

          <div className="signup-form-group">
            <label>닉네임:</label>
            <input
                type="text"
                name="nickname"
                value={formData.nickname}
                onChange={handleChange}
                maxLength={30}
            />
          </div>

          <div className="signup-form-group">
            <label>전화번호:</label>
            <input
                type="text"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                maxLength={30}
            />
          </div>

          <div className="signup-form-group">
            <label>분야:</label>
            <select name="field" value={formData.field} onChange={handleChange}>
              <option value="FRONTEND">프론트엔드</option>
              <option value="BACKEND">백엔드</option>
            </select>
          </div>

          <button type="submit" className="signup-button">회원가입</button>
        </form>
      </div>
  );
};

export default SignUp;