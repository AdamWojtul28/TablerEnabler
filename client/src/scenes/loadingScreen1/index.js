import React, { useEffect, useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom';
import Spline from '@splinetool/react-spline';


const LoadingScreen1 = () => {
    const navigate = useNavigate();

    useEffect(() => {
        // Wait for the GIF to finish one cycle, then navigate
        const timer = setTimeout(() => {
            navigate('/loadingscreen2');
        }, 15000);

        // Clean up the timer if the component unmounts
        return () => clearTimeout(timer);
    }, [navigate]);

    return (
        <div style={{ height: '100vh', width: '100vw', overflow: 'hidden', backgroundColor: 'black'}}>
            <div>
                <p style={{textAlign: 'center'}}>Use your mouse while we set eveything for you</p>
                <Spline scene="https://prod.spline.design/GnqUAnzgA796BxBW/scene.splinecode" />
            </div>
            
        </div>
    )
}

export default LoadingScreen1