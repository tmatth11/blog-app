import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCookie } from '../utils/cookies';

const Protected = () => {
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);

    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            const accessToken = getCookie('accessToken');
            if (!accessToken) {
                navigate('/login');
            }

            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/protected`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${accessToken}`
                    },
                    credentials: 'include'
                });

                if (response.ok) {
                    const result = await response.json();
                    setData(result);
                } else {
                    setError('Failed to fetch protected data');
                }
            } catch (err) {
                setError('Error fetching data');
            }
        };

        fetchData();
    }, []);

    if (error) {
        return <div>Error: {error}</div>;
    }

    if (!data) {
        return <div>Loading...</div>;
    }

    return (
        <div className='mt-5 text-center'>
            <h1>Protected Data</h1>
            <h2>Hello, {data.user.username}!</h2>
        </div>
    );
};

export default Protected;