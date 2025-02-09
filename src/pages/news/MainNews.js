// 뉴스 메인 페이지-> 메인 페이지에서 보여줄 몇개의 뉴스들
// MainNewsSection.js
import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import api from '../../api/axios';
import './News.css'

const MainNewsList = () => {
 const [news, setNews] = useState([]);
 const [loading, setLoading] = useState(true);
 const [error, setError] = useState(null);
 const history = useHistory();
 const newsUrl = '/news?pageSize=5&pageNumber=0';

 useEffect(() => {
   const fetchNews = async () => {
     try {
       const response = await api.get(newsUrl);
       setNews(response.data.data.content);
       setLoading(false);
     } catch (err) {
       setError(err);
       setLoading(false);
     }
   };
   fetchNews();
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
     style={{ cursor: 'pointer', color: 'black', display: 'inline-block'}}
     onClick={() => history.push('/news')}>최신 뉴스</h2>
     <div style={{
        width: "60%",
        backgroundColor: '#F8F8F8',
        borderRadius: "10px",
        padding: "10px"
     }}>
       {news.map(item => (
         <div 
         style={{
            padding: "3px",
            textDecoration: 'underline'
         }}
         key={item.id}>
         <a className='news-link'
         target='_blank'
         rel='noopener noreferrer'
         href={item.url}>{item.title}
         
         </a>
         </div>
       ))}
     </div>
   </section>
 );
};

export default MainNewsList;