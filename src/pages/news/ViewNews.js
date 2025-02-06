// 뉴스 메인 페이지-> 메인 페이지에서 보여줄 몇개의 뉴스들
// MainNewsSection.js
import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import './News.css'

const MainNewsList = () => {
 const [news, setNews] = useState([]);
 const [loading, setLoading] = useState(true);
 const [error, setError] = useState(null);
 const [currentPage, setCurrentPage] = useState(0);
 const [totalPage, setTotalPage] = useState(0);

 const newsUrl = `/news?pageSize=15&pageNumber=${currentPage}`;

 useEffect(() => {
   const fetchNews = async () => {
     try {
       const response = await api.get(newsUrl);
       setNews(response.data.data.content);
       setTotalPage(response.data.data.totalPages)
       setLoading(false);
     } catch (err) {
       setError(err);
       setLoading(false);
     }
   };
   fetchNews();
 }, [currentPage]);

 const Pagination = () => {
    const pageGroup = Math.floor(currentPage / 10);
    const startPage = pageGroup * 10;
    const endPage = Math.min(startPage + 10, totalPage);
   
    return (
      <div style={{ textAlign: 'center', margin: '20px' }}>
        {pageGroup > 0 && (
          <span 
            onClick={async () => {
              setLoading(true);
              setCurrentPage((pageGroup - 1) * 10);
              setLoading(false);
            }}
            style={{ cursor: 'pointer', margin: '0 5px' }}
          >
            &lt;
          </span>
        )}
        
        {[...Array(endPage - startPage)].map((_, i) => (
          <span
            key={startPage + i}
            onClick={async () => {
              setLoading(true);
              setCurrentPage(startPage + i);
              setLoading(false);
            }}
            style={{ 
              margin: '0 5px',
              cursor: 'pointer',
              color: currentPage === (startPage + i) ? '#000' : '#999'
            }}
          >
            {startPage + i + 1}
          </span>
        ))}
   
        {endPage < totalPage && (
          <span 
            onClick={async () => {
              setLoading(true);
              setCurrentPage(endPage);
              setLoading(false);
            }}
            style={{ cursor: 'pointer', margin: '0 5px' }}
          >
            &gt;
          </span>
        )}
      </div>
    );
   };

 if (loading) return <div>로딩중...</div>;
 if (error) return <div>에러가 발생했습니다</div>;

 return (
   <section
    style={{
        margin: "auto",
        display: "block",
        width: "65%"
    }}
   >
     <h2
     style={{
        paddingLeft: "10%"
     }}
     >최신 뉴스</h2>
     <div style={{
        margin: "auto",
        width: "80%",
        border: "2px solid gray",
        borderRadius: "10px",
        padding: "10px"
     }}>
       {news.map(item => (
         <div 
         style={{
            padding: "3px",
            borderBottom: "1px solid gray"
         }}
         key={item.id}>
         <a className='news-link'
         target='_blank'
         rel='noopener noreferrer'
         href={item.url}>{item.title}
         </a>
         <span
         style={{
            float:"right",
            color: 'black'
         }}
         >{item.time}</span>
         </div>
       ))}
     
     </div>
     <Pagination/>
   </section>
 );
};

export default MainNewsList;