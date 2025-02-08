// src/pages/chat/ChatRoom.js
import React, { useState, useEffect, useRef } from 'react';
import api from '../../../api/axios';
import { database } from '../../../firebaseConfig';
import { ref, set, onChildAdded, onChildChanged ,off } from 'firebase/database';
import { jwtDecode } from 'jwt-decode';
import { DEFAULT_PROFILE_IMAGE } from '../../../assets/constants';

const ChatRoom = ({ chatRoomId, partnerId, profileImage}) => {
    const [messages, setMessages] = useState([]);
    const token = localStorage.getItem("jwtToken");
    const userId = jwtDecode(token).userId;
    // 새로운 상태 추가
    const [newMessage, setNewMessage] = useState('');
    const [initialTimestamp, setInitialTimestamp] = useState(null); // 추가

    const messagesEndRef = useRef(null);

    // 스크롤을 맨 아래로 이동시키는 함수
    const scrollToBottom = () => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

      // 메시지가 업데이트될 때마다 스크롤
      useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // 새로운 함수: unreadCount를 0으로 업데이트
    const updateUnreadCount = async () => {
      const myUnreadCountRef = ref(database, `chatRooms/${userId}/${chatRoomId}/unreadCount`);
      await set(myUnreadCountRef, 0);
      };

    // 메시지 전송 함수 추가
    const sendMessage = async () => {
        if (!newMessage.trim()) return;  // 빈 메시지 방지
        try {
        await api.post('/chat-rooms/chat', {
            "firebaseChatRoomId": chatRoomId,
            "message": newMessage
        }, {
            headers: { "Authorization": `Bearer ${token}` }
        });
        setNewMessage('');
        scrollToBottom();  // 메시지 전송 후 스크롤
        } catch (error) {
        console.error('메시지 전송 실패:', error);
        }
    };

    useEffect(() => {
    const fetchMessages = async () => {
        try {
        const response = await api.get(`/chat-rooms/${chatRoomId}`, {
            headers: { "Authorization": `Bearer ${token}` }
        });
        setMessages(response.data.data);
        
        await updateUnreadCount();

         // 가장 최근 메시지의 timestamp를 기준으로 설정
         const latestMessage = response.data.data[response.data.data.length - 1];
         setInitialTimestamp(latestMessage ? latestMessage.timestamp : "0");

        // 기존 메시지를 가져온 후 Firebase 리스너 설정
        const messagesRef = ref(database, `chatMessages/${chatRoomId}`);

        //이 채팅방에서 메시지가 오면 무조건 읽은 것으로 처리
        onChildAdded(messagesRef, async (snapshot) => {
            const newMessage = snapshot.val();
            // initialTimestamp가 설정된 후에만 새 메시지 추가
            if (newMessage.timestamp > initialTimestamp) {
              await updateUnreadCount();
                setMessages(prevMessages => {
                    // 중복 체크
                    const isDuplicate = prevMessages.some(msg => 
                        msg.timestamp === newMessage.timestamp && 
                        msg.content === newMessage.content
                    );
                    if (!isDuplicate) {
                        return [...prevMessages, {
                            content: newMessage.content,
                            senderId: newMessage.senderId,
                            timestamp: newMessage.timestamp
                        }];
                    }
                    return prevMessages;
                });
            }
        });
       

        } catch (error) {
        console.error('메시지 조회 실패:', error);
        }
    };
   fetchMessages();

   // 컴포넌트 언마운트시 리스너 제거
   return () => {
    const messagesRef = ref(database, `chatMessages/${chatRoomId}`);
    off(messagesRef);
    updateUnreadCount();
};
 }, [chatRoomId,initialTimestamp]);

 return (
  <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
    <div style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>
      {messages.map(msg => (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: msg.senderId !== partnerId ? 'flex-end' : 'flex-start',
          marginBottom: '20px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {msg.senderId === partnerId && (
              <img 
                src={profileImage || DEFAULT_PROFILE_IMAGE} 
                style={{ width: 30, height: 30, borderRadius: '50%', flexShrink: 0 }} 
                alt="프로필"
              />
            )}
            <div style={{
              background: msg.senderId === partnerId ? '#E9ECEF' : '#007AFF',
              color: msg.senderId === partnerId ? 'black' : 'white',
              padding: '10px',
              borderRadius: '10px',
              wordBreak: 'break-word'
            }}>
              {msg.content}
            </div>
          </div>
          <div style={{ 
            fontSize: '12px',
            color: '#999',
            marginTop: '5px',
            marginLeft: msg.senderId === partnerId ? '38px' : '0'
          }}>
            {msg.timestamp}
          </div>
        </div>
      ))}
      <div ref={messagesEndRef} />
    </div>
<div style={{ 
 display: 'flex', 
 padding: '10px',
 borderTop: '1px solid #ddd',
 gap: '10px'
}}>
 <input
   type="text"
   value={newMessage}
   onChange={(e) => setNewMessage(e.target.value)}
   onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
   style={{
     flex: 1,
     padding: '10px',
     borderRadius: '5px',
     border: '1px solid #ddd'
   }}
   placeholder="메시지를 입력하세요"
 />
 <button
   onClick={sendMessage}
   style={{
     padding: '10px 20px',
     borderRadius: '5px',
     border: 'none',
     backgroundColor: '#007AFF',
     color: 'white',
     cursor: 'pointer'
   }}
 >
   전송
 </button>
</div>
  </div>
 );
};

export default ChatRoom;