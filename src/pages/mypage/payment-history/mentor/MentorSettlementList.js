// MentorSettlementList.jsx
import React from 'react';
import api from '../../../../api/axios';
import { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';

const listContainerStyle = {
  width: '100%'
};

const titleStyle = {
  fontWeight: '600',
  marginBottom: '16px'
};

const listWrapperStyle = {
  backgroundColor: '#f3f4f6',
  borderRadius: '8px',
  padding: '16px',
  height: 'calc(100vh - 50vh)',  // 뷰포트 높이에서 여유 공간 확보
  overflowY: 'auto',  // 세로 스크롤 추가
  overflowX: 'hidden'  // 가로 스크롤 제거
};

const settlementItemStyle = {
  width: '100%',
  backgroundColor: 'white',
  borderRadius: '8px',
  padding: '12px',
  marginBottom: '8px',
  border: 'none',
  textAlign: 'left',
  cursor: 'pointer',
  minHeight: '50px',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center'
};

const itemTextStyle = {
  fontSize: '14px',
  marginBottom: '2px',
  color: 'black'
};

const descriptionStyle = {
  fontSize: '14px',
  color: 'black',
  marginTop: '2px'
};

const MentorSettlementList = ({refreshTrigger}) => {
  // 테스트를 위해 더 많은 데이터 추가
  const history = useHistory();
  const [settlements, setSettlements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = localStorage.getItem("jwtToken");

  const handleDetailClick = (paymentHistoryId) => {
    console.log("버튼을 누를시 전달",paymentHistoryId);
    history.push({
      pathname: `/mypage/payment-history/detail/${paymentHistoryId}/mentor`,
      state:{
        paymentHistoryId: paymentHistoryId,
        activeTab: 'payment-history'
      }}
    );
  };


  const getSettlementStatusText = (status) => {
    switch (status) {
      case "UNPROCESSED":
        return "정산 미처리";
      case "PROCESSING":
        return "정산 처리중";
      case "COMPLETE":
        return "정산 완료";     
    }
  };

  useEffect(() => {
    const fetchSettlementHistory = async () => {
      if (!token) {
        setError("로그인이 필요합니다.");
        setLoading(false);
        return;
      }

      

      try {
        //정산 내역 요청
        const response = await api.get("/payment-history", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setSettlements(response.data.data);
        
      } catch (error) {
        setError("결제 내역을 불러오는 중 오류가 발생했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchSettlementHistory();
  }, [refreshTrigger]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div style={listContainerStyle}>
          <h2 style={titleStyle}>정산 내역</h2>
          <div style={listWrapperStyle}>
            {settlements.map((settlement) => (
              <button key={settlement.id}
                      style={settlementItemStyle}
                      onClick={() => handleDetailClick(settlement.id)}>
                <div style={itemTextStyle}>
                  {getSettlementStatusText(settlement.settlementStatus)} - {settlement.userNickname} / {settlement.mentoringDate} / {settlement.mentoringTime?.substring(0, 5)}
                </div>
                <div style={descriptionStyle}>
                  [{settlement.title}]
                </div>
              </button>
            ))}
          </div>
        </div>
      );
};

export default MentorSettlementList;