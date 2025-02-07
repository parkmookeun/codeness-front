import React from "react";
import { useLocation, useHistory } from "react-router-dom";
import api from "../../api/axios";
import "../../styles/payment/MentoringPaymentSuccess.css";

const MentoringPaymentSuccess = () => {
  const location = useLocation();
  const history = useHistory();

  // ✅ 결제 성공 후 넘어오는 정보 (paymentHistoryId 추가)
  const { mentorNickname, mentoringDate, mentoringTime, paymentHistoryId } = location.state || {};

  // ✅ 캘린더 일정 추가 함수
  const addToCalendar = async () => {
    try {
      // 날짜 데이터 생성 및 검증
      const startDate = new Date(`${mentoringDate}T${mentoringTime}:00+09:00`);
      if (isNaN(startDate.getTime())) {
        throw new Error("유효하지 않은 날짜 형식입니다");
      }

      // 종료 시간 계산 (1시간 후)
      const endDate = new Date(startDate.getTime() + 60 * 60 * 1000);

      // 일정 추가 요청 데이터 구성
      const eventData = {
        summary: `멘토링 - ${mentorNickname}`,
        description: `${mentorNickname} 멘토님과의 멘토링`,
        startTime: startDate.toISOString(),
        endTime: endDate.toISOString(),
      };

      console.log("📅 캘린더 요청 데이터:", eventData);

      const response = await api.post("/users/schedule", eventData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });

      if (response.data) {
        console.log("✅ 캘린더 일정 추가 성공:", response.data);
      } else {
        throw new Error("서버 응답이 비어있습니다");
      }
    } catch (error) {
      console.error("❌ 캘린더 일정 추가 실패:", error);
      // alert("캘린더 일정 추가에 실패했습니다. 마이페이지에서 다시 시도해주세요.");
    }
  };

  // ✅ 채팅방 생성 함수 (paymentHistoryId 포함)
  const createChatRoom = async () => {
    try {
      if (!paymentHistoryId) {
        throw new Error("결제 내역 ID가 없습니다. 채팅방을 생성할 수 없습니다.");
      }

      // 채팅방 생성 요청 데이터
      const chatRoomData = {
        mentorNickname,
        mentoringDate,
        mentoringTime,
        paymentHistoryId, // ✅ 필수 데이터
      };

      console.log("💬 채팅방 요청 데이터:", chatRoomData);

      const response = await api.post("/chat-rooms", chatRoomData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });

      if (response.data) {
        console.log("✅ 채팅방 생성 성공:", response.data);
      } else {
        throw new Error("채팅방 생성 실패: 서버 응답이 비어있습니다");
      }
    } catch (error) {
      console.error("❌ 채팅방 생성 실패:", error);
      alert("채팅방 생성에 실패했습니다. 마이페이지에서 다시 시도해주세요.");
    }
  };

  // ✅ 확인 버튼 클릭 시 실행 (캘린더 추가 & 채팅방 생성 후 마이페이지 이동)
  const handleConfirm = async () => {
    if (!paymentHistoryId) {
      alert("멘토링 정보가 부족하여 처리를 진행할 수 없습니다.");
      return;
    }

    try {
      await addToCalendar();
      await createChatRoom();
      history.push("/mypage/profile"); // ✅ 모든 작업 완료 후 마이페이지로 이동
    } catch (error) {
      console.error("⚠️ 확인 버튼 처리 중 오류 발생:", error);
    }
  };

  return (
      <div className="payment-success-page">
        <div className="success-message-container">
          <h1 className="success-title">결제 완료</h1>
          <div className="success-content">
            <p className="success-message">멘토링 신청을 완료했습니다.</p>

            <div className="mentoring-info">
              <p>
                <strong>멘토:</strong> {mentorNickname || "정보 없음"}
              </p>
              <p>
                <strong>멘토링 날짜:</strong> {mentoringDate || "정보 없음"}
              </p>
              <p>
                <strong>멘토링 시간:</strong> {mentoringTime || "정보 없음"}
              </p>
            </div>

            <p className="calendar-notice">
              * 구글 캘린더에 일정이 자동으로 추가됩니다.<br />
              * 채팅방이 자동으로 생성됩니다.
            </p>
          </div>

          <button
              className="confirm-button"
              onClick={handleConfirm}
              aria-label="확인 및 마이페이지로 이동"
          >
            확인
          </button>
        </div>
      </div>
  );
};

export default MentoringPaymentSuccess;
