import React, { useEffect } from "react";
import { useLocation, useHistory } from "react-router-dom";
import axios from "axios";
import "../../styles/payment/MentoringPaymentSuccess.css";

const MentoringPaymentSuccess = () => {
  const location = useLocation();
  const history = useHistory();

  const { mentorNickname, mentoringDate, mentoringTime } = location.state || {};

  useEffect(() => {
    const addToCalendar = async () => {
      try {
        // 데이터 유효성 검사
        if (!mentorNickname || !mentoringDate || !mentoringTime) {
          throw new Error('필수 정보가 누락되었습니다');
        }

        // 날짜 데이터 생성 및 검증
        const startDate = new Date(`${mentoringDate}T${mentoringTime}:00+09:00`);
        if (isNaN(startDate.getTime())) {
          throw new Error('유효하지 않은 날짜 형식입니다');
        }

        // 종료 시간 계산 (1시간 후)
        const endDate = new Date(startDate.getTime() + 60 * 60 * 1000);

        // 요청 데이터 구성
        const eventData = {
          summary: `멘토링 - ${mentorNickname}`,
          description: `${mentorNickname} 멘토님과의 멘토링`,
          startTime: startDate.toISOString(),
          endTime: endDate.toISOString()
        };

        console.log('캘린더 요청 데이터:', eventData);

        const response = await axios.post('/users/schedule', eventData, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`
          }
        });

        if (response.data) {
          console.log('캘린더 일정 추가 성공:', response.data);
        } else {
          throw new Error('서버 응답이 비어있습니다');
        }
      } catch (error) {
        console.error('캘린더 일정 추가 실패:', error);

        let errorMessage = '캘린더 일정 추가에 실패했습니다.';
        if (error.response) {
          errorMessage += ` (${error.response.status}: ${error.response.data?.message || '알 수 없는 오류'})`;
        }

        alert(errorMessage + '\n마이페이지에서 다시 시도해주세요.');
      }
    };

    if (mentoringDate && mentoringTime && mentorNickname) {
      addToCalendar();
    } else {
      console.warn('멘토링 정보 누락:', { mentorNickname, mentoringDate, mentoringTime });
    }
  }, [mentorNickname, mentoringDate, mentoringTime]);

  const handleConfirm = () => {
    history.push("/mypage/profile");
  };

  return (
      <div className="payment-success-page">
        <div className="success-message-container">
          <h1 className="success-title">결제 완료</h1>
          <div className="success-content">
            <p className="success-message">멘토링 신청을 완료했습니다.</p>

            <div className="mentoring-info">
              <p>
                <strong>멘토:</strong> {mentorNickname || '정보 없음'}
              </p>
              <p>
                <strong>멘토링 날짜:</strong> {mentoringDate || '정보 없음'}
              </p>
              <p>
                <strong>멘토링 시간:</strong> {mentoringTime || '정보 없음'}
              </p>
            </div>

            <p className="calendar-notice">
              * 구글 캘린더에 일정이 자동으로 추가됩니다.
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