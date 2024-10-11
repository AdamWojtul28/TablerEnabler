import React, { useEffect, useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom';
import Spline from '@splinetool/react-spline';


const LoadingScreen4 = () => {
    const navigate = useNavigate();

    useEffect(() => {
        // Wait for the GIF to finish one cycle, then navigate
        const timer = setTimeout(() => {
            navigate('/loadingscreen5');
        }, 8000);

        // Clean up the timer if the component unmounts
        return () => clearTimeout(timer);
    }, [navigate]);

    return (
        <div style={{ height: '100vh', width: '100vw', overflow: 'hidden', backgroundColor: 'black'}}>
            <div>
                <Spline scene="https://prod.spline.design/0yF5yYThhUaTzmiy/scene.splinecode" />
            </div>
        </div>
    )
}

export default LoadingScreen4