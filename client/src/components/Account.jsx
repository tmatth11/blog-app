import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCookie } from '../utils/cookies';
import PostCard from './PostCard';

const Account = () => {
    const [error, setError] = useState(null);
    const [username, setUsername] = useState(null);
    const [posts, setPosts] = useState([]);
    const [newPostTitle, setNewPostTitle] = useState('');
    const [newPostContent, setNewPostContent] = useState('');

    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            const accessToken = getCookie('accessToken');
            if (!accessToken) {
                navigate('/login');
                return;
            }

            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/account`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${accessToken}`
                    },
                    credentials: 'include'
                });

                if (response.ok) {
                    const result = await response.json();
                    setUsername(result.user);
                    const sortedPosts = result.posts.sort((a, b) => b.id - a.id);
                    setPosts(sortedPosts);
                } else {
                    setError('Failed to fetch protected data');
                }
            } catch (err) {
                setError('Error fetching data');
            }
        };

        fetchData();
    }, [navigate]);

    const handleDelete = (postId) => {
        setPosts(prevPosts => prevPosts.filter(post => post.id !== postId));
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();

        const accessToken = getCookie('accessToken');
        if (!accessToken) {
            navigate('/login');
            return;
        }

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/account`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                },
                body: JSON.stringify({
                    title: newPostTitle,
                    content: newPostContent
                })
            });

            if (response.ok) {
                const newPost = await response.json();
                setPosts([newPost, ...posts]);
                setNewPostTitle('');
                setNewPostContent('');
            } else {
                setError('Failed to create new post');
            }
        } catch (err) {
            setError('Error creating new post');
        }
    };

    if (error) {
        return (
            <div className='mt-5 text-center'>
                <h2 className='mb-3'>Error: {error}</h2>
            </div>
        );
    }

    return (
        <div className='mt-5 text-center container d-flex flex-column align-items-center'>
            <h2 className='mb-3'>{username}'s Posts</h2>
            <form onSubmit={handleFormSubmit} className="mb-4 w-50">
                <div className="mb-3">
                    <label htmlFor="postTitle" className="form-label">Title</label>
                    <input
                        type="text"
                        className="form-control"
                        id="postTitle"
                        value={newPostTitle}
                        onChange={(e) => setNewPostTitle(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="postContent" className="form-label">Content</label>
                    <textarea
                        className="form-control"
                        id="postContent"
                        rows="3"
                        value={newPostContent}
                        onChange={(e) => setNewPostContent(e.target.value)}
                        required
                    ></textarea>
                </div>
                <button type="submit" className="btn btn-primary">Create Post</button>
            </form>
            {posts.map(post => (
                <PostCard 
                    key={post.id}
                    title={post.title} 
                    content={post.content} 
                    likes={post.likes} 
                    id={post.id}
                    onDelete={handleDelete}
                />
            ))}
        </div>
    );
};

export default Account;
