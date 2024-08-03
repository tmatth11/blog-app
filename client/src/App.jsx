import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Layout from './components/Layout';
import Home from './components/Home';
import Register from './components/Register';
import Login from './components/Login';
import Protected from './components/Protected';
import Logout from './components/Logout';
import NotFound from './components/NotFound';
import { getCookie } from './utils/cookies';

const App = () => {
    const [loggedIn, setLoggedIn] = useState(false);
    const [userId, setUserId] = useState(null);

    const handleUserSessionState = (isLoggedIn, id = null) => {
        setLoggedIn(isLoggedIn);
        setUserId(id);
    }

    useEffect(() => {
        const checkTokens = async () => {
            const accessToken = getCookie('accessToken');
            const refreshToken = getCookie('refreshToken');

            if (!accessToken && !refreshToken) {
                handleUserSessionState(false);
                return;
            }

            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/token`, {
                    method: 'POST',
                    credentials: 'include'
                });

                if (response.ok) {
                    const data = await response.json();
                    handleUserSessionState(true, data.id);
                } else {
                    handleUserSessionState(false);
                }
            } catch (error) {
                console.error('Error:', error);
                handleUserSessionState(false);
            }
        };

        checkTokens();
    }, []);

    return (
        <>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Layout loggedIn={loggedIn} />}>
                        <Route index element={<Home />} />
                        <Route path="register" element={<Register handleLogin={handleUserSessionState} />} />
                        <Route path="login" element={<Login handleLogin={handleUserSessionState} />} />
                        <Route path="protected" element={<Protected />} />
                        <Route path="logout" element={<Logout handleLogin={handleUserSessionState} />} />
                        <Route path="*" element={<NotFound />} />
                    </Route>
                </Routes>
            </BrowserRouter>
        </>
    )
}

export default App;
