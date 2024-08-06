import { useEffect, useState } from 'react';
import { getCookie } from '../utils/cookies';

const PostItem = ({ post, handleLike }) => {
    const [isLiked, setIsLiked] = useState(false);
    const [likes, setLikes] = useState(post.likes);

    useEffect(() => {
        const checkIfLiked = async () => {
            try {
                const accessToken = getCookie('accessToken');
                const response = await fetch(`${import.meta.env.VITE_API_URL}/posts/${post.id}/liked`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${accessToken}`
                    }
                });
                const data = await response.json();
                setIsLiked(data.liked);
            } catch (error) {
                console.error('Error checking if post is liked:', error);
            }
        };

        checkIfLiked();
    }, [post.id]);

    const onLikeClick = () => {
        handleLike(post.id, isLiked, setLikes, setIsLiked);
    };

    return (
        <div className="col-8 col-md-6">
                <div className="card w-100 p-2 mb-2 rounded h-100 border border-2 border-secondary">
                    <div className="card-body d-flex flex-column">
                        <div className="d-flex justify-content-end gap-2 mb-3">
                            <p>{post.username}</p>
                        </div>
                        <h2 className="card-title">{post.title}</h2>
                        <p className="card-text">{post.content}</p>
                        <div className="d-flex flex-column align-items-end justify-content-end">
                            <p className="mb-2">Likes: {likes}</p>
                            <button className="btn btn-outline-secondary" onClick={onLikeClick}>
                                <i className={`bi ${isLiked ? 'bi-hand-thumbs-up-fill' : 'bi-hand-thumbs-up'}`}></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
    );
};

export default PostItem;