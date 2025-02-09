import React, { useEffect, useState } from "react";

const MentorBanner = ({ onClick }) => {
    const [currentImage, setCurrentImage] = useState(0);
    const images = [
        'https://codeness.s3.ap-northeast-1.amazonaws.com/banner.jpg',
        'https://codeness.s3.ap-northeast-1.amazonaws.com/develop.png',
        'https://codeness.s3.ap-northeast-1.amazonaws.com/codeness-1.png',
        'https://codeness.s3.ap-northeast-1.amazonaws.com/codeness-2.png'
    ];
 
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentImage((prev) => (prev + 1) % images.length);
        }, 3000);
 
        return () => clearInterval(interval);
    }, []);
 
    return (
        <div
            onClick={onClick}
            style={{
                borderRadius: '8px',
                cursor: 'pointer',
                textAlign: 'center',
                height: '350px',
                backgroundImage: `url(${images[currentImage]})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                transition: 'background-image 0.5s ease-in-out'
            }}
        />
    );
 };
 
 export default MentorBanner;