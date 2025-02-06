import React, { useState, useEffect } from 'react';
import api from '../../../api/axios';
import { useParams, useHistory } from 'react-router-dom';
import '../../../styles/admin/MentorDetail.css';

const MentorDetail = () => {
  const { mentorId } = useParams();
  const history = useHistory();
  const [mentor, setMentor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMentorDetails = async () => {
      try {
        const token = localStorage.getItem('jwtToken');
        const response = await api.get(`/admin/mentors/${mentorId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setMentor(response.data.data);
        setLoading(false);
      } catch (err) {
        setError('멘토 정보를 불러오는 데 실패했습니다');
        setLoading(false);
      }
    };

    fetchMentorDetails();
  }, [mentorId]);

  const handleGoBack = () => {
    history.push('/admin/mentor-list');
  };

  if (loading) return <div className="mentor-detail-loading">로딩 중...</div>;
  if (error) return <div className="mentor-detail-error">{error}</div>;
  if (!mentor) return <div className="mentor-detail-not-found">멘토 정보를 찾을 수 없습니다</div>;

  return (
      <div className="mentor-detail-container">
        <button onClick={handleGoBack} className="back-button">← 목록으로</button>
        <h2 className="mentor-detail-title">멘토 상세 정보</h2>
        <div className="mentor-detail-content">
          <div className="mentor-detail-section">
            <div className="mentor-detail-item">
              <span className="mentor-detail-label">이름</span>
              <span className="mentor-detail-value">{mentor.name}</span>
            </div>
            <div className="mentor-detail-item">
              <span className="mentor-detail-label">닉네임</span>
              <span className="mentor-detail-value">{mentor.userNickname}</span>
            </div>
            <div className="mentor-detail-item">
              <span className="mentor-detail-label">이메일</span>
              <span className="mentor-detail-value">{mentor.email}</span>
            </div>
            <div className="mentor-detail-item">
              <span className="mentor-detail-label">전화번호</span>
              <span className="mentor-detail-value">{mentor.phoneNumber}</span>
            </div>
          </div>
          <div className="mentor-detail-section">
            <div className="mentor-detail-item">
              <span className="mentor-detail-label">지역</span>
              <span className="mentor-detail-value">{mentor.region}</span>
            </div>
            <div className="mentor-detail-item">
              <span className="mentor-detail-label">분야</span>
              <span className="mentor-detail-value">{mentor.field}</span>
            </div>
            <div className="mentor-detail-item">
              <span className="mentor-detail-label">경력</span>
              <span className="mentor-detail-value">{mentor.career}</span>
            </div>
            <div className="mentor-detail-item">
              <span className="mentor-detail-label">MBTI</span>
              <span className="mentor-detail-value">{mentor.mbti}</span>
            </div>
            {mentor.siteLink && (
                <div className="mentor-detail-item">
                  <span className="mentor-detail-label">사이트</span>
                  <a
                      href={mentor.siteLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mentor-detail-link"
                  >
                    개인 사이트
                  </a>
                </div>
            )}
          </div>
        </div>
      </div>
  );
};

export default MentorDetail;