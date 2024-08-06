const PostRepository = require('../repositories/postRepository');

const getUserPosts = async (req, res) => {
    try {
        const userId = req.user.id;
        const posts = await PostRepository.getPostsByUserId(userId);
        res.json({posts, user: req.user.username});
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const createPost = async (req, res) => {
    try {
        const userId = req.user.id;
        const { title, content } = req.body;
        const newPost = await PostRepository.createPost(userId, title, content);
        res.status(201).json(newPost);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const updatePost = async (req, res) => {
    try {
        const userId = req.user.id;
        const postId = req.params.postId;
        const { title, content } = req.body;

        const post = await PostRepository.getPostById(postId);
        if (post.user_id !== userId) {
            return res.status(403).json({ error: 'You can only update your own posts' });
        }

        const updatedPost = await PostRepository.updatePost(postId, title, content);
        res.json(updatedPost);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const deletePost = async (req, res) => {
    try {
        const userId = req.user.id;
        const postId = req.params.postId;

        const post = await PostRepository.getPostById(postId);
        if (post.user_id !== userId) {
            return res.status(403).json({ error: 'You can only delete your own posts' });
        }

        await PostRepository.deletePost(postId);
        res.status(204).send();
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const getAllPosts = async (req, res) => {
    try {
        const posts = await PostRepository.getAllPosts();
        res.json(posts);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const likePost = async (req, res) => {
    try {
        const userId = req.user.id;
        const postId = req.params.postId;

        const post = await PostRepository.getPostById(postId);
        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }

        const updatedPost = await PostRepository.likePost(userId, postId);
        res.json(updatedPost);
    } catch (err) {
        if (err.message === 'User has already liked this post') {
            return res.status(400).json({ error: err.message });
        }
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const dislikePost = async (req, res) => {
    try {
        const userId = req.user.id;
        const postId = req.params.postId;

        const post = await PostRepository.getPostById(postId);
        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }

        const updatedPost = await PostRepository.dislikePost(userId, postId);
        res.json(updatedPost);
    } catch (err) {
        if (err.message === 'User has not liked this post') {
            return res.status(400).json({ error: err.message });
        }
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const checkIfUserLikedPost = async (req, res) => {
    try {
        const userId = req.user.id;
        const postId = req.params.postId;

        const hasLiked = await PostRepository.hasUserLikedPost(userId, postId);
        res.json({ liked: hasLiked });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

module.exports = { getUserPosts, createPost, updatePost, deletePost, getAllPosts, likePost, dislikePost, checkIfUserLikedPost };