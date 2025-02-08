import React, { useState } from "react";
import { useHistory } from "react-router-dom"; // useHistory는 함수형 컴포넌트 내에서만 호출해야 합니다.
import api from '../../api/axios';

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const history = useHistory();

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const response = await api.post(
          "/login",
          {
            email,
            password,
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
            withCredentials: true, // CORS 요청에 credential 포함
          }
      );

      // 응답 헤더에서 토큰 추출 (서버 응답 방식에 따라 조정 필요)
      const token = response.headers["authorization"] || response.data.data;

      if (token) {
        // 토큰 저장 키를 'jwtToken'으로 통일
        localStorage.setItem("jwtToken", token);
        // Bearer 접두사 포함하여 axios 기본 헤더 설정
        setMessage("로그인 성공!");
        history.push("/");
      } else {
        setMessage("로그인 실패: 토큰을 받지 못했습니다.");
      }
    } catch (error) {
      console.error("Login error:", error);
      if (error.response) {
        // 서버에서 보낸 에러 메시지 표시
        const errorMessage =
            error.response.data?.message || error.response.data;
        setMessage(`로그인 실패: ${errorMessage}`);
      } else if (error.request) {
        // 요청은 보냈으나 응답을 받지 못한 경우
        setMessage("로그인 실패: 서버 응답이 없습니다.");
      } else {
        // 요청 설정 중 에러 발생
        setMessage("로그인 실패: " + error.message);
      }
    }
  };

  // 구글 로그인 핸들러
  const handleGoogleLogin = () => {
    window.location.href = "https://api.codeness.kr/oauth2/authorization/google";
  };

  return (
      <div className="login-container">
        <h2>로그인</h2>
        <form onSubmit={handleLogin} className="login-form">
          <div className="form-group">
            <label>아이디:</label>
            <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
            />
          </div>
          <div className="form-group">
            <label>비밀번호:</label>
            <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
            />
          </div>
          <button type="submit" className="login-button">
            로그인
          </button>
        </form>

        <div className="social-login">
          <button onClick={handleGoogleLogin} className="google-login-button">
            Google로 로그인
          </button>
        </div>

        {message && <p className="message">{message}</p>}

        {/* 인라인 스타일로 변경 */}
        <style>
          {`
          .login-container {
            max-width: 400px;
            margin: 0 auto;
            padding: 20px;
          }

          .login-form {
            display: flex;
            flex-direction: column;
            gap: 15px;
          }

          .form-group {
            display: flex;
            flex-direction: column;
            gap: 5px;
          }

          input {
            padding: 8px;
            border: 1px solid #ddd;
            border-radius: 4px;
          }

          .login-button {
            padding: 10px;
            background-color: #007bff;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
          }

          .login-button:hover {
            background-color: #0056b3;
          }

          .social-login {
            margin-top: 20px;
            text-align: center;
          }

          .google-login-button {
            padding: 10px;
            background-color: white;
            border: 1px solid #ddd;
            border-radius: 4px;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto;
            color: #4285F4 !important;  /* !important를 추가하여 우선순위 높임 */
            font-weight: 500;
          }

          .google-login-button:hover {
            background-color: #f5f5f5;
          }

          .message {
            margin-top: 15px;
            color: #dc3545;
            text-align: center;
          }
        `}
        </style>
      </div>
  );
};

export default Login;