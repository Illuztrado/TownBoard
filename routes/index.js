const express = require('express');
const router = express.Router();
const { ensureAuth, ensureGuest } = require('../middleware/auth');

const Story = require('../models/Story');

// @desc    Login/Landing page
// @route   GET /
router.get('/', ensureGuest, (req, res) => {
    res.render('login.hbs', {
        layout: 'layouts-login'
    });
})

// @desc    Dashboard
// @route   GET /dashboard
router.get('/dashboard', ensureAuth, async (req, res) => {
    // console.log(req.user);
    try {
        const stories = await Story.find({ user: req.user.id }).lean();
        res.render('dashboard.hbs', {
            name: req.user.firstName,
            stories
        })
    } catch (err) {
        console.error(err);
        res.render('error/500.hbs');
    }
});

module.exports = router;