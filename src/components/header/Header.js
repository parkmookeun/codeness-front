import React, { useState, useRef, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import logo from '../../assets/icons/Codeness_logo.png';
import icon from '../../assets/icons/profile-placeholder.png';
import './Header.css';

const Header = () => {
  const history = useHistory();
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // 로그인 여부 확인
    checkLoginStatus();
  }, []);

  const checkLoginStatus = () => {
    const token = localStorage.getItem('jwtToken');
    setIsLoggedIn(!!token);
  };

  // 외부 클릭 시 드롭다운 닫기
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsUserDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogoClick = () => {
    history.push('/');
  };

  const toggleUserDropdown = () => {
    setIsUserDropdownOpen(!isUserDropdownOpen);
  };

  const goToMyPage = () => {
    const token = localStorage.getItem('jwtToken');
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      if (payload.role === 'ADMIN') {
        history.push('/admin/mypage/mentor-request');
      } else {
        history.push('/mypage/profile');
      }
    } catch (error) {
      history.push('/login');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('jwtToken');
    checkLoginStatus(); // 로그인 상태 업데이트
    history.push('/login');
  };

  return (
      <header>
        <div className="logo" onClick={handleLogoClick}>
          <img src={logo} alt="CodeNess 로고" />
        </div>

        <nav>
          <Link to="/community">커뮤니티</Link>
          <Link to="/mentoring">멘토링</Link>
          <Link to="/news">뉴스</Link>

          <div className="user-dropdown" ref={dropdownRef}>
            {isLoggedIn ? (
                <div onClick={toggleUserDropdown} className="cursor-pointer">
                  <img
                      src={icon}
                      alt="프로필"
                      className="user-profile-image"
                  />
                </div>
            ) : (
                <button onClick={toggleUserDropdown} className="login-button">
                  로그인
                  <i className="ml-2 fas fa-chevron-down"></i>
                </button>
            )}

            <div className={`user-dropdown-menu ${isUserDropdownOpen ? 'open' : ''}`}>
              {isLoggedIn ? (
                  <>
                    <button
                        onClick={goToMyPage}
                        className="user-dropdown-item"
                    >
                      마이페이지
                    </button>
                    <button
                        onClick={handleLogout}
                        className="user-dropdown-item"
                    >
                      로그아웃
                    </button>
                  </>
              ) : (
                  <>
                    <Link to="/login" className="user-dropdown-item">
                      로그인
                    </Link>
                    <Link to="/signup" className="user-dropdown-item">
                      회원가입
                    </Link>
                  </>
              )}
            </div>
          </div>
        </nav>
      </header>
  );
};

export default Header;