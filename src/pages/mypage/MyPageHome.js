// AdminMyPageHome.js
import React, {useState, useEffect} from 'react';
import MyPage from './profile/MyPage';
import UserSchedule from "./schedule/UserSchedule";
import DeleteUser from "./delete-user/DeleteUser";
import MentorRequestList from "./mentor-request/MentorRequestList";
import {useHistory} from 'react-router-dom';
import ChatLayout from './chat/ChatLayout';
import MyMentoring from './my-mentoring/MyMentoring';
import PaymentHistoryForMentee from "./payment-history/PaymentHistoryForMentee";
import PaymentHistoryDetail from "./payment-history/PaymentHistoryDetail";
import PaymentHistoryForMentor from './payment-history/mentor/PaymentHistoryForMentor';
import WriteView from './review/WriteReview';
import ViewReview from './review/ViewReview';
import { useLocation } from 'react-router-dom';
import MentorSettlementDetail from './payment-history/mentor/MentorSettlementDetail';
import UserScheduleDummy from "./schedule/UserScheduleDummy";

const MyPageHome = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const history = useHistory();
  const [selectedPaymentHistoryId, setSelectedPaymentHistoryId] = useState(null); // 선택된 결제 내역 ID 관리
  const location = useLocation();
  const token = localStorage.getItem('jwtToken');
  // URL의 패턴을 확인하기 위한 pathname
  const pathname = location.pathname;
  let userRole = null;

  const parseJwt = (token) => {

    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.role;

    };

  if (token) {
    userRole = parseJwt(token);        
  }

  useEffect(() => {
    console.log('Location state:', location.state);
    if (location.state?.activeTab) {
      console.log('Setting active tab to:', location.state.activeTab);
      setActiveTab(location.state.activeTab);
    }
  }, [location]);

  const tabs = [
    {id: 'profile', label: '내 프로필'},
    {id: 'chatting', label: '채팅 목록'},
    {id: 'mentoring', label: '일정 목록'},
    {id: 'payment-history', label: '거래 내역'},
    {id: 'my-mentoring', label: '내 멘토링'},
    {id: 'history', label: '멘토 신청 내역'},
    {id: 'withdraw', label: '탈퇴하기'},
  ];

  const handleDetailView = (paymentHistoryId) => {
    setSelectedPaymentHistoryId(paymentHistoryId); // 선택된 결제 내역 ID 저장
  };

  const handleBackToList = () => {
    setSelectedPaymentHistoryId(null); // 결제 상세 보기 종료
  };

  return (
      <div style={{display: 'flex', margin: '20px'}}>
        {/* 왼쪽 탭 메뉴 */}
        <div style={{width: '200px', marginRight: '20px'}}>
          {tabs.map(tab => (
              <div
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    setSelectedPaymentHistoryId(null); // 탭 전환 시 상세 보기 상태 초기화
                    history.push(`/mypage/${tab.id}`,{ activeTab: tab.id });
                  }}
                  style={{
                    padding: '10px',
                    cursor: 'pointer',
                    backgroundColor: activeTab === tab.id ? '#f0f0f0' : 'white'
                  }}
              >
                {tab.label}
              </div>
          ))}
        </div>

        {/* 오른쪽 컨텐츠 영역 */}
        <div style={{
          flex: 1,
          padding: '20px',
          border: '2px solid gray',
          borderRadius: '10px',
          minHeight: '40vh',  // 추가: 최소 높이 설정
        }}>
          {/* 각 탭에 해당하는 컴포넌트를 여기에 렌더링 */}
          {activeTab === 'profile' && <MyPage/>}
          {activeTab === 'chatting' && <ChatLayout/>}
          {activeTab === 'mentoring' && <UserScheduleDummy/>}
          {activeTab === 'my-mentoring' && <MyMentoring/>}
          {activeTab === 'withdraw' && <DeleteUser/>}
          {activeTab === 'history' && <MentorRequestList/>}

          {/* 거래 내역 탭 */}
          {activeTab === "payment-history" && 
            (() => {
              console.log("선택된 아이디는",selectedPaymentHistoryId);
              // 리뷰 관련 라우팅 처리
    if (pathname.includes('/payment-history/review')) {
      // 리뷰 보기 (ex: /payment-history/review/123)
      if (pathname.includes('/payment-history/review/')) {
        console.log("포함된 아이디는 ",location.state.paymentHistoryId);
        const paymentHistoryId = location.state?.paymentHistoryId || pathname.split('/review/')[1];
        return <ViewReview paymentHistoryId={paymentHistoryId} />;
      }
      // 리뷰 작성
      return <WriteView />;
    }

    if ( pathname.includes(`/payment-history/detail/${location.state.paymentHistoryId}/mentor`)){
      console.log("여기까지 잘오셨습니다. 여기는 잘온겁니다.");

      return < MentorSettlementDetail />
    }

              if (userRole === "MENTEE") {
                if (selectedPaymentHistoryId) {
                  return (
                    <PaymentHistoryDetail
                      paymentHistoryId={selectedPaymentHistoryId}
                      onBack={handleBackToList}
                    />
                  );
                } else {
                  return (
                    <PaymentHistoryForMentee 
                      onViewDetail={handleDetailView} 
                    />
                  );
                }
              } else if (userRole === "MENTOR") {
                return <PaymentHistoryForMentor />;
              }
            })()
          }

          {/* ... 다른 탭들의 컨텐츠 */}
        </div>
      </div>
  );
};

export default MyPageHome;
