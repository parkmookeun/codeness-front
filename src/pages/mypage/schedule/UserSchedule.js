import React, { useState, useEffect } from 'react';
import api from '../../../api/axios';
import { useHistory } from 'react-router-dom';
import moment from 'moment';
import '../../../styles/mypage/schedule/UserSchedule.css'

const UserSchedule = () => {
  const [events, setEvents] = useState([]);
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

    try {
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
