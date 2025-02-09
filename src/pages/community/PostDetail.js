import React, {useState, useEffect} from "react";
import {useParams, useHistory} from "react-router-dom";
import api from "../../api/axios";
import { DEFAULT_PROFILE_IMAGE } from '../../assets/constants';

const PostDetailPage = () => {
  const {postId} = useParams();
  const history = useHistory();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [isAuthor, setIsAuthor] = useState(false);
  const [loading, setLoading] = useState(true);
  const [modalConfirm, setModalConfirm] = useState(null); // 모달의 확인 버튼 핸들러
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [commentId, setCommentId] = useState(null); // 수정 중인 댓글 ID
  const [editContent, setEditContent] = useState(""); // 수정 중인 댓글 내용
  // JWT 토큰 검증 및 디코딩 함수
  const validateToken = (token) => {
    if (!token) {
      return {isValid: false, userId: null};
    }
    try {
      const parts = token.split(".");
      if (parts.length !== 3) {
        return {isValid: false, userId: null};
      }
      const payload = JSON.parse(atob(parts[1]));
      return {
        isValid: !(payload.exp && payload.exp < Date.now() / 1000),
        userId: payload.userId,
      };
    } catch (error) {
      console.error("Token validation error:", error);
      return {isValid: false, userId: null};
    }
  };
  // 게시글 상세 정보 가져오기
  const fetchPostDetails = async () => {
    try {
      const response = await api.get(`/posts/${postId}`);
      setPost(response.data.data);
      // JWT 토큰 검증 및 작성자 확인
      const token = localStorage.getItem("jwtToken");
      if (token) {
        const {isValid, userId} = validateToken(token);
        if (isValid) {
          setIsAuthor(response.data.data.userId === userId); // 작성자 여부 확인
        }
      }
    } catch (error) {
      setModalMessage("게시글 데이터를 가져오는 중 오류가 발생했습니다.");
      setShowModal(true);
    } finally {
      setLoading(false);
    }
  };
  // 댓글 목록 가져오기
  const fetchComments = async () => {
    setCommentsLoading(true);
    try {
      const response = await api.get(`/posts/${postId}/comments`);
      const token = localStorage.getItem("jwtToken");
      const {isValid, userId} = validateToken(token);
      const updatedComments = response.data.data.content.map((comment) => ({
        ...comment,
        isAuthor: isValid && comment.userId === userId, // 댓글 작성자 여부 확인
      }));
      setComments(updatedComments);
    } catch (error) {
      setModalMessage("댓글 데이터를 가져오는 중 오류가 발생했습니다.");
      setShowModal(true);
    } finally {
      setCommentsLoading(false);
    }
  };
  // 댓글 수정
  const handleEditComment = (comment) => {
    if (!comment || !comment.id) {
      setModalMessage("댓글 ID가 유효하지 않습니다.");
      setShowModal(true);
      return;
    }
    setCommentId(comment.id); // 수정할 댓글 ID 설정
    setEditContent(comment.content); // 기존 내용 설정
  };
  // 댓글 수정 완료
  const submitEditComment = async () => {
    if (!editContent.trim()) {
      setModalMessage("수정할 내용을 입력해주세요.");
      setShowModal(true);
      return;
    }
    try {
      const token = localStorage.getItem("jwtToken");
      await api.patch(
          `/comments/${commentId}`, // 댓글 ID는 경로 변수로 전송
          {content: editContent}, // 수정할 내용은 Body로 전송
          {headers: {Authorization: `Bearer ${token}`}}
      );
      // 댓글 목록을 다시 가져오기
      await fetchComments();
      setModalMessage("댓글이 수정되었습니다.");
      setShowModal(true);
      setCommentId(null); // 수정 상태 초기화
      setEditContent("");
    } catch (error) {
      setModalMessage("댓글 수정 중 오류가 발생했습니다.");
      setShowModal(true);
    }
  };
  // 댓글 수정 취소
  const cancelEditComment = () => {
    setCommentId(null); // 수정 상태 초기화
    setEditContent("");
  };
  // 댓글 삭제
  const handleDeleteComment = (commentId) => {
    setModalMessage("정말로 이 댓글을 삭제하시겠습니까?");
    setModalConfirm(() => async () => {
      try {
        const token = localStorage.getItem("jwtToken");
        await api.delete(`/comments/${commentId}`, {
          headers: {Authorization: `Bearer ${token}`},
        });
        setModalMessage("댓글이 삭제되었습니다.");
        setShowModal(true);
        setModalConfirm(null);
        fetchComments(); // 댓글 목록 갱신
      } catch (error) {
        setModalMessage("댓글 삭제 중 오류가 발생했습니다.");
        setShowModal(true);
      }
    });
    setShowModal(true);
  };
  // 게시글 삭제
  const handleDelete = async () => {
    setModalMessage("정말로 삭제하시겠습니까?");
    setModalConfirm(() => async () => {
      try {
        await api.delete(`/posts/${postId}`);
        setModalMessage("게시글이 삭제되었습니다.");
        setModalConfirm(null); // 확인 후 삭제 로직 해제
        setShowModal(true);
        history.push("/community");
      } catch (error) {
        setModalMessage("게시글 삭제 중 오류가 발생했습니다.");
        setShowModal(true);
      }
    });
    setShowModal(true);
  };
  // 게시글 수정
  const handleEdit = () => {
    history.push(`/posts/${postId}/update`);
  };
  // 댓글 등록
  const handleCommentSubmit = async () => {
    if (!newComment.trim()) {
      setModalMessage("댓글을 입력해주세요.");
      setShowModal(true);
      return;
    }
    try {
      const token = localStorage.getItem("jwtToken");
      await api.post(
          `/posts/${postId}/comments`,
          {content: newComment},
          {headers: {Authorization: `Bearer ${token}`}}
      );
      setNewComment("");
      fetchComments();
      setModalMessage("댓글이 등록되었습니다.");
      setShowModal(true);
    } catch (error) {
      setModalMessage("댓글 등록 중 오류가 발생했습니다.");
      setShowModal(true);
    }
  };
  // 모달 닫기
  const closeModal = () => {
    setShowModal(false);
    setModalConfirm(null); // 확인 핸들러 초기화
  };
  useEffect(() => {
    fetchPostDetails();
    // 댓글 데이터는 게시글 수정 페이지가 아닌 경우에만 가져오기
    if (window.location.pathname === `/posts/${postId}`) {
      fetchComments();
    }
  }, [postId]);
  if (loading) {
    return <div>로딩 중...</div>;
  }
  return (
      <div className="post-detail-page">
        {post ? (
            <div className="post-container">
              <h1>{post.title}</h1>
              <div className="post-meta">
                <div className="writer-info">
                  <img
                      src={post.writerProfileUrl
                          || DEFAULT_PROFILE_IMAGE}
                      alt="프로필"
                      style={{ width: 30, height: 30, borderRadius: '50%', flexShrink: 0 }}
                      className="profile-img"
                  />
                  <span>{post.writer}</span>
                </div>
                <span>조회수: {post.view}</span>
                <span>작성일(수정일): {new Date(
                    post.modifiedAt).toLocaleDateString()}</span>
              </div>
              <div className="post-content">{post.content}</div>
              {isAuthor && (
                  <div className="post-actions">
                    <button onClick={handleEdit}>수정</button>
                    <button onClick={handleDelete}>삭제</button>
                  </div>
              )}
            </div>
        ) : (
            <p>게시글을 불러오는 중입니다...</p>
        )}
        <div className="comments-section">
          <h2>댓글</h2>
          {commentsLoading ? (
              <p>댓글을 불러오는 중입니다...</p>
          ) : comments.length === 0 ? (
              <p>댓글이 없습니다.</p>
          ) : (
              comments.map((comment) => (
                  <div key={comment.id} className="comment">
                    <div className="comment-header">
                      <img
                          src={comment.writerProfileUrl
                              || DEFAULT_PROFILE_IMAGE}
                          alt="프로필"
                          style={{ width: 30, height: 30, borderRadius: '50%', flexShrink: 0 }}
                          className="profile-img"
                      />
                      <span>{comment.writer}</span>
                      <span>{new Date(
                          comment.createdAt).toLocaleDateString()}</span>
                    </div>
                    {commentId === comment.id ? ( // 수정 중인 댓글인지 확인
                        <>
            <textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
            />
                          <button onClick={submitEditComment}>수정 완료</button>
                          <button onClick={cancelEditComment}>취소</button>
                        </>
                    ) : (
                        <p>{comment.content}</p>
                    )}
                    {comment.isAuthor && (
                        <div className="comment-actions">
                          <button
                              onClick={() => handleEditComment(comment)}>수정
                          </button>
                          <button
                              onClick={() => handleDeleteComment(
                                  comment.id)}>삭제
                          </button>
                        </div>
                    )}
                    <hr/>
                  </div>
              ))
          )}
          <textarea
              placeholder="댓글을 입력하세요."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
          />
          <button onClick={handleCommentSubmit}>댓글 등록</button>
        </div>
        <button onClick={() => history.push("/community")}>글 목록으로</button>
        {showModal && (
            <div className="modal-overlay">
              <div className="modal-content">
                <p>{modalMessage}</p>
                <div className="modal-buttons">
                  {modalConfirm ? (
                      <>
                        <button
                            onClick={() => {
                              modalConfirm(); // 확인 버튼 클릭 시 실행
                              closeModal(); // 모달 닫기
                            }}
                        >
                          확인
                        </button>
                        <button onClick={closeModal}>취소</button>
                      </>
                  ) : (
                      <button onClick={closeModal}>닫기</button>
                  )}
                </div>
              </div>
            </div>
        )}
        <style jsx>{`
          .post-detail-page {
            font-family: Arial, sans-serif;
            padding: 20px;
          }
          .post-container {
            border: 1px solid #ddd;
            border-radius: 5px;
            padding: 20px;
            margin-bottom: 20px;
          }
          .post-header {
            margin-bottom: 20px;
          }
          .post-meta span {
            margin-right: 30px;
            color: gray;
          }
          .post-content {
            margin-top: 60px;
            font-size: 16px;
            line-height: 1.5;
          }
          .comment-header {
            display: flex;
            justify-content: space-between;
            font-size: 14px;
          }
          .comment-actions {
            margin-top: 10px;
          }
          .comments-section {
            border: 1px solid #ddd;
            border-radius: 5px;
            padding: 20px;
          }
          .comments-list .comment {
            border-bottom: 1px solid #ddd;
            padding: 10px 0;
          }
          .comment-meta span {
            margin-right: 10px;
            font-size: 12px;
            color: gray;
          }
          .comment-form textarea {
            width: 100%;
            height: 80px;
            padding: 10px;
            border: 1px solid #ddd;
            border-radius: 5px;
            margin-top: 10px;
            margin-bottom: 10px;
          }
          .comment-form button {
            background-color: #007bff;
            color: white;
            border: none;
            padding: 10px 15px;
            border-radius: 5px;
            cursor: pointer;
          }
          .comment-form button:hover {
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
            margin: 0 10px;
            padding: 10px 20px;
            cursor: pointer;
            border: none;
            border-radius: 5px;
          }
        `}</style>
      </div>
  );
};
export default PostDetailPage;
