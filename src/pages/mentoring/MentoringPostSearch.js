import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom"; // React Router v5 사용
import api from "../../api/axios";
import Sidebar from "../../components/sidebar/Sidebar";
import Pagination from "../../components/Pagenation";
import "../../styles/mentoring/MentoringPostSearch.css";

const MentoringPostSearchPage = () => {
  const history = useHistory();

  // ✅ 상태 관리
  const [posts, setPosts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedField, setSelectedField] = useState("전체"); // ✅ 필드 선택 상태
  const [searchInput, setSearchInput] = useState("");
  const [searchCategory, setSearchCategory] = useState("title");
  const [searchParams, setSearchParams] = useState({
    keyword: "",
    field: null, // ✅ 기본값을 null로 설정하여 전체 조회
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
   * 사이드바에서 분야 선택 시 필터링
   */
  const handleFieldSelect = (field) => {
    console.log("🔍 선택한 필드:", field); // ✅ 디버깅용 로그

    setSelectedField(field);

    setSearchParams((prev) => ({
      ...prev,
      field: field === "전체" ? null : field, // ✅ 전체 선택 시 null로 설정
    }));

    setCurrentPage(1);
  };

  /**
   * 데이터 가져오기
   */
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        let params = {
          pageNumber: currentPage - 1,
          pageSize: 10,
          [searchParams.category]: searchParams.keyword,
        };

        // ✅ 필터링 값이 존재하는 경우만 API 요청에 포함
        if (searchParams.field) {
          params.field = searchParams.field;
        }

        console.log("📡 요청하는 API 파라미터:", params); // ✅ API 요청 로그 확인

        const response = await api.get("/mentoring", { params });

        console.log("📩 API 응답 데이터:", response.data); // ✅ 응답 데이터 확인

        setPosts(response.data.data.content);
        setTotalPages(response.data.data.totalPages);
        setError(null);
      } catch (error) {
        console.error("❌ 멘토링 공고를 가져오는 중 오류 발생:", error);
        setError("멘토링 공고를 불러오는 중 문제가 발생했습니다. 다시 시도해주세요.");
      }
    };

    fetchPosts();
  }, [currentPage, searchParams]); // ✅ 필터가 변경될 때마다 API 요청

  return (
      <div className="mentoring-page">
        {/* ✅ 검색 및 버튼 컨테이너 */}
        <div className="search-container">
          <select value={searchCategory} onChange={(e) => setSearchCategory(e.target.value)} className="search-category">
            <option value="title">제목</option>
            <option value="nickname">멘토 닉네임</option>
          </select>
          <input
              type="text"
              placeholder={searchCategory === "title" ? "제목으로 검색" : "닉네임으로 검색"}
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value.trim())}
              className="search-input"
          />
          <button
              onClick={() => {
                setSearchParams((prev) => ({
                  ...prev,
                  keyword: searchInput,
                }));
                setCurrentPage(1);
              }}
              className="search-button"
          >
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
            {error && <p className="error-message">{error}</p>}

            <div className="post-list">
              {posts.map((post) => (
                  <div key={post.mentoringPostId} className="post-item" onClick={() => history.push(`/mentoring/${post.mentoringPostId}`)}>
                    <h4>{post.title}</h4>
                    <p>분야: {post.field}</p>
                    <p>멘토: {post.userNickname}</p>
                    <p>평점: {post.starRating.toFixed(1)}</p>
                  </div>
              ))}
            </div>

            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
          </div>
        </div>
      </div>
  );
};

export default MentoringPostSearchPage;
