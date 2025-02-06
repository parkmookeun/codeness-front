import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom"; // React Router v5 사용
import api from "../../api/axios";
import Sidebar from "../../components/sidebar/Sidebar";
import Pagination from "../../components/Pagenation";
import "../../styles/mentoring/MentoringPostSearch.css";

const MentoringPostSearchPage = () => {
  const history = useHistory(); // 페이지 이동을 위한 useHistory 훅

  // 상태 관리
  const [posts, setPosts] = useState([]); // 멘토링 공고 리스트
  const [currentPage, setCurrentPage] = useState(1); // 현재 페이지 번호
  const [totalPages, setTotalPages] = useState(1); // 전체 페이지 수
  const [selectedField, setSelectedField] = useState("전체"); // 선택된 분야 필터
  const [searchInput, setSearchInput] = useState(""); // 검색 입력값
  const [searchCategory, setSearchCategory] = useState("title"); // 검색 기준 (제목, 닉네임 등)
  const [searchParams, setSearchParams] = useState({
    keyword: "",
    field: "",
    category: "title",
  });
  const [error, setError] = useState(null); // 에러 메시지 상태

  /**
   * 상세 페이지로 이동
   * @param {number} mentoringPostId - 멘토링 공고 ID
   */
  const handlePostItemClick = (mentoringPostId) => {
    console.log(`Navigating to mentoring post: ${mentoringPostId}`);
    history.push(`/mentoring/${mentoringPostId}`);// 멘토링 공고 상세 페이지로 이동
  };

  /**
   * 멘토링 공고 작성 페이지로 이동
   */
  const handleMentoringPostForm = () => {
    history.push("/mentoring-post-form"); // 공고 작성 페이지로 이동
  };

  /**
   * 검색 입력값 변경
   */
  const handleInputChange = (e) => {
    setSearchInput(e.target.value.trim());
  };

  /**
   * 검색 버튼 클릭
   */
  const handleSearchClick = () => {
    setSearchParams({
      keyword: searchInput,
      field: selectedField !== "전체" ? selectedField : "",
      category: searchCategory,
    });
    setCurrentPage(1); // 검색 시 페이지를 1로 초기화
  };

  /**
   * 검색 기준 드롭다운 변경
   */
  const handleCategoryChange = (e) => {
    setSearchCategory(e.target.value);
  };

  /**
   * 사이드바 필터 선택
   */
  const handleFieldSelect = (field) => {
    setSelectedField(field);
    if (field === "전체") {
      setSearchParams({
        keyword: "",
        field: "",
        category: "title",
      });
    } else {
      setSearchParams((prev) => ({
        ...prev,
        field,
      }));
    }
    setCurrentPage(1); // 필터 선택 시 페이지 초기화
  };

  /**
   * 데이터 가져오기
   */
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const params = {
          pageNumber: currentPage - 1,
          pageSize: 10,
          field: searchParams.field,
          [searchParams.category]: searchParams.keyword,
        };

        const response = await api.get("/mentoring", { params });

        setPosts(response.data.data.content);
        setTotalPages(response.data.data.totalPages);
        setError(null);
      } catch (error) {
        console.error("멘토링 공고를 가져오는 중 오류 발생:", error);
        setError("멘토링 공고를 불러오는 중 문제가 발생했습니다. 다시 시도해주세요.");
      }
    };

    fetchPosts();
  }, [currentPage, searchParams]);

  return (
      <div className="mentoring-page">
        {/* 검색 영역 */}
        <div className="search-container">
          <select value={searchCategory} onChange={handleCategoryChange} className="search-category">
            <option value="title">제목</option>
            <option value="nickname">멘토 닉네임</option>
          </select>
          <input
              type="text"
              placeholder={`${
                  searchCategory === "title" ? "제목으로 검색" : "닉네임으로 검색"
              }`}
              value={searchInput}
              onChange={handleInputChange}
              className="search-input"
          />
          <button onClick={handleSearchClick} className="search-button">
            검색
          </button>
          <button className="upload-button" onClick={handleMentoringPostForm}>
            멘토 공고 올리기
          </button>
        </div>

        {/* 사이드바와 메인 콘텐츠 */}
        <div className="main-content">
          <Sidebar selectedField={selectedField} setSelectedField={handleFieldSelect} />

          <div className="post-container">
            {/* 에러 메시지 */}
            {error && <p className="error-message">{error}</p>}

            {/* 공고 리스트 */}
            <div className="post-list">
              {posts.map((post) => (
                  <div
                      key={post.mentoringPostId}
                      className="post-item"
                      onClick={() => handlePostItemClick(post.mentoringPostId)}
                  >
                    <h4>{post.title}</h4>
                    <p>분야: {post.field}</p>
                    <p>멘토: {post.userNickname}</p>
                    <p>평점: {post.starRating.toFixed(1)}</p>
                  </div>
              ))}
            </div>

            {/* 페이지네이션 */}
            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
            />
          </div>
        </div>
      </div>
  );
};

export default MentoringPostSearchPage;
