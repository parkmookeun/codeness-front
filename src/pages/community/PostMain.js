import React, { useState, useEffect, useRef } from "react";
import api from "../../api/axios";
import { Link, useHistory } from "react-router-dom";
import Pagination from "../../components/Pagenation";

const CommunityPage = () => {
  const [posts, setPosts] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [filter, setFilter] = useState("제목");
  const [currentTab, setCurrentTab] = useState("전체");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [lastSearchParams, setLastSearchParams] = useState(null);

  const history = useHistory();

  const pageSize = 10; // 페이지 크기 설정
  const isFetching = useRef(false); // 중복 요청 방지 플래그

  const postTypeMapping = {
    전체: null,
    "질문 게시판": "QUESTION",
    "자유 게시판": "FREE",
    공지사항: "NOTICE",
  };
  // Axios 기본 설정
  useEffect(() => {
    const token = localStorage.getItem("jwtToken");
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      axios.defaults.headers.common["Access-Control-Allow-Origin"] = window.location.protocol + '//' + window.location.hostname;
    }
    axios.defaults.baseURL = process.env.REACT_APP_BACKEND_URL;
  }, []);

  // 데이터 요청 함수
  const fetchPosts = async (params = {}) => {
    if (isFetching.current) return; // 요청 중이라면 실행하지 않음
    isFetching.current = true;
    try {
      const response = await api.get("/posts", { params });
      setPosts(response.data.data.content || []);
      setTotalPages(response.data.data.totalPages || 1);
      setCurrentPage(params.pageNumber + 1); // 백엔드의 pageNumber(0-based)를 1-based로 변환
    } catch (error) {
      console.error("Failed to fetch posts:", error);
      alert("데이터를 가져오는 중 오류가 발생했습니다.");
    } finally {
      isFetching.current = false; // 요청 종료 후 플래그 해제
    }
  };

  // 초기 데이터 로드 및 페이지 변경
  useEffect(() => {
    const params = lastSearchParams || {
      postType: postTypeMapping[currentTab] || null,
      pageNumber: currentPage - 1, // 0-based 페이지 번호로 변환
      size: pageSize, // 페이지 크기
    };

    fetchPosts(params);
  }, [currentTab, currentPage, lastSearchParams]);

  // 검색 실행
  const handleSearch = () => {
    setCurrentPage(1); // 검색 시 항상 첫 페이지로 이동
    const params = {
      postType: postTypeMapping[currentTab] || null,
      pageNumber: 0, // 검색 시 항상 첫 페이지로 시작
      size: pageSize,
    };

    if (filter === "제목") {
      params.keyword = searchKeyword;
    } else if (filter === "작성자") {
      params.writer = searchKeyword;
    }

    setLastSearchParams(params); // 마지막 검색 조건 저장
    fetchPosts(params); // 검색 버튼 클릭 시 서버 요청 실행
  };

  const handleTabChange = (tab) => {
    setCurrentTab(tab);
    setSearchKeyword(""); // 탭 변경 시 검색어 초기화
    setCurrentPage(1); // 탭 변경 시 페이지를 1로 초기화
    setLastSearchParams(null); // 검색 조건 초기화
  };

  const handlePageChange = (page) => {
    setCurrentPage(page); // 페이지 상태 업데이트
  };

  const goToWritePage = () => {
    history.push("/writePost");
  };

  const goToPostDetail = (postId) => {
    history.push(`/posts/${postId}`); // postId를 포함하여 상세 페이지로 이동
  };

  return (
      <div className="community-page">
        <div className="main-content">
          {/* 사이드바 */}
          <aside className="sidebar">
            {["전체", "질문 게시판", "자유 게시판", "공지사항"].map((tab) => (
                <button
                    key={tab}
                    className={`tab-button ${currentTab === tab ? "active" : ""}`}
                    onClick={() => handleTabChange(tab)}
                >
                  {tab}
                </button>
            ))}
          </aside>

          {/* 콘텐츠 영역 */}
          <section className="content">
            {/* 검색 바 */}
            <div className="search-bar">
              <select
                  className="filter"
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
              >
                <option>제목</option>
                <option>작성자</option>
              </select>
              <input
                  type="text"
                  className="search-input"
                  placeholder={filter === "제목" ? "제목을 입력하세요" : "작성자를 입력하세요"}
                  value={searchKeyword}
                  onChange={(e) => setSearchKeyword(e.target.value)} // 상태만 업데이트
              />
              <button className="search-button" onClick={handleSearch}>
                검색
              </button>
              <button className="write-button" onClick={goToWritePage}>
                글쓰기
              </button>
            </div>

            {/* 게시글 목록 */}
            <table className="post-table">
              <thead>
              <tr>
                <th>제목</th>
                <th>작성자</th>
                <th>조회수</th>
                <th>작성일</th>
              </tr>
              </thead>
              <tbody>
              {posts.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="no-posts">
                      게시글이 없습니다.
                    </td>
                  </tr>
              ) : (
                  posts.map((post) => (
                      <tr key={post.id}>
                        <td
                            className="clickable-title"
                            onClick={() => goToPostDetail(post.id)}
                        >
                          {post.title}
                        </td>
                        <td>{post.writer}</td>
                        <td>{post.view}</td>
                        <td>{new Date(post.createdAt).toLocaleDateString()}</td>
                      </tr>
                  ))
              )}
              </tbody>
            </table>

            {/* 페이지네이션 */}
            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
            />
          </section>
        </div>

        <style jsx>{`
          .community-page {
            font-family: Arial, sans-serif;
            display: flex;
            flex-direction: column;
          }

          .main-content {
            display: flex;
            padding: 20px;
          }

          .sidebar {
            width: 200px;
            border-right: 1px solid #ddd;
            padding-right: 20px;
          }

          .tab-button {
            display: block;
            width: 100%;
            padding: 10px;
            margin-bottom: 10px;
            text-align: left;
            background-color: #f8f9fa;
            border: 1px solid #ddd;
            border-radius: 5px;
            cursor: pointer;
            color: black;
          }

          .tab-button.active {
            background-color: #007bff;
            color: white;
          }

          .content {
            flex: 1;
            padding-left: 20px;
          }

          .search-bar {
            display: flex;
            align-items: center;
            margin-bottom: 20px;
          }

          .filter {
            padding: 5px 8px;
            margin-right: 10px;
            border: 1px solid #ddd;
            border-radius: 5px;
            height: 40px;
            width: 120px;
            font-size: 14px;
          }

          .search-input {
            flex: 1;
            padding: 8px 12px;
            border: 1px solid #ddd;
            border-radius: 5px;
            height: 40px;
            font-size: 14px;
          }

          .search-button {
            padding: 0;
            margin-left: 8px;
            background-color: #007bff;
            color: white;
            border: none;
            border-radius: 10px;
            height: 40px;
            width: 120px;
            font-size: 14px;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
          }

          .write-button {
            padding: 0;
            margin-left: 10px;
            background-color: #007bff;
            color: white;
            border: none;
            border-radius: 10px;
            height: 40px;
            width: 100px;
            font-size: 14px;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
          }

          .post-table {
            width: 100%;
            border-collapse: collapse;
          }

          .post-table th,
          .post-table td {
            border: 1px solid #ddd;
            padding: 10px;
            text-align: left;
          }

          .page-button {
            padding: 10px 15px;
            margin: 0 5px;
            background-color: #007bff !important;
            color: white !important;
            border: none !important;
            border-radius: 10px !important;
            cursor: pointer;
            font-weight: bold;
            font-size: 14px;
          }

          .clickable-title {
            cursor: pointer;
            text-decoration: none;
            transition: color 0.3s;
          }

          .clickable-title:hover {
            color: #0056b3;
          }

          .page-button {
            padding: 10px 15px;
            margin: 0 5px;
            background-color: #007bff !important;
            color: white !important;
            border: none !important;
            border-radius: 10px !important;
            cursor: pointer;
            font-weight: bold;
            font-size: 14px;
          }
        `}</style>
      </div>
  );
};

export default CommunityPage;
