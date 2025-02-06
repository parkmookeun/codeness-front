import React, { useState, useEffect } from 'react';
import api from '../../../api/axios';
import './MyMentoring.css'
import TrashButton from '../../../components/button/TrashButton';

const MyMentoring = () => {

    //내가 여태 받은 or 했던 멘토링 공고에 관한 내역을 조회한다.
    //멘토 & 멘티 : 멘토링 공고 내역 조회
    //멘토인 경우에 삭제 아이콘 표시 -> 삭제 시 다시 리다이렉션

    //내가 멘토인지 멘토인지 구분
    let userData = null;

    const[myData, setMyData] = useState(null);

    const token = localStorage.getItem('jwtToken');

    const parseJwt = (token) => {

        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload.role;

        };

    if (token) {
       userData = parseJwt(token);        
    }
    
useEffect(() => {
    if (userData === 'MENTEE'){
        const fetchData = async() => {
            try{
                const response = await api.get('/mentees/mentoring',{
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                    });
                    setMyData(response.data.data.content);
                }catch(error){
                    if(!api.isCancel(error)){
                        console.error('내 멘토링 데이터 가져오기 실패:', error);
                    }
                }
            };
            fetchData();
        }
        else if(userData === 'MENTOR'){
            const fetchData = async() => {
                try{
                    const response = await api.get('/mentors/mentoring',{
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                        });
                        setMyData(response.data.data);
                    }catch(error){
                        if(!api.isCancel(error)){
                            console.error('내 멘토링 데이터 가져오기 실패:', error);
                        }
                    }
                };
                fetchData();
        }
    },[userData,token]);

    // API 호출로 리뷰 삭제
    const deleteItem = async (id) => {
        try {
            const response = await api({
                method: 'patch',
                url: `/mentoring/${id}`,
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            console.log('삭제 성공:', response);
            window.location.reload();
        } catch (error) {
        console.error('삭제 실패:', error);
        }
    };

    return(
        <div className="grid-container">
            {myData && (Array.isArray(myData) ? (
                myData.map((item, index) => (
                    <div key={index} className="grid-item">
                        <p>[{item.title}]</p>
                        <p>분야: {item.field}</p>
                        <p>경력: {item.career}</p>
                        <p>닉네임: {item.userNickname}</p>
                        <p>별점: <span id='starRating'>★</span> {item.starRating}</p>
                    </div>
                ))
            ) : (
                <div className='grid-item'>
                    <p>[{myData.title}]</p>
                    <p>분야: {myData.field}</p>
                    <p>경력: {myData.career}</p>
                    <p>닉네임: {myData.userNickname}</p>
                    <p>별점: <span>★</span> {myData.starRating}</p>
                    <div style={{ position: 'absolute', bottom: '10px', right: '10px' }}>
                    <TrashButton 
                                onDelete={(id) => deleteItem(id)}
                                id={myData.mentoringPostId}
                                url='/mypage/profile'/>
                    </div>
                </div>
            ))}
            </div>
    )
}

export default MyMentoring;