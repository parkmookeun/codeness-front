import { useHistory } from 'react-router-dom';

const CompanyInfo = () => {

    const history = useHistory();

    const handleMentorRequest = () => {
        history.push('/user/mentor');
    };

    return (
      <div className="company-container">
        <div>
            <p>CodeNess는 <span>멘토</span>와 <span>멘티</span>가 함께 성장할 수 있도록 멘토링 프로그램을 운영하며,</p>
            <p>개발자 특화 <span>멘토링</span> & <span>커뮤니티 플랫폼</span>입니다. </p>
        </div>
        <div>
            <p><span>CodeNess</span> 의미:</p>
            <p>CodeNess는 Code와 Awareness(인지, 통찰)의 결합어로, 개발자들이 최신 기술 트렌드와</p>
            <p>깊이 있는 정보를 빠르고 효율적으로 얻을 수 있는 중심지를 의미합니다. </p>
        </div>
        <div>
            <p><span>코드니스</span>는 멘토와 멘티가 함께 <span>기술 성장</span>과 <span>커리어 성공</span>을 이루어가는 것을 목표로,</p>
            <p>개발자들이 경험, 통찰, 노하우를 공유하며 <span>서로 배우고 성장</span>할 수 있는 커뮤니티 서비스를 제공합니다.</p>
        </div>
        <div>
        </div>
        <div>
            <img src="https://codeness.s3.ap-northeast-1.amazonaws.com/codeness-team.png"></img>
        </div>
        <div>
        <button className="mentor-request-button" onClick={handleMentorRequest}>
            멘토 신청하러 가기
        </button>
        </div>
      </div>
    );
   };

   export default CompanyInfo;