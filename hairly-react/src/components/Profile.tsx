
import React, { useEffect, useState } from 'react';
import { User } from '../apiService';
import { useNavigate } from 'react-router-dom';
import { useAuth, isTokenExpired } from '../tokenService';
const Profile: React.FC = () => {
    const [user, setUser] = useState<User>();
    const { token, removeTokens } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
    const fetchUser = async () => {
        if (!token || isTokenExpired()) {
            removeTokens();
            navigate('/login');
            return;
        }
        console.log(token, isTokenExpired());
        const response = await fetch('http://localhost:8080/api/v1/auth/user', {
            credentials: 'include' 
        });

        if (response.ok) {
            const userData = await response.json();
            setUser(userData);
        } else {
            console.error('Failed to fetch user data');
            removeTokens();
            navigate('/login');
        }
    };

    fetchUser();
}, [token, navigate, removeTokens]);

    return (
        <div>
            <h1>User Profile</h1>
            {user ? <p>{JSON.stringify(user)}</p> : <p>Loading...</p>}
        </div>
    );
}
export default Profile;