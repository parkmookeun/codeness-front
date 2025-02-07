import React, { useState, useEffect } from 'react';
import api from '../../../api/axios';
import { useHistory } from 'react-router-dom';
import moment from 'moment';
import '../../../styles/mypage/schedule/UserSchedule.css'

const UserSchedule = () => {
  const [events, setEvents] = useState([
    {
      id: 1,
      title: "멘토링 상담",
      summary: "2025년 2월 멘토링",
      description: "신입 개발자 커리어 상담",
      startTime: "2025-02-10T15:00:00",
      endTime: "2025-02-10T16:00:00"
    },
    {
      id: 2,
      title: "프로젝트 미팅",
      summary: "팀 프로젝트 진행상황 점검",
      description: "스프링 프로젝트 코드 리뷰",
      startTime: "2025-02-15T14:00:00",
      endTime: "2025-02-15T15:30:00"
    },
    {
      id: 3,
      title: "기술 면접 준비",
      summary: "CS 스터디",
      description: "알고리즘/자료구조 복습",
      startTime: "2025-02-20T10:00:00",
      endTime: "2025-02-20T12:00:00"
    }
  ]);
  const [error, setError] = useState(null);
  const [currentMonth, setCurrentMonth] = useState(moment());
  const history = useHistory();

  const weekDays = ['일', '월', '화', '수', '목', '금', '토'];

  useEffect(() => {
    fetchEvents();
  }, [currentMonth]);

  const fetchEvents = async () => {
    const token = localStorage.getItem('jwtToken');
    if (!token) {
      history.push('/login');
      return;
    }

    // API 호출 대신 기존 상태 유지
    try {
      // 테스트를 위해 API 호출 주석 처리
      /*
      const startDate = currentMonth.startOf('month').format('YYYY-MM-DD');
      const endDate = currentMonth.endOf('month').format('YYYY-MM-DD');

      const response = await api.get('/users/schedule', {
        headers: {
          Authorization: `Bearer ${token}`
        },
        params: {
          startDate,
          endDate
        }
      });

      if (response.data?.data) {
        setEvents(response.data.data);
        setError(null);
      }
      */
    } catch (error) {
      if (error.response?.status === 401) {
        setError('소셜 로그인이 필요한 서비스입니다.');
      } else {
        setError('일정을 불러오는데 실패했습니다.');
      }
    }
  };

  const handlePrevMonth = () => setCurrentMonth(currentMonth.clone().subtract(1, 'month'));
  const handleNextMonth = () => setCurrentMonth(currentMonth.clone().add(1, 'month'));

  const generateCalendar = () => {
    const startDay = currentMonth.clone().startOf('month').startOf('week');
    const endDay = currentMonth.clone().endOf('month').endOf('week');
    const days = [];
    let day = startDay.clone();

    while (day.isBefore(endDay)) {
      days.push(day.clone());
      day.add(1, 'day');
    }

    return days;
  };

  return (
      <div className="calendar-container">
        {error === '소셜 로그인이 필요한 서비스입니다.' ? (
            <div className="error-container">
              <p>{error}</p>
              <button className="small-btn" onClick={() => history.push('/login')}>로그인</button>
            </div>
        ) : (
            <>
              <div className="calendar-header">
                <div className="calendar-controls">
                  <button onClick={handlePrevMonth}>&lt;</button>
                  <h2 className="calendar-title">{currentMonth.format('YYYY년 MM월')}</h2>
                  <button onClick={handleNextMonth}>&gt;</button>
                </div>
              </div>

              <div className="calendar-grid">
                {weekDays.map(day => (
                    <div key={day} className="weekday">
                      {day}
                    </div>
                ))}

                {generateCalendar().map(date => {
                  const isCurrentMonth = date.month() === currentMonth.month();
                  const dayEvents = events.filter(event =>
                      moment(event.startTime).format('YYYY-MM-DD') === date.format('YYYY-MM-DD')
                  );

                  return (
                      <div key={date.format('YYYY-MM-DD')}
                           className={`day ${!isCurrentMonth ? 'other-month' : ''}`}>
                        <div className="day-number">{date.format('D')}</div>
                        <div className="event-container">
                          {dayEvents.map(event => (
                              <div key={event.id} className="event" title={event.summary}>
                                <div className="event-title">{event.title}</div>
                                <div className="event-summary">{event.summary}</div>
                                <div className="event-details">
                                  <p>{moment(event.startTime).format('YYYY-MM-DD HH:mm')} ~ {moment(event.endTime).format('HH:mm')}</p>
                                  {event.description && <p>{event.description}</p>}
                                </div>
                              </div>
                          ))}
                        </div>
                      </div>
                  );
                })}
              </div>
            </>
        )}
      </div>
  );
};

export default UserSchedule;