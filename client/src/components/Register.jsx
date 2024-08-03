import {useState} from 'react';
import { useNavigate } from 'react-router-dom';
import registerImage from '../img/register.png';

const Register = ({ handleLogin }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [repeatPassword, setRepeatPassword] = useState('');
    const [confirmationMessage, setConfirmationMessage] = useState('');

    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        try {
            event.preventDefault();
            if (password !== repeatPassword) {
                setConfirmationMessage('Passwords do not match.');
                setUsername('');
                setPassword('');
                setRepeatPassword('');
                return;
            }

            const response = await fetch(`${import.meta.env.VITE_API_URL}/register`, {
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
            if (status === 201) {
                handleLogin(true, responseJson.id);
                navigate('/');
            }
            else if (status === 409) {
                setConfirmationMessage('There is already an account with that username. Please try again with a new username.');
                handleLogin(false);
            }
        }
        catch (e) {
            console.error('Error during registration:', e);
            setConfirmationMessage('An error occurred during registration. Please try again.');
        }
    }

    const handleReset = () => {
        setUsername('');
        setPassword('');
        setRepeatPassword('');
    }
    
    return (
        <section className="p-2 p-sm-5">
            <div className="container">
            {confirmationMessage && <div className="alert alert-success text-center my-3">{confirmationMessage}</div>}
                <h1 className="text-center fw-bold my-3">Register</h1>
                <img id="register" className="w-25 rounded my-3 d-block mx-auto" src={registerImage}
                    alt="Register Image" />
                <p className="text-center">Please fill in this form to create an account.</p>
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
                                        className="form-control" id="password"
                                        placeholder="Enter password"
                                        value={password}
                                        onChange={(event) => setPassword(event.target.value)}
                                        required />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="repeat-password" className="form-label">Repeat Password</label>
                                    <input
                                        type="password"
                                        className="form-control"
                                        id="repeat-password"
                                        placeholder="Repeat password"
                                        value={repeatPassword}
                                        onChange={(event) => setRepeatPassword(event.target.value)}
                                        required
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
}

export default Register;