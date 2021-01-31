const express = require('express');
const auth = require('../../middleware/auth');
const { check, validationResult } = require('express-validator');
const User = require('../../models/User');
const Post = require('../../models/Post');
const Profile = require('../../models/Profile');

// Create router
const router = express.Router();

// @route   POST api/posts
// @desc    Create a post
// @access  private
router.post('/', [auth, [check('text', 'Text is required').notEmpty()]], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ msg: errors.array() });
    }

    try {
        const user = await User.findById(req.user.id).select('-password');

        const newPost = new Post({
            text: req.body.text,
            name: user.name,
            avatar: user.avatar,
            user: req.user.id,
        });

        const post = await newPost.save();

        res.json(post);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   Get api/posts
// @desc    Get all posts
// @access  private
router.get('/', auth, async (req, res) => {
    try {
        // sort date: -1 sets sortin from
        const posts = await Post.find().sort({ date: -1 });
        res.json(posts);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   Get api/posts/:post_id
// @desc    Get post by id
// @access  private
router.get('/:post_id', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.post_id);
        if (!post) {
            return res.status(404).json({ msg: 'Post does not exist' });
        }
        res.json(post);
    } catch (err) {
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Post does not exist' });
        }
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   Delete api/posts/:post_id
// @desc    Delete post by id
// @access  private
router.delete('/:post_id', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.post_id);
        if (!post) {
            return res.status(404).json({ msg: 'Post does not exist' });
        }
        // Check if user is owner of post
        if (post.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'User not authorized' });
        }
        await post.remove();
        res.json({ msg: 'Post Removed' });
    } catch (err) {
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Post does not exist' });
        }
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   PUT api/posts/like/:post_id
// @desc    Like post
// @access  private
router.put('/like/:post_id', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.post_id);
        if (!post) {
            return res.status(404).json({ msg: 'Post does not exist' });
        }
        // Check if post has been liked
        if (
            post.likes.filter((like) => {
                return like.user.toString() === req.user.id;
            }).length > 0
        ) {
            return res.status(400).json({ msg: 'Post already liked' });
        }
        post.likes.unshift({ user: req.user.id });

        await post.save();

        res.json(post.likes);
    } catch (err) {
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Post does not exist' });
        }
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   PUT api/posts/unlike/:post_id
// @desc    Unlike post
// @access  private
router.put('/unlike/:post_id', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.post_id);
        if (!post) {
            return res.status(404).json({ msg: 'Post does not exist' });
        }
        // Check if post has been liked
        if (
            post.likes.filter((like) => {
                return like.user.toString() === req.user.id;
            }).length === 0
        ) {
            return res.status(400).json({ msg: 'Post has not been liked by you' });
        }

        post.likes = post.likes.filter((like) => like.user.toString() !== req.user.id);

        await post.save();

        res.json(post.likes);
    } catch (err) {
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Post does not exist' });
        }
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST api/posts/comment/:post_id
// @desc    Comment on a post
// @access  private
router.post('/comment/:post_id', [auth, [check('text', 'Text is required').notEmpty()]], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ msg: errors.array() });
    }

    try {
        const user = await User.findById(req.user.id).select('-password');
        const post = await Post.findById(req.params.post_id);

        const newComment = {
            text: req.body.text,
            name: user.name,
            avatar: user.avatar,
            user: req.user.id,
        };

        post.comments.unshift(newComment);

        await post.save();

        res.json(post);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   DELETE api/posts/comments/:post_id/:comm_id
// @desc    Delete comment on a post
// @access  private
router.delete('/comments/:post_id/:comm_id', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.post_id);
        const commentToDelete = post.comments.find((comment) => {
            return comment.id === req.params.comm_id;
        });
        // Check if comment exists
        if (!commentToDelete) {
            return res.status(400).json({ msg: 'Comment does not exists' });
        }
        // Check if user is owner of comment
        if (commentToDelete.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'User not authorized' });
        }

        post.comments = post.comments.filter((comment) => {
            return comment.id.toString() !== req.params.comm_id;
        });

        await post.save();
        res.json(post);
    } catch (err) {
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Comment does not exists' });
        }
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
