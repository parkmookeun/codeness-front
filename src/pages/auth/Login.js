import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import api from '../../api/axios';

// 이벤트 버스 생성
const eventBus = {
  listeners: {},
  emit(event) {
    if (this.listeners[event]) {
      this.listeners[event].forEach(callback => callback());
    }
  },
  on(event, callback) {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(callback);
  },
  off(event, callback) {
    if (this.listeners[event]) {
      this.listeners[event] = this.listeners[event].filter(cb => cb !== callback);
    }
  }
};

export const loginEventBus = eventBus;

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
            withCredentials: true,
          }
      );

      const token = response.headers["authorization"] || response.data.data;

      if (token) {
        localStorage.setItem("jwtToken", token);
        eventBus.emit('loginSuccess');
        setMessage("로그인 성공!");
        history.push("/");
      } else {
        setMessage("로그인 실패: 토큰을 받지 못했습니다.");
      }
    } catch (error) {
      console.error("Login error:", error);
      if (error.response) {
        const errorMessage =
            error.response.data?.message || error.response.data;
        setMessage(`로그인 실패: ${errorMessage}`);
      } else if (error.request) {
        setMessage("로그인 실패: 서버 응답이 없습니다.");
      } else {
        setMessage("로그인 실패: " + error.message);
      }
    }
  };

  const handleGoogleLogin = () => {
    try {
      window.location.href = "https://api.codeness.kr/oauth2/authorization/google";
    } catch (error) {
      console.error("Google 로그인 오류:", error);
      setMessage("Google 로그인 서비스에 일시적인 문제가 있습니다. 잠시 후 다시 시도해주세요.");
    }
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
          <p className="social-login-notice">현재 소셜로그인은 구글 인증 관련으로 허용된 사용자만 가능합니다!</p>
        </div>

        {message && <p className="message">{message}</p>}

        <style jsx>{`
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
         color: #4285F4 !important;
         font-weight: 500;
         width: 200px;
       }

       .google-login-button:hover {
         background-color: #f5f5f5;
       }

       .social-login-notice {
         margin-top: 10px;
         font-size: 13px;
         color: #666;
       }

       .message {
         margin-top: 15px;
         color: #dc3545;
         text-align: center;
       }
     `}</style>
      </div>
  );
};

export default Login;