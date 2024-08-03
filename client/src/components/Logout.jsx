import { useNavigate } from 'react-router-dom';
import logoutImage from '../img/bye.jpg';

const Logout = ({ handleLogin }) => {
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/logout`, {
                method: 'POST',
                credentials: 'include'
            });
            if (response.ok) {
                handleLogin(false);
                navigate('/');
            } else {
                console.error('Failed to logout');
            }
        } 
        catch (error) {
            console.error('Error:', error);
        }
    }

    return (
        <div className="d-flex flex-column align-items-center mt-5">
            <h1>Have a nice day!</h1>
            <img className="my-3 rounded-3" width="400px" src={logoutImage} />
            <form onSubmit={handleSubmit}>
                <button className="btn btn-primary" type='submit'>Logout</button>
            </form>

        </div>
    );
}

export default Logout;