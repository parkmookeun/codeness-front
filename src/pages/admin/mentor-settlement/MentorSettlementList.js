import React, { useEffect, useState } from "react";
import { useParams } from 'react-router-dom';
import api from "../../../api/axios";

function MentorSettlementList() {
  const [settlementDetails, setSettlementDetails] = useState(null);
  const [settlementList, setSettlementList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { mentorId } = useParams();
  const token = localStorage.getItem('jwtToken');

  const fetchData = async () => {
    try {
      const [detailsResponse, listResponse] = await Promise.all([
        api.get(`/admin/mentors/settlements-detail/${mentorId}`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        api.get(`/admin/mentors/settlements/${mentorId}`, {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);
      setSettlementDetails(detailsResponse.data.data);
      setSettlementList(listResponse.data.data);
      setLoading(false);
    } catch (error) {
      setError('정산 내역을 불러오는 중 오류가 발생했습니다.');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [mentorId, token]);

  const handleSettlement = async () => {
    try {
      await api.patch(`/admin/mentors/${mentorId}/settlements`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('정산이 완료되었습니다.');
      fetchData(); // Refresh data after settlement
    } catch (error) {
      alert('정산 처리 중 오류가 발생했습니다.');
    }
  };

  const formatNumber = (num) => num ? Number(num).toLocaleString() : '0';

  if (loading) return <div>로딩 중...</div>;
  if (error) return <div>{error}</div>;
  if (!settlementDetails) return null;

  return (
      <div style={{ display: 'flex', maxWidth: '1000px', margin: '0 auto', padding: '20px' }}>
        <div style={{ flex: 1, marginRight: '20px', overflowY: 'auto', maxHeight: '600px' }}>
          <h3>정산 내역 관리</h3>
          {settlementList.map((item) => (
              <div key={item.settlementId} style={{
                border: '1px solid #e0e0e0',
                padding: '10px',
                marginBottom: '10px',
                borderRadius: '5px'
              }}>
                <p>정산 처리 - {item.mentorName} / {item.mentoringDate} / {item.mentoringTime}</p>
                <p>상태: {item.settlementStatus}</p>
              </div>
          ))}
        </div>

        <div style={{
          width: '300px',
          border: '1px solid #e0e0e0',
          padding: '20px',
          borderRadius: '5px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <h3>멘토 {settlementDetails.mentorName} 정산내역</h3>
          <div>
            <p>총 정산 건수: {formatNumber(settlementDetails.count)}건</p>
            <p>총 정산 수익: {formatNumber(settlementDetails.totalCost)}원</p>
            <p>중개 수수료: {formatNumber(settlementDetails.charge)}원</p>
            <p>최종 정산 금액: {formatNumber(settlementDetails.finalCost)}원</p>
            <p>정산 계좌: {settlementDetails.account || '계좌 정보 없음'}</p>
            <p>생성일: {settlementDetails.createAt}</p>
          </div>
          <button
              onClick={handleSettlement}
              style={{
                width: '100%',
                marginTop: '10px',
                padding: '10px',
                backgroundColor: '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: '5px'
              }}>
            정산
          </button>
        </div>
      </div>
  );
}

export default MentorSettlementList;