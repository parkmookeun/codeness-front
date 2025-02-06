// PaymentHistoryForMentor.jsx
import React from 'react';
import MentorBankAccount from './MentorBankAccount';
import MentorSettlementList from './MentorSettlementList';
import MentorSettlementSummary from './MentorSettlementSummary';
import { useState } from 'react';

const containerStyle = {
  width: '100%',
  display: 'flex',
  padding: '0' // 패딩 제거
};

const contentStyle = {
  width: '100%',
  backgroundColor: 'white',
  padding: '8px',  // 패딩 감소
  display: 'flex'
};

const layoutStyle = {
  display: 'flex',
  gap: '20%',  // gap 감소
  width: '100%'
  
};

const leftColumnStyle = {
  width: '50%'  // 왼쪽 영역 더 넓게
};

const rightColumnStyle = {
  width: '25%',  // 오른쪽 영역 더 좁게
  display: 'flex',
  flexDirection: 'column',
  border: '2px solid black',
  borderRadius: '15px',
  gap: '8px',  // gap 감소
  marginTop: '40px'  // 상단 마진 추가
};

const PaymentHistoryForMentor = () => {
  // 공유할 상태를 부모로 끌어올림
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  // 자식 컴포넌트들의 데이터를 새로고침하는 함수
  const handleRefresh = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <div style={containerStyle}>
      <div style={contentStyle}>
        <div style={layoutStyle}>
          {/* 왼쪽 정산내역 리스트 */}
          <div style={leftColumnStyle}>
            <MentorSettlementList
              refreshTrigger={refreshTrigger} />
          </div>
          
          {/* 오른쪽 사이드 영역 */}
          <div style={rightColumnStyle}>
            <MentorSettlementSummary
              onSettlementComplete={handleRefresh} />
            <MentorBankAccount />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentHistoryForMentor;