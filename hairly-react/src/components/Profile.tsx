
import React, { useEffect, useState } from 'react';

const Profile: React.FC = () => {
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        const fetchUser = async () => {
            const response = await fetch('http://localhost:8080/api/v1/auth/user', {
                credentials: 'include' // Include cookies in the request
            });

            if (response.ok) {
                const userData = await response.json();
                setUser(userData);
            } else {
                console.error('Failed to fetch user data');
            }
        };

        fetchUser();
    }, []);

    return (
        <div>
            <h1>User Profile</h1>
            {user ? <p>{JSON.stringify(user)}</p> : <p>Loading...</p>}
        </div>
    );
}
export default Profile;