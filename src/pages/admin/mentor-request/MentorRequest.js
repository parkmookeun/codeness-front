import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import api from '../../../api/axios';
import '../../../styles/admin/MentorRequest.css'

const MentorRequestList = ({ history }) => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchMentorRequests();
  }, []);

  const fetchMentorRequests = async () => {
    try {
      const token = localStorage.getItem('jwtToken');
      const response = await api.get('/admin/mentors/mentor-requests', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setRequests(response.data.data || []);
      setLoading(false);
    } catch (error) {
      setError('목록 조회에 실패했습니다.');
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (mentorId, status) => {
    try {
      const token = localStorage.getItem('jwtToken');
      await api.patch(`/admin/mentors/mentor-requests/${mentorId}`,
          { isAccepted: status },
          { headers: { Authorization: `Bearer ${token}` }}
      );
      fetchMentorRequests();
    } catch (error) {
      setError('상태 업데이트 실패');
    }
  };

  const handleCardClick = (mentorId) => {
    history.push(`/admin/mentor-request/${mentorId}`);
  };

  if (loading) return <div className="loading-spinner" />;
  if (error) return <div className="error-message">{error}</div>;

  return (
      <div className="mentor-requests-container">
        <h2>멘토 신청 목록</h2>
        <div className="requests-grid">
          {requests.map((request) => (
              <div
                  key={request.mentorId}
                  className="request-card"
                  onClick={() => handleCardClick(request.mentorId)}
              >
                <div className="request-header">
                  <h3>{request.userName}</h3>
                </div>
                <div className="action-buttons" onClick={(e) => e.stopPropagation()}>
                  <button
                      onClick={() => handleUpdateStatus(request.mentorId, 'ACCEPTED')}
                      className="accept-button"
                  >
                    수락
                  </button>
                  <button
                      onClick={() => handleUpdateStatus(request.mentorId, 'REJECTED')}
                      className="reject-button"
                  >
                    거절
                  </button>
                </div>
              </div>
          ))}
        </div>
      </div>
  );
};

export default withRouter(MentorRequestList);