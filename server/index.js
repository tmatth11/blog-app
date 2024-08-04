const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const { logger, authenticateToken } = require('./middleware');
const registerLoginCredentials = require('./services/registerService');
const validateLoginCredentials = require('./services/loginService')

const app = express();
const PORT = process.env.PORT || 8080;
const CLIENT_PORT = process.env.CLIENT_PORT || 5173;

const { generateAccessToken } = require('./services/authService');
const jwt = require('jsonwebtoken');

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: `http://localhost:${CLIENT_PORT}`,
    credentials: true
}));
app.use(logger);

app.get('/', (req, res) => {
    res.json({ message: 'Welcome to the blog application.' });
});

app.post('/register', (req, res) => {
    registerLoginCredentials(req, res);
});

app.post('/login', (req, res) => {
    validateLoginCredentials(req, res);
});

app.post('/token', (req, res) => {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) return res.sendStatus(401);

    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        const accessToken = generateAccessToken({ id: user.id, username: user.username });
        res.json({ id: user.id });
    });
});

app.get('/protected', authenticateToken, (req, res) => {
    res.json({ message: 'This is a protected route', user: req.user });
});

app.post('/logout', (req, res) => {
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken', { secure: true });
    res.status(200).json({ message: 'Successfully logged out!' });
});

app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`);
    console.log(`Client is running on port: ${CLIENT_PORT}`);
});