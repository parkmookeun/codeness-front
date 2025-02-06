import React, { useState, useEffect } from 'react';
import api from '../../../api/axios';
import { useHistory } from 'react-router-dom';
import '../../../styles/mypage/mentor-request/MentorRequestList.css'

const MentorRequestCard = ({ request, onDelete }) => (
    <div className="mentor-card">
      <div className="card-header">
        <h3 className="position">{request.position}</h3>
        <span className={`status-badge status-${request.isAccepted.toLowerCase()}`}>
       {request.isAccepted === 'WAITING' ? '대기 중' :
           request.isAccepted === 'ACCEPTED' ? '승인됨' : '거절됨'}
     </span>
      </div>
      <div className="card-content">
        <div className="info-row">
          <span>분야</span>
          <span>{request.field}</span>
        </div>
        <div className="info-row">
          <span>경력</span>
          <span>{request.career}년</span>
        </div>
        {request.isAccepted === 'REJECTED' && (
            <button
                onClick={() => onDelete(request.id)}
                className="delete-button"
            >
              삭제
            </button>
        )}
      </div>
    </div>
);

const MentorRequestPage = () => {
  const [mentorRequests, setMentorRequests] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const history = useHistory();

  useEffect(() => {
    fetchMentorRequests();
  }, []);

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

  const fetchMentorRequests = async () => {
    const token = localStorage.getItem('jwtToken');
    if (!validateToken(token)) {
      localStorage.removeItem('jwtToken');
      history.push('/login');
      return;
    }

    try {
      setLoading(true);
      const response = await api.get('/users/mentors', {
        headers: { Authorization: `Bearer ${token.trim()}` }
      });
      setMentorRequests(response.data.data || []);
    } catch (error) {
      console.error('Mentor requests error:', error);
      if (error.response?.status === 401) {
        localStorage.removeItem('jwtToken');
        history.push('/login');
      } else {
        setError('멘토 요청 정보를 불러오는 데 실패했습니다.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (requestId) => {
    try {
      const token = localStorage.getItem('jwtToken');
      await api.delete(`/users/mentors/${requestId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMentorRequests(prevRequests =>
          prevRequests.filter(request => request.id !== requestId)
      );
    } catch (error) {
      setError('삭제에 실패했습니다.');
      console.error('Delete error:', error);
    }
  };

  if (loading) return <div className="loading-spinner" />;

  return (
      <div className="mentor-request-container">
        <h2>멘토 요청 목록</h2>
        {error ? (
            <div className="error-message">{error}</div>
        ) : mentorRequests.length > 0 ? (
            <div className="card-grid">
              {mentorRequests.map((request, index) => (
                  <MentorRequestCard
                      key={index}
                      request={request}
                      onDelete={handleDelete}
                  />
              ))}
            </div>
        ) : (
            <div className="empty-message">멘토 요청이 없습니다.</div>
        )}
      </div>
  );
};

export default MentorRequestPage;