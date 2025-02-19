import React, {useState} from "react";
import {useLocation, useHistory} from "react-router-dom";
import api from "../../api/axios";
import "../../styles/payment/MentoringPayment.css";

const MentoringPayment = () => {
  const location = useLocation();
  const history = useHistory();

  const token = localStorage.getItem("jwtToken"); // JWT 토큰 가져오기
  const [isLoading, setIsLoading] = useState(false);

  // 전달된 state에서 데이터 가져오기
  const {
    mentoringPostId,
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
      amount: price,
      buyer_email: "test@test.com",
      buyer_name: "구매자이름",
    };

    IMP.request_pay(paymentData, async (rsp) => {

      //결제 실패 처리
      if (!rsp.success) {
        alert(`결제가 실패하였습니다 : ${rsp.error_msg}`)
        try {
          await handleRejectPayment(rsp.imp_uid); // 결제 거절 API 호출
        } catch (error) {
          console.error("결제 거절 처리 중 오류:", error);
        } finally {
          setIsLoading(false);
        }
        return;
      }

      try {
        //결제 검증 & 채팅방 생성 api 호출
        const response = await api.post(
            `/payments/${paymentId}/chat-rooms`,
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

        //서버 응답 데이터 검증
        const paymentHistoryId = response.data?.data;
        if (!paymentHistoryId) {
          throw new Error("결제 검증 실패 : 서버 응답 데이터 없음");
        }

        alert("결제가 완료되었습니다!");

        //결제 검증 완료 후 paymentHistoryId 성공 페이지로 전달
        history.push("/mentoring/success", {
          mentorNickname: location.state.mentorNickname,
          mentoringDate,
          mentoringTime,
          paymentHistoryId,
        });

      } catch (error) {
        console.error("결제 검증 중 오류:", error);
        alert("결제 검증 중 문제가 발생했습니다.");
      } finally {
        //로딩 상태 해제
        setIsLoading(false);
      }
    });
};

// 결제 거절 처리 API 호출
const handleRejectPayment = async (impUid) => {
  if (!paymentId || !impUid) {
    alert("결제 정보를 찾을 수 없습니다.");
    return;
  }

  try {
    await api.delete(`/payments/${paymentId}/rejection`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data: {
        impUid, // 결제 실패 시 받은 impUid 전달
      },
    });
    alert("결제 거절로 인해 데이터가 삭제되었습니다.");

    //결제 거절 후 리다이렉트
    history.push(
        `/mentoring/${location.state.mentoringPostId}/mentoring-reservation`);
  } catch (error) {
    console.error("결제 거절 처리 중 오류:", error);
  }
};

//결제 데이터 삭제 요청
const handleDeletePayment = async () => {
  if (!paymentId) {
    alert("결제 정보를 찾을 수 없습니다.");
    return;
  }

  try {
    await api.delete(`/payments/${paymentId}/cancel`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data: {},
    });
    alert("결제가 취소되었습니다.");

    //결제 취소 후 리다이렉트
    history.push(
        `/mentoring/${location.state.mentoringPostId}/mentoring-reservation`);
  } catch (error) {
    console.error("결제 취소 중 오류:", error);
  }
};

//뒤로가기 버튼 클릭 시 결제 삭제
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
      <h1>멘토링 공고 스케줄 결제</h1>
      <div className="payment-details">
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
      </div>
    </div>
);
};

export default MentoringPayment;
