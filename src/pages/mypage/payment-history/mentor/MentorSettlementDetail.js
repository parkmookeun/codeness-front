import React, { useEffect, useState } from "react";
import { useLocation, useHistory } from 'react-router-dom';
import api from '../../../../api/axios';

function MentorSettlementDetail() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const token = localStorage.getItem("jwtToken"); // JWT 토큰 가져오기
  const location = useLocation();
  const history = useHistory();
  // 결제 내역 조회
  useEffect(() => {
    const paymentHistoryId = location.state.paymentHistoryId;

    console.log("거래내역id는",paymentHistoryId);
    const fetchData = async () => {
      if (!token) {
        setError("로그인이 필요합니다. 다시 로그인 해주세요.");
        setLoading(false);
        return;
      }

      try {
        const response = await api.get(`/payment-history/${paymentHistoryId}/mentors`, {
          headers: {
            Authorization: `Bearer ${token}`, // 헤더에 토큰 설정
          },
        });
        setData(response.data.data);
      } catch (error) {
        if (error.response && error.response.status === 401) {
          setError("인증 실패: 다시 로그인해주세요.");
        } else {
          setError("결제 내역을 불러오는 중 오류가 발생했습니다.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token]);

  if (loading) return <div>로딩중...</div>;
  if (error) return <div>{error}</div>;
  if (!data) return null;

  return (
      <div style={{ maxWidth: "600px", margin: "20px auto", padding: "20px", border: "1px solid #ccc", borderRadius: "8px" }}>
        <h2>결제 내역 상세</h2>
        <p><strong>결제 상태:</strong> {data.paymentStatus === "COMPLETE" ? "결제 완료" : "결제 취소"}</p>
        <p><strong>멘토 닉네임:</strong> {data.userNickname}</p>
        <p><strong>멘토링 공고 제목:</strong> {data.title}</p>
        <p><strong>결제 금액:</strong> {data.paymentCost.toLocaleString()}원</p>
        <p><strong>결제 일시:</strong> {new Date(data.createdAt).toLocaleString()}</p>
        {data.canceledAt && <p><strong>결제 취소일:</strong> {new Date(data.canceledAt).toLocaleString()}</p>}
        <p><strong>멘토링 날짜:</strong> {data.mentoringDate}</p>
        <p><strong>멘토링 시간:</strong> {data.mentoringTime}</p>

        <button 
        style={{ marginTop: "10px", padding: "10px 20px" }}
        onClick={() => history.push('/mypage/payment-history', {
            activeTab: 'payment-history'
        })}
    >
    목록으로 돌아가기
</button>
      </div>
  );
}

export default MentorSettlementDetail;
