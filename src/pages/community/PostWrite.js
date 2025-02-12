import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import api from "../../api/axios";

const WritePostPage = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [postType, setPostType] = useState("QUESTION");
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  const history = useHistory();

  const handleSubmit = async () => {
    if (!title || !content) {
      setModalMessage("제목과 내용을 모두 입력해주세요.");
      setShowModal(true);
      return;
    }

    try {
      await api.post("/posts", {
        title,
        content,
        postType,
      });
      setModalMessage("게시글이 등록되었습니다.");
      setShowModal(true);
      setTimeout(() => {
        history.push("/community");
      }, 1500);
    } catch (error) {
      console.error("글 등록 중 오류 발생:", error);
      if (error.response) {
        switch (error.response.status) {
          case 403:
            if (postType === "NOTICE") {
              setModalMessage("공지사항 작성은 관리자만 가능합니다.");
            } else {
              setModalMessage("접근 권한이 없습니다.");
            }
            break;
          case 400:
            setModalMessage("잘못된 요청입니다. 입력값을 확인해주세요.");
            break;
          case 500:
            setModalMessage("서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
            break;
          default:
            setModalMessage("알 수 없는 오류가 발생했습니다.");
            break;
        }
      } else {
        setModalMessage("네트워크 오류가 발생했습니다. 인터넷 연결을 확인해주세요.");
      }
      setShowModal(true);
    }
  };

  const handleCancel = () => {
    history.push("/community");
  };

  const closeModal = () => {
    setShowModal(false);
  };

  return (
      <div className="write-post-page">
        <h1>게시글 작성하기</h1>
        <div className="form-row-custom">
          <div className="form-group">
            <label>제목</label>
            <input
                type="text"
                placeholder="제목을 입력하세요"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>게시판 종류</label>
            <select
                value={postType}
                onChange={(e) => setPostType(e.target.value)}
            >
              <option value="QUESTION">질문 게시판</option>
              <option value="FREE">자유 게시판</option>
              <option value="NOTICE">공지사항</option>
            </select>
          </div>
        </div>
        <div className="form-group">
          <label>내용</label>
          <textarea
              placeholder="내용을 입력하세요"
              value={content}
              onChange={(e) => setContent(e.target.value)}
          />
        </div>
        <div className="button-group">
          <button className="submit-button" onClick={handleSubmit}>
            등록하기
          </button>
          <button className="cancel-button" onClick={handleCancel}>
            취소하기
          </button>
        </div>

        {showModal && (
            <div className="modal-overlay">
              <div className="modal-content">
                <p>{modalMessage}</p>
                <button onClick={closeModal}>닫기</button>
              </div>
            </div>
        )}

        <style jsx>{`
          .write-post-page {
            max-width: 800px;
            margin: 0 auto;
            padding: 40px 20px;
            font-family: Arial, sans-serif;
          }

          h1 {
            font-size: 24px;
            font-weight: bold;
            margin-bottom: 30px;
          }

          .form-row-custom {
            display: flex !important; /* Flexbox 강제 적용 */
            justify-content: space-between;
            gap: 20px;
          }

          .form-group {
            flex: 1;
          }

          .title-group {
            flex: 2; /* 제목 칸을 2배로 확장 */
          }

          .post-type-group {
            flex: 0; /* 게시판 종류 칸을 반으로 축소 */
          }

          label {
            display: block;
            font-size: 16px;
            font-weight: bold;
            margin-bottom: 10px;
          }

          input,
          select,
          textarea {
            width: 100%;
            padding: 10px;
            border: 1px solid #ddd;
            border-radius: 5px;
            font-size: 14px;
          }

          textarea {
            height: 200px;
            resize: none;
          }

          .button-group {
            display: flex;
            justify-content: flex-start;
            gap: 10px;
          }

          .submit-button,
          .cancel-button {
            padding: 10px 20px;
            border: none;
            border-radius: 5px;
            font-size: 16px;
            font-weight: bold;
            cursor: pointer;
            flex: 1; /* 기본 flex 값 */
          }

          .submit-button {
            background-color: #639cdc;
            color: white;
            flex: 5; /* 등록하기 버튼의 너비를 10% 줄임 */
          }

          .submit-button:hover {
            background-color: #0056b3;
          }

          .cancel-button {
            background-color: #6c757d;
            color: white;
            flex: 1.1; /* 취소하기 버튼의 너비를 10% 늘림 */
          }

          .cancel-button:hover {
            background-color: #5a6268;
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
            z-index: 1000;
          }

          .modal-content {
            background: white;
            padding: 20px;
            border-radius: 10px;
            text-align: center;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          }

          .modal-content button {
            margin-top: 10px;
            padding: 10px 20px;
            border: none;
            border-radius: 5px;
            background-color: #639cdc;
            color: white;
            cursor: pointer;
          }
        `}</style>
      </div>
  );
};

export default WritePostPage;
