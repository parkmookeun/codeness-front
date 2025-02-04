import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";

const PaymentHistory = ({ onViewDetail }) => {
  const [paymentHistories, setPaymentHistories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const history = useHistory();
  const token = localStorage.getItem("jwtToken");

  const getPaymentStatusText = (status) => {
    switch (status) {
      case "COMPLETE":
        return "결제 완료";
      case "CANCEL":
        return "결제 취소";
      default:
        return "상태 확인 중";
    }
  };

  useEffect(() => {
    const fetchPaymentHistory = async () => {
      if (!token) {
        setError("로그인이 필요합니다.");
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get("http://localhost:8080/mentoring/payment-history", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setPaymentHistories(response.data.data);
      } catch (error) {
        setError("결제 내역을 불러오는 중 오류가 발생했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchPaymentHistory();
  }, [token]);

  const handleDetailClick = (paymentHistoryId) => {
    // 결제 내역 상세 페이지로 이동
    history.push(`/mypage/payment-history/detail/${paymentHistoryId}`);
  };

  const handleReviewButton = (reviewWritten, paymentHistoryId, mentoringPostId,
    postTitle, mentorNick, profileUrl) => {
    if (!reviewWritten) {
      // 리뷰 작성 페이지로 이동
      history.push({
        pathname: "/mypage/payments/review",
        state: {
          paymentHistoryId,
          mentoringPostId,
          postTitle,
          mentorNick,
          profileUrl
        }
        
      });
    } else {
      // 리뷰 보기 페이지로 이동
      history.push(`/mypage/payments/review/${paymentHistoryId}`);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
      <div className="payment-history-container" style={{ maxHeight: "80vh", overflowY: "auto" }}>
        {paymentHistories.length > 0 ? (
            paymentHistories.map((history) => (
                <div key={history.id} className="payment-item">
                  <p
                      onClick={() => onViewDetail(history.id)} // 상세 보기 콜백 호출
                      style={{cursor: "pointer", textDecoration: "underline"}}
                  >
                    <strong>
                      {getPaymentStatusText(
                          history.paymentStatus)} - {history.userNickname} / {history.mentoringDate} / {history.mentoringTime} [ {history.title} ]
                    </strong>
                  </p>
                  <button
                      className="review-button"
                      onClick={() => handleReviewButton(
                          history.reviewStatus !== "NOT_YET", history.id,
                        history.mentoringPostId, history.title, history.userNickname, history.profileUrl)}
                  >
                    {history.reviewStatus === "NOT_YET" ? "후기 작성" : "후기 보기"}
                  </button>
                </div>
            ))
        ) : (
            <p>결제 내역이 없습니다.</p>
        )}
      </div>
  );
};

export default PaymentHistory;
