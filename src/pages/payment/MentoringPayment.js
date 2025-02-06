import React, { useState } from "react";
import { useLocation, useHistory } from "react-router-dom";
import api from "../../api/axios";
import "../../styles/payment/MentoringPayment.css";

const MentoringPayment = () => {
  const location = useLocation();
  const history = useHistory();

  const token = localStorage.getItem("jwtToken"); // JWT 토큰 가져오기
  const [isLoading, setIsLoading] = useState(false);

  // 전달된 state에서 데이터 가져오기
  const {
    mentoringDate,
    mentoringTime,
    scheduleId,
    paymentId,
    price,
  } = location.state || {};

  const handlePayment = async () => {
    if (!scheduleId || !price) {
      alert("결제 데이터를 찾을 수 없습니다.");
      return;
    }

    const IMP = window.IMP;
    IMP.init("imp46707766"); // 아임포트 가맹점 식별코드

    setIsLoading(true);

    const paymentData = {
      pg: "html5_inicis",
      pay_method: "card",
      merchant_uid: `order_${new Date().getTime()}`,
      name: `멘토링 스케줄 (${scheduleId})`,
      amount: price, // 전달된 가격 사용
      buyer_email: "test@test.com",
      buyer_name: "구매자이름",
    };

    IMP.request_pay(paymentData, async (rsp) => {
      if (rsp.success) {
        try {
          await api.post(
              `/payments/${paymentId}/verify`,
              {
                mentoringScheduleId: scheduleId,
                impUid: rsp.imp_uid,
                pgTid: rsp.pg_tid,
                paymentCost: rsp.paid_amount,
                paymentCard: "신용카드",
              },
              {
                headers: {
                  Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
                },
              }
          );
          alert("결제가 완료되었습니다!");
          history.push("/mentoring/success");
        } catch (error) {
          console.error("결제 검증 중 오류:", error);
          alert("결제 검증 중 문제가 발생했습니다.");
        }
      } else {
        alert(`결제가 실패하였습니다: ${rsp.error_msg}`);
        try {
          await handleRejectPayment(rsp.imp_uid); // 실패 시 결제 거절 API 호출
        } catch (error) {
          console.error("결제 거절 처리 중 오류:", error);
        }
      }
      setIsLoading(false);
    });
  };

  // 결제 거절 처리 API 호출
  const handleRejectPayment = async (impUid) => {
    if (!paymentId || !impUid) {
      alert("결제 정보를 찾을 수 없습니다.");
      return;
    }

    await api.delete(`/mentoring/payments/${paymentId}/rejection`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data: {
        impUid, // 결제 실패 시 받은 impUid 전달
      },
    });
    alert("결제 거절로 인해 데이터가 삭제되었습니다.");
  };

  // 결제 데이터 삭제 요청
  const handleDeletePayment = async () => {
    if (!paymentId) {
      alert("결제 정보를 찾을 수 없습니다.");
      return;
    }

    await api.delete(`/mentoring/payments/${paymentId}/cancel`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data: {}, // 추가 데이터가 필요 없는 경우 빈 객체 전달
    });
    alert("결제가 취소되었습니다.");
  };

  // 뒤로가기 버튼 클릭 시 결제 삭제
  const handleBack = async () => {
    try {
      setIsLoading(true);
      await handleDeletePayment(); // 결제 데이터 삭제 요청
    } catch (error) {
      console.error("결제 삭제 중 오류:", error);
      alert("결제를 취소하는 중 문제가 발생했습니다.");
    } finally {
      setIsLoading(false);
      history.goBack(); // 이전 페이지로 이동
    }
  };

  return (
      <div className="payment-page">
        <h1>Mentoring Payment</h1>
        <div className="payment-details">
          <p>스케줄 ID: {scheduleId}</p>
          <p>스케줄 날짜: {mentoringDate}</p>
          <p>스케줄 시간: {mentoringTime}</p>
          <p>결제 금액: {price}원</p>
          <button
              className="pay-button"
              onClick={handlePayment}
              disabled={isLoading}
          >
            {isLoading ? "결제 진행 중..." : "결제하기"}
          </button>
          <button
              className="back-button"
              onClick={handleBack}
              disabled={isLoading}
          >
            뒤로가기
          </button>
        </div>
      </div>
  );
};

export default MentoringPayment;
