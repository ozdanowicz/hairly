import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export function OAuthCallbackHandler() {
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const token = params.get('access_token');

        if (token) {
            localStorage.setItem('access_token', token);  // Zapisz token JWT
            navigate('/profile');  // Przekieruj do strony profilu
        } else {
            console.error('Brak tokenu w URL');
            navigate('/login');  // Przekierowanie do logowania w razie braku tokenu
        }
    }, [location, navigate]);

    return <div>Loading...</div>; 
};

export default OAuthCallbackHandler;
