import React, { useState, useEffect } from 'react';
import api from "../../../api/axios";
import { useHistory } from 'react-router-dom';
import '../../../styles/admin/MentorSettlement.css'

const MentorSettlement = () => {
  const history = useHistory(); // useHistory 훅 추가
  const [settlements, setSettlements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchSettlements();
  }, []);

  const fetchSettlements = async () => {
    const token = localStorage.getItem('jwtToken');

    try {
      const response = await api.get('/admin/mentors/settlements', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      setSettlements(response.data.data);
      setLoading(false);
    } catch (error) {
      console.error('정산 내역 조회 실패:', error);
      setError('정산 내역을 불러오는 중 오류가 발생했습니다.');
      setLoading(false);
    }
  };

  const handleDetailView = (mentorId) => {
    // 멘토 ID를 포함하여 정산 상세 페이지로 이동
    history.push(`/admin/settlement/${mentorId}`);
  };

  if (loading) return <div className="loading-spinner">로딩 중...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
      <div className="mentor-settlements-container">
        <h1>멘토 정산 목록</h1>
        <div className="settlements-list">
          {settlements.map((settlement) => (
              <div key={settlement.mentorId} className="settlement-row">
                <span className="mentor-name">{settlement.mentorName}</span>
                <button
                    className="detail-button"
                    onClick={() => handleDetailView(settlement.mentorId)}
                >
                  상세
                </button>
              </div>
          ))}
        </div>
      </div>
  );
};

export default MentorSettlement;