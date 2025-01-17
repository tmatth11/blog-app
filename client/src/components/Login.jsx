import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import loginImage from '../img/login.png';

const Login = ({ handleLogin }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmationMessage, setConfirmationMessage] = useState('');

    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        try {
            event.preventDefault();
            const response = await fetch(`${import.meta.env.VITE_API_URL}/login`, {
                method: "POST",
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ username, password }),
                credentials: 'include'
            });
            const status = response.status;
            const responseJson = await response.json();
            console.log('responseJson:', responseJson);
            if (status === 200) {
                handleLogin(true, responseJson.id);
                navigate('/');
            } else if (status === 400) {
                setConfirmationMessage(`${username} does not have an account, please register.`);
                handleLogin(false);
            } else if (status === 401) {
                setConfirmationMessage('Password is incorrect.');
                handleLogin(false);
            } else {
                alert(responseJson.message);
                handleLogin(false);
            }
        } catch (e) {
            alert(`Error: ${e.message}`);
        }

        setTimeout(() => {
            setConfirmationMessage('');
        }, 3000);
    };

    const handleReset = () => {
        setUsername('');
        setPassword('');
    };

    return (
        <section className="p-2 p-sm-5">
            <div className="container">
                {confirmationMessage && <div className="alert alert-danger text-center my-3">{confirmationMessage}</div>}
                <h1 className="text-center fw-bold my-3">Login</h1>
                <img id="login" className="w-25 rounded my-3 d-block mx-auto" src={loginImage} alt="Login Image" />
                <p className="text-center">Please enter your login credentials.</p>
                <div className="row justify-content-center">
                    <div className="col-md-6">
                        <form onSubmit={handleSubmit}>
                            <div className="w-75 mx-auto">
                                <div className="mb-3">
                                    <label htmlFor="username" className="form-label">Username</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="username"
                                        placeholder="Enter username"
                                        value={username}
                                        onChange={(event) => setUsername(event.target.value)}
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="password" className="form-label">Password</label>
                                    <input
                                        type="password"
                                        className="form-control"
                                        id="password"
                                        placeholder="Enter password"
                                        required
                                        value={password}
                                        onChange={(event) => setPassword(event.target.value)}
                                    />
                                </div>
                                <div className="d-flex justify-content-between">
                                    <button type="submit" className="btn btn-primary">Submit</button>
                                    <button type="reset" className="btn btn-secondary" onClick={handleReset}>Reset</button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Login;