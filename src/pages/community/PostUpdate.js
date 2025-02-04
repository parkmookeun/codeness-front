import React, { useState, useEffect } from "react";
import { useParams, useHistory } from "react-router-dom";
import axios from "axios";

const PostUpdatePage = () => {
  const { postId } = useParams(); // URL에서 postId를 가져옴
  const history = useHistory();
  const [post, setPost] = useState(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false); // 모달 표시 상태
  const [modalMessage, setModalMessage] = useState(""); // 모달 메시지

  // Axios 기본 설정
  useEffect(() => {
    axios.defaults.baseURL = process.env.REACT_APP_BACKEND_URL;
  }, []);

  // 게시글 상세 정보 가져오기
  const fetchPostDetails = async () => {
    try {
      const response = await axios.get(`/posts/${postId}`);
      const fetchedPost = response.data.data;
      setPost(fetchedPost);
      setTitle(fetchedPost.title);
      setContent(fetchedPost.content);
    } catch (error) {
      setModalMessage("게시글 정보를 가져오는 중 오류가 발생했습니다.");
      setShowModal(true);
    } finally {
      setLoading(false);
    }
  };

  // 게시글 수정 요청
  const handleUpdate = async () => {
    if (!title.trim() || !content.trim()) {
      setModalMessage("제목과 내용을 모두 입력해주세요.");
      setShowModal(true);
      return;
    }

    try {
      await axios.patch(`/posts/${postId}`, {
        title,
        content,
      });
      setModalMessage("게시글이 성공적으로 수정되었습니다.");
      setShowModal(true);
    } catch (error) {
      setModalMessage("게시글 수정 중 오류가 발생했습니다.");
      setShowModal(true);
    }
  };

  // 모달 닫기 및 페이지 이동
  const closeModal = () => {
    setShowModal(false);
    if (modalMessage === "게시글이 성공적으로 수정되었습니다.") {
      history.push(`/posts/${postId}`); // 수정 성공 시 상세 페이지로 이동
    }
  };

  useEffect(() => {
    fetchPostDetails();
  }, [postId]);

  if (loading) {
    return <div>로딩 중...</div>;
  }

  return (
      <div className="post-update-page">
        <h1>게시글 수정</h1>
        {post ? (
            <div>
              <label>
                제목:
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="제목을 입력하세요"
                />
              </label>
              <label>
                내용:
                <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="내용을 입력하세요"
                />
              </label>
              <button onClick={handleUpdate}>수정 완료</button>
              <button onClick={() => history.goBack()}>취소</button>
            </div>
        ) : (
            <p>게시글을 불러오는 중입니다...</p>
        )}

        {showModal && (
            <div className="modal-overlay">
              <div className="modal-content">
                <p>{modalMessage}</p>
                <div className="modal-buttons">
                  <button onClick={closeModal}>확인</button>
                </div>
              </div>
            </div>
        )}

        <style jsx>{`
          .post-update-page {
            font-family: Arial, sans-serif;
            padding: 20px;
          }

          label {
            display: block;
            margin-bottom: 10px;
          }

          input,
          textarea {
            width: 100%;
            padding: 10px;
            margin-bottom: 20px;
            border: 1px solid #ddd;
            border-radius: 5px;
          }

          button {
            margin-right: 10px;
            padding: 10px 20px;
            background-color: #007bff;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
          }

          button:hover {
            background-color: #0056b3;
          }

          .modal-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.5);
            display: flex;
            justify-content: center;
            align-items: center;
          }

          .modal-content {
            background: white;
            padding: 20px;
            border-radius: 10px;
            text-align: center;
            max-width: 400px;
          }

          .modal-buttons {
            margin-top: 20px;
          }

          .modal-buttons button {
            padding: 10px 20px;
            cursor: pointer;
            border: none;
            border-radius: 5px;
            background-color: #007bff;
            color: white;
          }

          .modal-buttons button:hover {
            background-color: #0056b3;
          }
        `}</style>
      </div>
  );
};

export default PostUpdatePage;
