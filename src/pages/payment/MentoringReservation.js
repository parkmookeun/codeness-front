import React, { useState, useEffect } from "react";
import { useParams, useHistory } from "react-router-dom";
import api from "../../api/axios";
import "../../styles/payment/MentoringReservation.css";

const MentoringReservation = () => {
  const { mentoringPostId } = useParams();
  const history = useHistory();

  const [mentoringPost, setMentoringPost] = useState(null);
  const [schedules, setSchedules] = useState([]);
  const [selectedSchedule, setSelectedSchedule] = useState(null);

  // Fetch JWT token from localStorage
  const token = localStorage.getItem("jwtToken");

  // 공고 데이터 가져오기
  useEffect(() => {
    const fetchMentoringPost = async () => {
      try {
        const response = await api.get(`/mentoring/${mentoringPostId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setMentoringPost(response.data.data);
      } catch (error) {
        console.error("공고 데이터 가져오기 오류:", error);
      }
    };

    fetchMentoringPost();
  }, [mentoringPostId, token]);

  // 유효한 스케줄 조회
  useEffect(() => {
    const fetchSchedules = async () => {
      try {
        const response = await api.get(
            `/mentoring/${mentoringPostId}/mentoring-schedule/empty-status`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
        );
        const data = response.data.data || [];
        setSchedules(data);
      } catch (error) {
        console.error("스케줄 데이터 가져오기 오류:", error);
        setSchedules([]);
      }
    };

    fetchSchedules();
  }, [mentoringPostId, token]);

  // 스케줄 선택
  const handleScheduleSelect = (schedule) => {
    setSelectedSchedule(schedule);
  };

  // 스케줄 신청 및 결제 페이지로 이동
  const handleBookNow = async () => {
    if (!selectedSchedule) {
      alert("스케줄을 선택해주세요.");
      return;
    }

    try {
      const response = await api.post(
          "/payments/mentoring-schedules",
          {
            mentoringScheduleId: selectedSchedule.id,
            paymentCost: mentoringPost.price,// 공고에서 전달받은 가격 사용
            paymentCard: "신용카드",
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
      );

      const paymentId = response.data.data;

      console.log("MentoringReservation - Pushing to /payment", {
        mentoringDate: selectedSchedule.mentoringDate,
        mentoringTime: selectedSchedule.mentoringTime,
        scheduleId: selectedSchedule.id,
        paymentId: paymentId,
        price: mentoringPost.price,
        userNickname: mentoringPost?.userNickname,
      });

      // 결제 페이지로 이동 및 결제 정보 전달
      history.push({
        pathname: "/payment",
        search: `?mentoringDate=${selectedSchedule.mentoringDate}&mentoringTime=${selectedSchedule.mentoringTime}&scheduleId=${selectedSchedule.id}&paymentId=${paymentId}`,
        state: {
          mentoringDate: selectedSchedule.mentoringDate, // 스케줄 날짜
          mentoringTime: selectedSchedule.mentoringTime, // 스케줄 시간
          scheduleId: selectedSchedule.id, // 스케줄 ID
          paymentId: paymentId, // 결제 ID
          price: mentoringPost.price, // 결제 금액
          userNickname: mentoringPost?.userNickname, // 멘토 닉네임 추가
        },
      });
    } catch (error) {
      console.error("결제 생성 중 오류:", error);
      alert("결제 생성 중 문제가 발생했습니다.");
    }
  };

  if (!mentoringPost) {
    return <div>Loading...</div>;
  }

  return (
      <div className="mentoring-container">
        <div className="mentoring-card">
          <h2 className="mentoring-card-title">{mentoringPost?.title}</h2>
          <div className="mentoring-profile">
            <img
                src={mentoringPost?.mentorProfilePicture
                    || "/default-profile.png"}
                alt="Mentor Profile"
                className="mentoring-profile-img"
            />
            <div className="mentoring-profile-details">
              <p className="mentor-name">{mentoringPost?.userNickname}</p>
              <p>{mentoringPost?.company}</p>
              <p>가격 : {mentoringPost?.price}원</p>
            </div>
          </div>

          <div className="mentoring-schedule">
            <label className="mentoring-schedule-label">결제 가능한 스케줄</label>
            {/* 스케줄이 없을 경우 메시지 표시 */}
            {!schedules.length && (
                <p className="no-schedules">현재 예약 가능한 스케줄이 없습니다.</p>
            )}
            <ul className="mentoring-schedule-list">
              {schedules.map((schedule) => (
                  <li
                      key={schedule.id}
                      className={`mentoring-schedule-item ${
                          selectedSchedule?.id === schedule.id ? "selected" : ""
                      }`}
                      onClick={() => handleScheduleSelect(schedule)}
                  >
                    {schedule.mentoringDate} - {schedule.mentoringTime}
                  </li>
              ))}
            </ul>
          </div>

          {selectedSchedule && (
              <button onClick={handleBookNow} className="mentoring-button">
                신청하기
              </button>
          )}
        </div>
      </div>
  );
};

export default MentoringReservation;
