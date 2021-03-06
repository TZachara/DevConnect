import axios from 'axios';
import { setAlert } from './alert';
import {
    GET_POSTS,
    POST_ERROR,
    UPDATE_LIKES,
    DELETE_POST,
    ADD_POST,
    GET_POST,
    ADD_COMMENT,
    REMOVE_COMMENT,
} from './types';

// Get Posts
export const getPosts = () => async (dispatch) => {
    try {
        const res = await axios.get('/api/posts');

        dispatch({
            type: GET_POSTS,
            payload: res.data,
        });
    } catch (err) {
        dispatch({
            type: POST_ERROR,
            payload: { msg: err.response.statusText, status: err.response.status },
        });
    }
};

// Add Like
export const addLike = (postId) => async (dispatch) => {
    try {
        const res = await axios.put(`/api/posts/like/${postId}`);

        dispatch({
            type: UPDATE_LIKES,
            payload: {
                id: postId,
                likes: res.data,
            },
        });
    } catch (err) {
        dispatch({
            type: POST_ERROR,
            payload: {
                msg: err.response.statusText,
                status: err.response.status,
            },
        });
    }
};

// remove Like
export const removeLike = (postId) => async (dispatch) => {
    try {
        await axios.put(`/api/posts/unlike/${postId}`);

        dispatch({
            type: UPDATE_LIKES,
            payload: {
                id: postId,
            },
        });
    } catch (err) {
        dispatch({
            type: POST_ERROR,
            payload: {
                msg: err.response.statusText,
                status: err.response.status,
            },
        });
    }
};

// Delete Post
export const deletePost = (postId) => async (dispatch) => {
    try {
        const res = await axios.delete(`/api/posts/${postId}`);

        dispatch({
            type: DELETE_POST,
            payload: {
                id: postId,
                likes: res.data,
            },
        });
        dispatch(setAlert('Post deleted!', 'danger'));
    } catch (err) {
        dispatch({
            type: POST_ERROR,
            payload: {
                msg: err.response.statusText,
                status: err.response.status,
            },
        });
    }
};

// Add Post
export const addPost = (formData) => async (dispatch) => {
    const config = {
        headers: {
            'Content-Type': 'application/json',
        },
    };

    try {
        const res = await axios.post(`/api/posts/`, formData, config);

        dispatch({
            type: ADD_POST,
            payload: res.data,
        });
        dispatch(setAlert('Post created!', 'success'));
    } catch (err) {
        dispatch({
            type: POST_ERROR,
            payload: {
                msg: err.response.statusText,
                status: err.response.status,
            },
        });
    }
};

// Get Post
export const getPost = (postId) => async (dispatch) => {
    try {
        const res = await axios.get(`/api/posts/${postId}`);

        dispatch({
            type: GET_POST,
            payload: res.data,
        });
    } catch (err) {
        dispatch({
            type: POST_ERROR,
            payload: { msg: err.response.statusText, status: err.response.status },
        });
    }
};

// Add comment
export const addComment = (postId, formData) => async (dispatch) => {
    const config = {
        headers: {
            'Content-Type': 'application/json',
        },
    };

    try {
        const res = await axios.post(`/api/posts/comment/${postId}`, formData, config);
        console.log(res);
        dispatch({
            type: ADD_COMMENT,
            payload: res.data,
        });
        dispatch(setAlert('Comment added!', 'success'));
    } catch (err) {
        dispatch({
            type: POST_ERROR,
            payload: {
                msg: err.response.statusText,
                status: err.response.status,
            },
        });
    }
};

// Delete comment
export const deleteComment = (postId, commentId) => async (dispatch) => {
    try {
        await axios.delete(`/api/posts/comments/${postId}/${commentId}`);

        dispatch({
            type: REMOVE_COMMENT,
            payload: commentId,
        });
        dispatch(setAlert('Comment removed!', 'danger'));
    } catch (err) {
        dispatch({
            type: POST_ERROR,
            payload: {
                msg: err.response.statusText,
                status: err.response.status,
            },
        });
    }
};
