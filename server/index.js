// Modules
const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const { logger, authenticateToken } = require('./middleware');
const { generateAccessToken } = require('./services/authService');
const registerLoginCredentials = require('./services/registerService');
const validateLoginCredentials = require('./services/loginService')
const { getUserPosts, createPost, updatePost, deletePost, getAllPosts, likePost, dislikePost, checkIfUserLikedPost } = require('./services/postService');

// Express and port setup
const app = express();
const PORT = process.env.PORT || 8080;
const CLIENT_PORT = process.env.CLIENT_PORT || 5173;

// Middleware setup
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: `http://localhost:${CLIENT_PORT}`,
    credentials: true
}));
app.use(logger);

// Main routes
app.get('/', (req, res) => {
    res.json({ message: 'Welcome to the blog application.' });
});

app.post('/register', (req, res) => {
    registerLoginCredentials(req, res);
});

app.post('/login', (req, res) => {
    validateLoginCredentials(req, res);
});

app.post('/logout', (req, res) => {
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken', { secure: true });
    res.status(200).json({ message: 'Successfully logged out!' });
});

app.post('/token', (req, res) => {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) return res.sendStatus(401);

    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        const accessToken = generateAccessToken({ id: user.id, username: user.username });
        res.cookie('accessToken', accessToken, { secure: true });
        res.json({ id: user.id });
    });
});

// Protected routes
app.get('/protected', authenticateToken, (req, res) => {
    res.json({ message: 'This is a protected route', user: req.user });
});

// Account routes
app.get('/account', authenticateToken, getUserPosts);
app.post('/account', authenticateToken, createPost);
app.put('/account/:postId', authenticateToken, updatePost);
app.delete('/account/:postId', authenticateToken, deletePost);

// Post routes
app.get('/posts', authenticateToken, getAllPosts);
app.post('/posts/:postId/like', authenticateToken, likePost);
app.post('/posts/:postId/dislike', authenticateToken, dislikePost);
app.get('/posts/:postId/liked', authenticateToken, checkIfUserLikedPost);

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`);
    console.log(`Client is running on port: ${CLIENT_PORT}`);
});