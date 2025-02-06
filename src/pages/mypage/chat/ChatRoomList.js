import React, { useState, useEffect } from 'react';
import { getDatabase, ref, onChildAdded, onChildChanged, off } from 'firebase/database';
import { jwtDecode } from 'jwt-decode';
import api from '../../../api/axios';
import { DEFAULT_PROFILE_IMAGE } from '../../../assets/constants';

const ChatRoomList = ({ onSelectChat, activeChatId }) => {
 const [chatRooms, setChatRooms] = useState([]);
 const token = localStorage.getItem("jwtToken");
 const userId = jwtDecode(token).userId;
 console.log(`유저 아이디는 ${userId}`);
 const database = getDatabase();

 useEffect(() => {
   const controller = new AbortController();

   const fetchChatRooms = async () => {
     try {
       const response = await api.get('http://localhost:8080/chat-rooms', {
         headers: { 'Authorization': `Bearer ${token}` },
         signal: controller.signal
       });
       setChatRooms(response.data.data);
      
      // 기존 채팅방 ID들을 Set으로 저장
      const existingRoomIds = new Set(response.data.data.map(room => room.chatRoomId));

      // 기존 채팅방 + 새로운 채팅방 감지
      const userChatRoomsRef = ref(database, `chatRooms/${userId}`);
      onChildAdded(userChatRoomsRef, (snapshot) => {
        const newRoomId = snapshot.key;
        // 기존 채팅방 목록에 없는 경우에만 추가
        if (!existingRoomIds.has(newRoomId)) {
          const newRoomData = snapshot.val();
          setChatRooms(prevRooms => [...prevRooms, {
            chatRoomId: newRoomId,
            ...newRoomData
          }]);
          existingRoomIds.add(newRoomId);
        }
      });


      // 각 채팅방에 대한 리스너 설정
      response.data.data.forEach(room => {
        const chatRoomRef = ref(database, `chatRooms/${userId}/${room.chatRoomId}`);
        
        onChildChanged(chatRoomRef, (snapshot) => {
          const key = snapshot.key;
          const value = snapshot.val();
          
          setChatRooms(prevRooms => 
            prevRooms.map(prevRoom => {
              if (prevRoom.chatRoomId === room.chatRoomId) {    
                 // unreadCount가 변경되고 현재 활성화된 채팅방이면 0으로 표시
                  return {
                    ...prevRoom,
                    [key]: value
                  };
                }

              return prevRoom;
            })
          );
        });
      });

    } catch (error) {
      console.error('채팅방 목록 조회 실패:', error);
    }
  };
  fetchChatRooms();
  return () => {
    controller.abort();
    const userChatRoomsRef = ref(database, `chatRooms/${userId}`);
    off(userChatRoomsRef);
    chatRooms.forEach(room => {
      const chatRoomRef = ref(database, `chatRooms/${userId}/${room.chatRoomId}`);
      off(chatRoomRef);
    });
  };

 }, [token,database, activeChatId]);


 
 return (
   <div style={{ overflowY: 'auto', height: '100%'}}>
     {chatRooms.map(room => (
       <div 
         key={room.chatRoomId}
         onClick={() => {
            onSelectChat(room.chatRoomId, room.partnerId, room.partnerProfileUrl)
            // setChatRooms(prevRooms => 
            //     prevRooms.map(prevRoom => 
            //       prevRoom.chatRoomId === room.chatRoomId 
            //         ? {...prevRoom, unreadCount: 0} 
            //         : prevRoom
            //     )
            //   );
        }}
         style={{ padding: '10px', cursor: 'pointer', border:"1px solid black", borderRadius:"5px"}}
       >
         <img 
           src={room.partnerProfileUrl || DEFAULT_PROFILE_IMAGE} 
           style={{ width: 50, height: 50, borderRadius: '50%'}} 
           alt="프로필"
         />
         <div style={{
           display: 'flex',
           justifyContent: 'space-between',
           alignItems: 'center'
         }}>
           <span style={{ color: "gray" }}>{room.partnerNick}</span>
           {room.unreadCount > 0 && room.chatRoomId !== activeChatId && (
             <span style={{
               background: '#FF4B4B',
               color: 'white',
               borderRadius: '50%',
               padding: '2px 8px',
               fontSize: '12px',
               minWidth: '20px',
               textAlign: 'center'
             }}>
               {room.unreadCount}
             </span>
           )}
         </div>
         <div>{room.lastMessage || "아직 채팅이 없습니다."}</div>
       </div>
     ))}
   </div>
 );
};

export default ChatRoomList;