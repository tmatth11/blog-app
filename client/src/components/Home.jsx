import hello from '../img/hello.jpg';

const Home = () => {
    return (
        <div className="px-5 d-flex flex-column justify-content-center align-items-center">
            <img src={hello} width="200px" height="100px" alt="hello" className="my-3" />
            <h1 className="text-center my-3">Welcome to the Blog App</h1>
            <div className="col col-lg-6">
                <p>
                    This is a full-stack blog application that allows users to create an account, log in, create posts, update posts, remove posts and like posts.
                    It uses the PERN stack (PostgreSQL, Express, React, Node.js) and JWT (JSON Web Tokens) for authentication. The application is styled using Bootstrap. I am making this application as a personal project to practice my full-stack development skills. Feel free to make any changes to the application or use it as a template for your own projects.
                </p>
            </div>
        </div>
    );
}

export default Home;