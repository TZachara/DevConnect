const express = require('express');
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const { check, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const config = require('config');
// Create router
const router = express.Router();

// Bring in User Model
const User = require('../../models/User');

// @route   Post api/users
// @desc    Register User
// @access  public
router.post(
    '/',
    [
        check('name', 'Name is required').notEmpty(),
        check('email', 'Please include a valid mail').isEmail(),
        check(
            'password',
            'Please enter a password with 6 or more characters'
        ).isLength({ min: 6 }),
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const { name, email, password } = req.body;
        try {
            // See if user exists
            let user = await User.findOne({ email: email });
            if (user) {
                // Below error is formated the same way as errors for Body validation
                return res.status(400).json({
                    errors: [{ msg: 'User already Exists' }],
                });
            }
            // Get user Gravatar
            // s -> size, r -> rating (PG-13), d -> default
            const avatar = await gravatar.url(email, {
                s: '200',
                r: 'pg',
                d: 'mm',
            });
            user = new User({
                name: name,
                email: email,
                avatar: avatar,
                password: password,
            });
            // Encrypt password
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(password, salt);
            // Save user to db
            await user.save();
            // return JsonWebToken
            const payload = {
                user: {
                    id: user.id,
                },
            };
            jwt.sign(
                payload,
                config.get('jwtSecret'),
                { expiresIn: 3600000 },
                (err, token) => {
                    if (err) {
                        throw err;
                    }
                    res.json({ token });
                }
            );
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server Error');
        }
    }
);

module.exports = router;
