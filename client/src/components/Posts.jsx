import { useEffect, useState } from 'react';
import { getCookie } from '../utils/cookies';
import PostItem from './PostItem';

const Posts = () => {
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const accessToken = getCookie('accessToken');
                const response = await fetch(`${import.meta.env.VITE_API_URL}/posts`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${accessToken}`
                    },
                });
                const data = await response.json();
                const sortedPosts = data.sort((a, b) => b.id - a.id);
                setPosts(sortedPosts);
            } catch (error) {
                console.error('Error fetching posts:', error);
            }
        };

        fetchPosts();
    }, []);

    const handleLike = async (postId, isLiked, setLikes, setIsLiked) => {
        try {
            const accessToken = getCookie('accessToken');
            const endpoint = isLiked ? `/posts/${postId}/dislike` : `/posts/${postId}/like`;
            const response = await fetch(`${import.meta.env.VITE_API_URL}${endpoint}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                },
            });

            if (response.ok) {
                setIsLiked(!isLiked);
                setLikes(prevLikes => isLiked ? prevLikes - 1 : prevLikes + 1);
            } else {
                console.error('Error liking/disliking post:', response.statusText);
            }
        } catch (error) {
            console.error('Error liking/disliking post:', error);
        }
    };

    return (
        <div className="mt-5 text-center container d-flex flex-column align-items-center">
            <h1>Posts</h1>
            {posts.map(post => (
                <PostItem key={post.id} post={post} handleLike={handleLike} />
            ))}
        </div>
    );
};

export default Posts;