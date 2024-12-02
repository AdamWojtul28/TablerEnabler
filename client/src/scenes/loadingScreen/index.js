import React, { useEffect, useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom';
import Spline from '@splinetool/react-spline';


const LoadingScreen = () => {
    const navigate = useNavigate();

    useEffect(() => {
        // Wait for the GIF to finish one cycle, then navigate
        const timer = setTimeout(() => {
            navigate('/map');
        }, 4700);

        // Clean up the timer if the component unmounts
        return () => clearTimeout(timer);
    }, [navigate]);

    return (
        <div style={{ height: '100vh', width: '100vw', overflow: 'hidden', backgroundColor: 'black'}}>
            <div>
                <Spline scene="https://prod.spline.design/anxrYzaE4iT8vHpN/scene.splinecode" />
            </div>
        </div>
    )
}

export default LoadingScreen