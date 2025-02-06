// MentorSettlementSummary.jsx
import React from 'react';
import { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import api from '../../../../api/axios';

const summaryContainerStyle = {
  backgroundColor: 'white',
  borderRadius: '12px',
  border: '1px solid #e5e7eb',
  padding: '16px',
  boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
};

const titleStyle = {
  fontSize: '18px',
  fontWeight: '600',
  marginBottom: '16px'
};

const itemStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '8px'
};

const labelStyle = {
  color: '#666'
};

const finalAmountStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  borderTop: '1px solid #eee',
  paddingTop: '8px',
  marginTop: '8px'
};

const buttonStyle = {
  width: '100%',
  backgroundColor: '#3b82f6',
  color: 'white',
  padding: '8px',
  borderRadius: '8px',
  border: 'none',
  marginTop: '16px',
  cursor: 'pointer'
};

const MentorSettlementSummary = ({ onSettlementComplete  }) => {
  const [pendingSettlements, setPendingSettlements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = localStorage.getItem("jwtToken");

  // fetchSettlementHistory를 별도의 함수로 정의
  const fetchSettlementHistory = async () => {
    if (!token) {
      setError("로그인이 필요합니다.");
      setLoading(false);
      return;
    }

    try {
      const pendingResponse = await api.get("/mentors/mentoring/payment-history/settles-unprocessed", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setPendingSettlements(pendingResponse.data.data);
    } catch (error) {
      setError("결제 내역을 불러오는 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettlementHistory();
  }, [token]);  // onDataReceived 제거 (불필요한 리렌더링 방지)

  const handleSettlementRequest = async () => {
    

    try {
      setLoading(true);
      await api.patch("/mentors/mentoring/payment-history/settles", {}, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      alert("정산 요청이 완료되었습니다.");
      await fetchSettlementHistory();  // 정산 내역 다시 불러오기
      onSettlementComplete();
    } catch (error) {
      setError("정산 요청 중 오류가 발생했습니다.");
      alert(error.response?.data?.message || "정산 요청 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };
  
 
  return (
    <div style={summaryContainerStyle}>
      <h2 style={titleStyle}>신청할 정산내역</h2>
      <div style={itemStyle}>
        <span style={labelStyle}>총 건수</span>
        <span>{pendingSettlements.count}건</span>
      </div>
      <div style={itemStyle}>
        <span style={labelStyle}>총 정산액</span>
        <span>{pendingSettlements.totalCost}원</span>
      </div>
      <div style={itemStyle}>
        <span style={labelStyle}>중계 수수료</span>
        <span>{pendingSettlements.charge}원</span>
      </div>
      <div style={finalAmountStyle}>
        <span>최종 정산금액</span>
        <span>{pendingSettlements.finalCost}원</span>
      </div>
      <button style={{...buttonStyle,
        backgroundColor: pendingSettlements.count > 0 ? '#3b82f6' : '#e5e7eb',
        cursor: pendingSettlements.count > 0 ? 'pointer' : 'not-allowed'
      }}
      onClick={handleSettlementRequest}
      disabled={!pendingSettlements.count}
    >
      {pendingSettlements.count > 0 ? '정산 받기' : '정산할 내역이 없습니다'}</button>
    </div>
  );
};

export default MentorSettlementSummary;