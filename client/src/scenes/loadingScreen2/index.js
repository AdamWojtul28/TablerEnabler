import React, { useEffect, useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom';
import Spline from '@splinetool/react-spline';


const LoadingScreen2 = () => {
    const navigate = useNavigate();

    useEffect(() => {
        // Wait for the GIF to finish one cycle, then navigate
        const timer = setTimeout(() => {
            navigate('/loadingscreen3');
        }, 8000);

        // Clean up the timer if the component unmounts
        return () => clearTimeout(timer);
    }, [navigate]);

    return (
        <div style={{ height: '100vh', width: '100vw', overflow: 'hidden', backgroundColor: 'white'}}>
            <div>
                <Spline scene="https://prod.spline.design/NJ9eS8WBn6Dgh21M/scene.splinecode" />
            </div>
        </div>
    )
}

export default LoadingScreen2