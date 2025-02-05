// 뉴스 메인 페이지-> 메인 페이지에서 보여줄 몇개의 뉴스들
// MainNewsSection.js
import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import '../news/News.css'

const MainPosts = () => {
 const [posts, setPosts] = useState([]);
 const [loading, setLoading] = useState(true);
 const [error, setError] = useState(null);

 const history = useHistory();
 const postsUrl = 'https://api.codeness.com/posts/popular';

 useEffect(() => {
   const fetchPosts = async () => {
     try {
       const response = await axios.get(postsUrl);
       setPosts(response.data.data);
       setLoading(false);
     } catch (err) {
       setError(err);
       setLoading(false);
     }
   };
   fetchPosts();
 }, []);

 if (loading) return <div>로딩중...</div>;
 if (error) return <div>에러가 발생했습니다</div>;

 return (
   <section
    style={{
        width: "100%"
    }}
   >
     <h2
     style={{ cursor: 'pointer'}}
     onClick={() => history.push('/community')}
     >최신 게시글</h2>
     <div style={{
        width: "60%",
        border: "2px solid gray",
        borderRadius: "10px",
        padding: "10px"
     }}>
      {posts.slice(0, 5).map(item => (
      <div 
        style={{
          padding: "3px",
          borderBottom: "1px solid gray"
        }}
        key={item.id}>
        <a className='news-link'
          rel='noopener noreferrer'
          href='/community'>{item.title} {/* TODO: 나중에 이부분 상세 url로 바꿔야함! */}
        </a>
      </div>
      ))}
     </div>
   </section>
 );
};

export default MainPosts;