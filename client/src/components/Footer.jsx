const Footer = () => {
    return (
        <footer className="bg-dark text-white text-center py-3">
            <div className="container">
                <p className="mb-0">© 2024 Login/Register. All rights reserved.</p>
                <div className="mt-2">
                    <a href="https://www.youtube.com" target="_blank" className="text-white me-3"><i
                        className="bi bi-youtube"></i></a>
                    <a href="https://x.com/?lang=en" target="_blank" className="text-white me-3"><i
                        className="bi bi-twitter-x"></i></a>
                    <a href="https://github.com/" target="_blank" className="text-white me-3"><i className="bi bi-github"></i></a>
                </div>
            </div>
        </footer>
    );
}

export default Footer;