import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const OAuthCallback: React.FC = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const queryParams = new URLSearchParams(window.location.search);
        const token = queryParams.get('access_token'); 
        if (token) {
            localStorage.setItem('access_token', token);
            navigate('/profile');
        } else {
            console.error("Token not found");
            navigate('/login');
        }
    }, [navigate]);

    return <div>Loading...</div>; 
};

export default OAuthCallback;
