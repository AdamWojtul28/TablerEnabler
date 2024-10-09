import React, { useEffect, useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom';


const LoadingScreen = () => {
    const navigate = useNavigate();

    useEffect(() => {
        // Wait for the GIF to finish one cycle, then navigate
        const timer = setTimeout(() => {
            navigate('/map');
        }, 3050);

        // Clean up the timer if the component unmounts
        return () => clearTimeout(timer);
    }, [navigate]);

    return (
        <div style={{ height: '100vh', width: '100vw', overflow: 'hidden' }}>
            <img 
                src="https://media.giphy.com/media/2JcU7di1fv9gZoousy/giphy.gif?cid=ecf05e478sdvi638uj23ye0ha40ut8kh4ko3bm54mjd8old0&ep=v1_gifs_search&rid=giphy.gif&ct=g"
                alt="Loading"
                style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover'
                }}
            />
        </div>
    )
}

export default LoadingScreen