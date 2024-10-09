import React, { useEffect, useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom';


const LoadingScreen = () => {
    const navigate = useNavigate();

    useEffect(() => {
        // Wait for the GIF to finish one cycle, then navigate
        const timer = setTimeout(() => {
            navigate('/map');
        }, 6050);

        // Clean up the timer if the component unmounts
        return () => clearTimeout(timer);
    }, [navigate]);

    return (
            <div style={{ height: '100vh', width: '100vw', overflow: 'hidden' }}>
            <img 
                src="https://media.giphy.com/media/EURa8GpC4Kyx0jGWGB/giphy.gif?cid=ecf05e47rbbd8aodgespv2wb98k6kybfqr32fv9t2d4ytdr0&ep=v1_gifs_search&rid=giphy.gif&ct=g"
                alt="Loading"
                style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover'
                }}
            />
            
            {/* OPTION 2 FOOTBALL FIELD ANIMATED
                <img 
                src="https://media.giphy.com/media/LOF4krQGVu6M5wQM2z/giphy.gif?cid=ecf05e478582rz6ivd9ezne9gz6oa304xv0avhtvfq267y1a&ep=v1_gifs_search&rid=giphy.gif&ct=g"
                alt="Loading"
                style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover'
                }}
            /> */}

            {/* OPTION 3 MAP ROUTE
                <img 
                src="https://media.giphy.com/media/FoMJ3wPyRsGVwRtbKC/giphy.gif?cid=ecf05e47eazq0vqcnwu41w0vb7mdl2fzf8w1v6789otwpnls&ep=v1_gifs_search&rid=giphy.gif&ct=g"
                alt="Loading"
                style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover'
                }}
            /> */}
            {/* OPTION 4 TABLE LOOP
                <img 
                src="https://media.giphy.com/media/3oEjHRefD1rpcXUOkM/giphy.gif?cid=ecf05e472nl8a8tyf9awdvbrzuevsyukr10hgcv4x24zj5j6&ep=v1_gifs_search&rid=giphy.gif&ct=g"
                alt="Loading"
                style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover'
                }}
            /> */}
            {/* OPTION 5 EMOTICON thredmill TABLING
                <img 
                src="https://media.giphy.com/media/IboGSjkXaOre0/giphy.gif?cid=ecf05e47rz97c3des57mogo1phgx78npbh3w1os9rvbp1xxj&ep=v1_gifs_search&rid=giphy.gif&ct=g"
                alt="Loading"
                style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover'
                }}
            /> */}
        </div>
    )
}

export default LoadingScreen