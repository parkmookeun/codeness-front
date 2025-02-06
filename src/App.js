// App.js
import React from "react";
import { BrowserRouter as Router, Route, Switch, Redirect } from "react-router-dom";
import HomePage from "./pages/home/Home";
import LoginPage from "./pages/auth/Login";
import SignUpPage from "./pages/auth/SignUp";
import CommunityPage from "./pages/community/PostMain";
import NewsPage from "./pages/news/ViewNews";
import MyPage from "./pages/mypage/profile/MyPage";
import UserUpdatePage from "./pages/mypage/profile/UserUpdate";
import Header from "./components/header/Header";
import MentoringPaymentPage from "./pages/payment/MentoringPayment";
import MentorRequestPage from "./pages/mentor-request/MentorRequest";
import ViewReviewPage from "./pages/mypage/review/ViewReview";
import WriteReviewPage from "./pages/mypage/review/WriteReview";
import MainNewsPage from "./pages/news/MainNews";
import MentoringPostSearchPage from "./pages/mentoring/MentoringPostSearch";
import MentoringPostFormPage from "./pages/mentoring/MentoringPostForm";
import MyPageHome from "./pages/mypage/MyPageHome";
import UserSchedulePage from "./pages/mypage/schedule/UserSchedule";
import DeleteUserPage from "./pages/mypage/delete-user/DeleteUser";
import MentoringPostDetailPage from "./pages/mentoring/MentoringPostDetail";
import MentoringReservationPage from "./pages/payment/MentoringReservation";
import WritePostPage from "./pages/community/PostWrite";
import PostDetailPage from "./pages/community/PostDetail"
import AdminRoutes from "./pages/admin/AdminRoutes";
import PasswordUpdate from "./pages/mypage/profile/PasswordUpdate";
import PaymentHistoryForMenteePage from "./pages/mypage/payment-history/PaymentHistoryForMentee";
import PaymentHistoryDetailPage from "./pages/mypage/payment-history/PaymentHistoryDetail";
import PostUpdatePage from "./pages/community/PostUpdate";
import MentoringPaymentSuccessPage from "./pages/payment/MentoringPaymentSuccess";
import ChatLayout from "./pages/mypage/chat/ChatLayout";
import MyMentoring from "./pages/mypage/my-mentoring/MyMentoring";
// 로그인이 필요한 페이지를 위한 Private Route
const PrivateRoute = ({ component: Component, ...rest }) => {
  const isAuthenticated = !!localStorage.getItem("jwtToken");
  return (
      <Route
          {...rest}
          render={(props) =>
              isAuthenticated ? <Component {...props} /> : <Redirect to="/login" />
          }
      />
  );
};

function App() {
  return (
      <Router>
        <Header /> {/* 모든 페이지에 헤더 추가 */}
        <Switch>
          <Route path="/admin" component={AdminRoutes} />
          <Route exact path="/" component={HomePage} />
          <Route path="/login" component={LoginPage} />
          <Route path="/signup" component={SignUpPage} />
          <Route path="/community" component={CommunityPage} />
          <Route path="/news" component={NewsPage} />
          <Route path="/main/news" component={MainNewsPage} />
          <PrivateRoute path="/writePost" component={WritePostPage} />
          <Route path="/posts/:postId/update" component={PostUpdatePage} />
          <Route exact path="/posts/:postId" component={PostDetailPage} />

          <Route path="/mentoring/success" component={MentoringPaymentSuccessPage} />
          <PrivateRoute path="/mentoring/:mentoringPostId/mentoring-reservation" component={MentoringReservationPage} />
          <Route path="/mentoring/:mentoringPostId" component={MentoringPostDetailPage} />
          <Route path="/mentoring" component={MentoringPostSearchPage} />

          <PrivateRoute path="/mypage" component={MyPageHome} />
          <PrivateRoute exact path="/mypage/profile" component={MyPageHome} />
          <PrivateRoute exact path="/mypage/chatting" component={ChatLayout} />
          <PrivateRoute exact path="/mypage/schedule" component={UserSchedulePage} />
          <PrivateRoute exact path="/mypage/payment-history/detail/:paymentHistoryId/mentor" component={PaymentHistoryDetailPage} />
          <PrivateRoute exact path="/mypage/payment-history/review/:paymentHistoryId" component={ViewReviewPage} />
          <PrivateRoute exact path="/mypage/payment-history/review" component={WriteReviewPage} />
          <PrivateRoute exact path="/mypage/payment-history" component={PaymentHistoryForMenteePage} />
          <PrivateRoute exact path="/mypage/my-mentoring" component={MyMentoring} />  

          <PrivateRoute path="/user/update" component={UserUpdatePage} />
          <PrivateRoute path="/user/mentor" component={MentorRequestPage} />
          <PrivateRoute path="/payment" component={MentoringPaymentPage} />
          <PrivateRoute path="/mentoring-post-form" component={MentoringPostFormPage} />
          
          <Route path="/delete-user" component={DeleteUserPage} />
          <Route path="/password-update" component={PasswordUpdate} />
        </Switch>
      </Router>
  );
}

export default App;
