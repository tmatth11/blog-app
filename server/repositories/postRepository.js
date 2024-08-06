const db = require('../db');

class PostRepository {
    static async getPostsByUserId(userId) {
        const result = await db.query('SELECT * FROM posts WHERE user_id = $1', [userId]);
        return result.rows;
    }

    static async createPost(userId, title, content) {
        const result = await db.query(
            'INSERT INTO posts (user_id, title, content) VALUES ($1, $2, $3) RETURNING *',
            [userId, title, content]
        );
        return result.rows[0];
    }

    static async getPostById(postId) {
        const result = await db.query('SELECT * FROM posts WHERE id = $1', [postId]);
        return result.rows[0];
    }

    static async updatePost(postId, title, content) {
        const result = await db.query(
            'UPDATE posts SET title = $1, content = $2 WHERE id = $3 RETURNING *',
            [title, content, postId]
        );
        return result.rows[0];
    }

    static async deletePost(postId) {
        await db.query('DELETE FROM post_likes WHERE post_id = $1', [postId]);
        await db.query('DELETE FROM posts WHERE id = $1', [postId]);
    }

    static async getAllPosts() {
        const result = await db.query(`
            SELECT posts.*, users.username 
            FROM posts 
            JOIN users ON posts.user_id = users.id
        `);
        return result.rows;
    }

    static async hasUserLikedPost(userId, postId) {
        const result = await db.query(
            'SELECT 1 FROM post_likes WHERE user_id = $1 AND post_id = $2',
            [userId, postId]
        );
        return result.rowCount > 0;
    }

    static async likePost(userId, postId) {
        try {
            const hasLiked = await this.hasUserLikedPost(userId, postId);
            if (hasLiked) {
                throw new Error('User has already liked this post');
            }

            await db.query(
                'INSERT INTO post_likes (user_id, post_id) VALUES ($1, $2)',
                [userId, postId]
            );

            const result = await db.query(
                'UPDATE posts SET likes = likes + 1 WHERE id = $1 RETURNING *',
                [postId]
            );

            return result.rows[0];
        }
        catch (error) {
            throw error;
        }
    }

    static async dislikePost(userId, postId) {
        try {
            const hasLiked = await this.hasUserLikedPost(userId, postId);
            if (!hasLiked) {
                throw new Error('User has not liked this post');
            }

            await db.query(
                'DELETE FROM post_likes WHERE user_id = $1 AND post_id = $2',
                [userId, postId]
            );

            const result = await db.query(
                'UPDATE posts SET likes = likes - 1 WHERE id = $1 RETURNING *',
                [postId]
            );

            return result.rows[0];
        } catch (error) {
            throw error;
        }
    }
}

module.exports = PostRepository;