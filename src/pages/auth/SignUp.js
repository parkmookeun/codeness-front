import React, { useState } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';

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
      await axios.post('https://api.codeness.kr/signup', formData);
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
      <div>
        <h2>회원가입</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label>이메일:</label>
            <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                maxLength={30}
            />
            {errors.email && <span>{errors.email}</span>}
          </div>

          <div>
            <label>비밀번호:</label>
            <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                maxLength={30}
            />
            {errors.password && <span>{errors.password}</span>}
          </div>

          <div>
            <label>이름:</label>
            <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                maxLength={30}
            />
            {errors.name && <span>{errors.name}</span>}
          </div>

          <div>
            <label>닉네임:</label>
            <input
                type="text"
                name="nickname"
                value={formData.nickname}
                onChange={handleChange}
                maxLength={30}
            />
          </div>

          <div>
            <label>전화번호:</label>
            <input
                type="text"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                maxLength={30}
            />
          </div>

          <div>
            <label>분야:</label>
            <select name="field" value={formData.field} onChange={handleChange}>
              <option value="FRONTEND">프론트엔드</option>
              <option value="BACKEND">백엔드</option>
            </select>
          </div>

          <button type="submit">회원가입</button>
        </form>
      </div>
  );
};

export default SignUp;