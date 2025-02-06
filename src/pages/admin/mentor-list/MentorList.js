import React, { useState, useEffect } from 'react';
import api from '../../../api/axios';
import { useHistory } from 'react-router-dom';
import '../../../styles/admin/MentorList.css';

const MentorList = () => {
  const history = useHistory();
  const [mentors, setMentors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const fetchMentors = async () => {
    try {
      const token = localStorage.getItem('jwtToken');
      const response = await api.get(`/admin/mentors?pageNumber=${currentPage}&pageSize=10`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const newMentors = response.data.data.content;
      setMentors(prev => currentPage === 0 ? newMentors : [...prev, ...newMentors]);
      setHasMore(newMentors.length === 10);
      setLoading(false);
    } catch (error) {
      setError('멘토 목록을 불러오는데 실패했습니다.');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMentors();
  }, [currentPage]);

  const loadMore = () => {
    setCurrentPage(prev => prev + 1);
  };

  const handleCardClick = (mentorId) => {
    history.push(`/admin/mentor-list/${mentorId}`);
  };

  return (
      <div className="mentor-list-container">
        <h2>멘토 목록</h2>
        {loading && <div className="loading">로딩중...</div>}
        {error && <div className="error">{error}</div>}

        <div className="mentor-grid">
          {mentors.map((mentor) => (
              <div
                  key={mentor.userId}
                  className="mentor-card"
                  onClick={() => handleCardClick(mentor.userId)}
              >
                <h3>{mentor.name}</h3>
              </div>
          ))}
        </div>

        {hasMore && !loading && (
            <button onClick={loadMore} className="load-more">
              더 보기
            </button>
        )}
      </div>
  );
};

export default MentorList;