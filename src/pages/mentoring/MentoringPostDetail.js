import React, {useState, useEffect} from "react";
import {useParams, useHistory} from "react-router-dom"; // useHistory 추가
import api from "../../api/axios";
import Pagination from "../../components/Pagenation";
import "../../styles/mentoring/MentoringPostDetail.css";

const MentoringPostDetail = () => {
  const {mentoringPostId} = useParams(); // URL 파라미터에서 mentoringPostId 가져오기
  const [mentoringPost, setMentoringPost] = useState(null); // 공고 상세 데이터
  const [reviews, setReviews] = useState([]); // 리뷰 데이터
  const [currentPage, setCurrentPage] = useState(1); // 현재 리뷰 페이지
  const reviewsPerPage = 10; // 페이지당 리뷰 수
  const [totalPages, setTotalPages] = useState(1); // 전체 페이지 수
  const history = useHistory(); // 페이지 이동을 위한 useHistory 추가

  //경로 변수 받아오기
  // const mentoringPostId = props.match.params.mentoringPostId;

  // 상세 공고 및 리뷰 데이터 가져오기
  useEffect(() => {
    const fetchMentoringPostDetail = async () => {
      try {
        console.log(` 멘토링 상세 페이지 : ${mentoringPostId}`);
        const response = await api.get(`/mentoring/${mentoringPostId}`);
        setMentoringPost(response.data.data);
      } catch (error) {
        console.error("Error fetching mentoring post detail:", error);
      }
    };

    const fetchReviews = async () => {
      try {
        const response = await api.get(
            `/mentoring/${mentoringPostId}/reviews`);
        setReviews(response.data.data.content);
      } catch (error) {
        console.error("Error fetching reviews:", error);
      }
    };

    fetchMentoringPostDetail();
    fetchReviews();
  }, [mentoringPostId]);

  const handleApplyMentoring = () => {
    // 신청 페이지로 이동
    history.push(`/mentoring/${mentoringPostId}/mentoring-reservation`);
  };

  if (!mentoringPost) {
    return <div>Loading...</div>;
  }

  return (
      <div className="mentoring-page">
        {/* 공고 상세 섹션 */}
        <div className="section mentor-profile">
          <img
              src={mentoringPost.mentorProfilePicture}
              alt="Mentor Profile"
              className="mentor-image"
          />
          <div className="mentor-details">
            <h2>{mentoringPost.userNickname}</h2>
            <h1>{mentoringPost.title}</h1>
            <span className="post-data">{mentoringPost.company}</span>
            <span className="post-data"><strong>Field:</strong> {mentoringPost.field}</span>
            <span className="post-data"><strong>Career:</strong> {mentoringPost.career} years</span>
            <span className="post-data"><strong>Region:</strong> {mentoringPost.region}</span>
            <span className="post-data"><strong>Price:</strong> {mentoringPost.price} per hour</span>
            <span className="post-data"><strong>Description:</strong> {mentoringPost.description}</span>
            <span className="post-data"><strong>Average Rating:</strong>
              <span className="star-rating">⭐ {mentoringPost.starRating}</span>
            </span>
          </div>
        </div>

        {/* 리뷰 섹션 */}
        <div className="section reviews">
          <h2>Reviews</h2>
          {reviews && reviews.length > 0 ? (
              reviews.map((review) => (
                  <div className="review" key={review.id}>
                    <p><strong>Rating:</strong> ⭐ {review.starRating}</p>
                    <p>{review.content}</p>
                    <p className="review-date">Created: {review.createdAt}</p>
                  </div>
              ))
          ) : (
              <p>No reviews available.</p>
          )}

          {/* 페이지네이션 */}
          <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
          />
        </div>

        {/* 멘토링 신청 버튼 */}
        <button className="apply-button" onClick={handleApplyMentoring}>
          멘토링 신청
        </button>
      </div>
  );
};

export default MentoringPostDetail;
