import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import api from '../../api/axios';
import MentorBanner from './MentorBanner';
import './Home.css';

const MentorRecommendation = () => {
  const [mentors, setMentors] = useState([]);
  const [isVisible, setIsVisible] = useState(false);
  //토큰 가져오기
  const token = localStorage.getItem("jwtToken");
  const history = useHistory();

  const fetchMentors = async () => {
    try {
      const response = await api.get('/users/mentoring',{
        headers: {
            'Authorization': `Bearer ${token}`
        },
    });
      setMentors(response.data.data);
    } catch (error) {
      console.error('Failed to fetch mentors:', error);
    }
  };

  const handleShowMore = () => {
    //비로그인 추천 필터
    if(!token){
      alert("멘토링 추천은 로그인이 필요합니다.");
      history.push('/login');
    }
    setIsVisible(true);
    fetchMentors();  
  };

  return (
    <div style={{ width: '100%' }}>
      {!isVisible ? (
     <MentorBanner 
     onClick={handleShowMore} />
      ) : (
        <div style={{ 
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.8)',
          padding: '32px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'white', marginBottom: '24px' }}>
            나의 추천 멘토는?
          </h2>
          <div style={{ 
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '16px',
            width: '100%',
            maxWidth: '1000px'
          }}>
            {mentors.map((mentor, index) => (
              <div key={index}
               onClick={() => window.location.href = `/mentoring/${mentor.mentoringPostId}`}
               style={{
                cursor: 'pointer',
                backgroundColor: 'white',
                padding: '16px',
                borderRadius: '8px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }}>
                <div style={{ fontSize: '0.875rem', fontWeight: '500', marginBottom: '8px' }}>
                  [{mentor.title}] - {mentor.userNickname}
                </div>
                <div style={{ fontSize: '0.875rem', color: '#4B5563', marginBottom: '8px' }}>분야 :{mentor.field}</div>
                <div style={{ fontSize: '0.875rem', color: '#4B5563', marginBottom: '8px' }}>경력 :{mentor.career}</div>
                <div>
                  <span style={{ color: '#FFD700' }}>★ {mentor.starRating}</span>
                </div>
              </div>
            ))}
          </div>
          <p style={{ fontSize: '0.875rem', color: 'white', marginTop: '24px', textAlign: 'center' }}>
            <a href='/mentoring'>더 자세한 추천 시스템을 받고 싶으면 클릭!</a>
          </p>
          <button 
         onClick={() => setIsVisible(false)}
         style={{
           backgroundColor: '#3B82F6',
           color: 'white',
           padding: '8px 24px',
           borderRadius: '4px',
           marginTop: '16px',
           cursor: 'pointer'
         }}
       >
         확인
       </button>
        </div>
      )}
    </div>
   );
};

export default MentorRecommendation;