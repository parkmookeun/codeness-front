import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../../api/axios';

const MentorRequestDetail = () => {
  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { mentorId } = useParams();

  useEffect(() => {
    const fetchMentorRequestDetail = async () => {
      try {
        const token = localStorage.getItem('jwtToken');
        const response = await api.get(`/admin/mentors/mentor-requests/${mentorId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        setRequest(response.data.data);
        setLoading(false);
      } catch (error) {
        setError('상세 정보 조회에 실패했습니다.');
        setLoading(false);
      }
    };

    fetchMentorRequestDetail();
  }, [mentorId]);

  const handleUpdateStatus = async (status) => {
    try {
      const token = localStorage.getItem('jwtToken');
      await api.patch(`/admin/mentors/mentor-requests/${mentorId}`,
          { isAccepted: status },
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }
      );
      window.location.reload();
    } catch (error) {
      setError('상태 업데이트 실패');
    }
  };

  if (loading) return <div>로딩 중...</div>;
  if (error) return <div>{error}</div>;
  if (!request) return <div>멘토 신청 정보가 없습니다.</div>;

  return (
      <div className="mentor-request-detail-container">
        <h2>멘토 신청 상세 정보</h2>
        <div className="detail-card">
          <div className="detail-section">
            <h3>기본 정보</h3>
            <p><strong>이름:</strong> {request.userName}</p>
            <p><strong>연락처:</strong> {request.phoneNumber}</p>
            <p><strong>회사 이메일:</strong> {request.companyEmail}</p>
          </div>

          <div className="detail-section">
            <h3>전문 분야</h3>
            <p><strong>분야:</strong> {request.field}</p>
            <p><strong>회사:</strong> {request.company}</p>
            <p><strong>직책:</strong> {request.position}</p>
            <p><strong>경력:</strong> {request.career}년</p>
          </div>

          <div className="detail-section">
            <h3>신청 정보</h3>
            <p><strong>신청 일시:</strong> {new Date(request.createdAt).toLocaleString()}</p>
          </div>

          <div className="action-buttons">
            <button onClick={() => handleUpdateStatus('ACCEPTED')}>수락</button>
            <button onClick={() => handleUpdateStatus('REJECTED')}>거절</button>
          </div>
        </div>
      </div>
  );
};

export default MentorRequestDetail;