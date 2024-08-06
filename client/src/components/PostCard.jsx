import { useEffect, useState } from 'react';
import { getCookie } from '../utils/cookies';

const PostCard = ({ title, content, likes: initialLikes, id, onDelete }) => {
    const [currentTitle, setCurrentTitle] = useState(title);
    const [currentContent, setCurrentContent] = useState(content);
    const [editTitle, setEditTitle] = useState(title);
    const [editContent, setEditContent] = useState(content);
    const [isLiked, setIsLiked] = useState(false);
    const [likes, setLikes] = useState(initialLikes);

    useEffect(() => {
        const checkIfLiked = async () => {
            try {
                const accessToken = getCookie('accessToken');
                const response = await fetch(`${import.meta.env.VITE_API_URL}/posts/${id}/liked`, {
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
    }, [id]);

    const handleLike = async () => {
        try {
            const accessToken = getCookie('accessToken');
            const endpoint = isLiked ? `/posts/${id}/dislike` : `/posts/${id}/like`;
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
                console.error('Error liking/disliking post:', await response.json());
            }
        } catch (error) {
            console.error('Error liking/disliking post:', error);
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            const accessToken = getCookie('accessToken');
            const response = await fetch(`${import.meta.env.VITE_API_URL}/account/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                },
                body: JSON.stringify({
                    title: editTitle,
                    content: editContent,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                setCurrentTitle(data.title);
                setCurrentContent(data.content);
                document.getElementById(`editModal${id}`).querySelector('.btn-close').click();
            }
        }
        catch (error) {
            console.error('Error updating post:', error);
        }
    };

    const handleDelete = async () => {
        try {
            const accessToken = getCookie('accessToken');
            const response = await fetch(`${import.meta.env.VITE_API_URL}/account/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                },
            });
    
            if (response.ok) {
                onDelete(id);
            } else {
                console.error('Error deleting post:', await response.json());
            }
        } catch (error) {
            console.error('Error deleting post:', error);
        }
    };

    return (
        <>
            {/* Post Card */}
            <div className="col col-md-6">
                <div className="card w-100 p-2 mb-2 rounded h-100 border border-2 border-secondary">
                    <div className="card-body d-flex flex-column">
                        <div className="d-flex justify-content-end gap-2 mb-3">
                            <button className="btn btn-primary" data-bs-toggle="modal" data-bs-target={`#editModal${id}`}>Edit</button>
                            <button className="btn btn-danger" onClick={handleDelete}>Delete</button>
                        </div>
                        <h2 className="card-title">{currentTitle}</h2>
                        <p className="card-text">{currentContent}</p>
                        <div className="d-flex flex-column align-items-end justify-content-end">
                            <p className="mb-2">Likes: {likes}</p>
                            <button className="btn btn-outline-secondary" onClick={handleLike}>
                                <i className={`bi ${isLiked ? 'bi-hand-thumbs-up-fill' : 'bi-hand-thumbs-up'}`}></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Edit Modal */}
            <div className="modal fade" id={`editModal${id}`} tabIndex="-1" aria-labelledby={`editModalLabel${id}`} aria-hidden="true">
                <div className="modal-dialog">
                    <form onSubmit={handleUpdate}>
                        <div className="modal-content">
                            <div className="modal-header">
                                <h1 className="modal-title fs-5" id={`editModalLabel${id}`}>Edit Post</h1>
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div className="modal-body">
                                <div className="mb-3">
                                    <label htmlFor={`updatedTitle${id}`} className="form-label">Updated Title</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id={`updatedTitle${id}`}
                                        value={editTitle}
                                        onChange={(e) => setEditTitle(e.target.value)}
                                    />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor={`updatedContent${id}`} className="form-label">Updated Content</label>
                                    <textarea
                                        className="form-control"
                                        id={`updatedContent${id}`}
                                        rows="3"
                                        value={editContent}
                                        onChange={(e) => setEditContent(e.target.value)}
                                    ></textarea>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                <button type="submit" className="btn btn-primary">Save changes</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}

export default PostCard;