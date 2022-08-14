const express = require('express');
const router = express.Router();
const { ensureAuth } = require('../middleware/auth');
const { findById } = require('../models/Story');

const Story = require('../models/Story');

// @desc    Show add page
// @route   GET /stories/add
router.get('/add', ensureAuth, (req, res) => {
    res.render('stories/add.hbs');
});

// @desc    Process add form
// @route   POST /stories
router.post('/', ensureAuth, async (req, res) => {
    try {
        req.body.user = req.user.id;
        await Story.create(req.body);
        res.redirect('/dashboard');
    } catch (err) {
        console.error(err);
        return res.render('error/500.hbs');
    }
});

// @desc    Show all stories
// @route   GET /stories
router.get('/', ensureAuth, async (req, res) => {
    try {
        const stories = await Story.find({ status: 'public' })
                                    .populate('user')
                                    .sort({ createdAt: 'desc' })
                                    .lean();
        res.render('stories/index.hbs', {
            stories,
        });
    } catch (err) {
        console.error(err);
        return res.render('error/500.hbs');
    }
});

// @desc    Show single stories
// @route   GET /stories/:id
router.get('/:id', ensureAuth, async (req, res) => {
    try {
        const story = await Story.findById(req.params.id).populate('user').lean();

        if (!story) {
            return res.render('error/404.hbs');
        }

        if (story.user != req.user.id && story.status == 'private') {
            res.render('error/404.hbs');
        } else {
            res.render('stories/show.hbs', {
                story
            });
        }

    } catch (err) {
        console.error(err);
        return res.render('error/500.hbs');
    }
});

// @desc    Show edit story page
// @route   GET /stories/edit/:id
router.get('/edit/:id', ensureAuth, async (req, res) => {
    try {
        const story = await Story.findOne({
            _id: req.params.id
        }).lean();
    
        if (!story) {
            return res.render('error/404.hbs');
        }
    
        if (story.user != req.user.id) {
            res.redirect('/stories');
        } else {
            res.render('stories/edit.hbs', {
                story
            });
        }   
    } catch (err) {
        console.error(err);
        return res.render('error/500.hbs');
    }
});

// @desc    Update story
// @route   PUT /stories/:id
router.put('/:id', ensureAuth, async (req, res) => {
    try {
        let story = await Story.findById(req.params.id).lean();

        if (!story) {
            return res.render('error/404.hbs');
        }
    
        if (story.user != req.user.id) {
            res.redirect('/stories');
        } else {
            story = await Story.findOneAndUpdate({ _id: req.params.id }, req.body, {
                new: true,
                runValidators: true
            })
        }
    
        res.redirect('/dashboard');
    } catch (err) {
        console.error(err);
        res.render('error/500.hbs');
    }
});

// @desc    Delete story
// @route   DELETE /stories/:id
router.delete('/:id', ensureAuth, async (req, res) => {
    try {
        let story = await Story.findById(req.params.id).lean();
        
        if (!story) {
            return res.render('error/404.hbs');
        }

        if (story.user != req.user.id) {
            res.redirect('/stories');
        } else {
            await Story.remove({ _id: req.params.id });
            res.redirect('/dashboard');
        }
    } catch (err) {
        console.error(err);
        return res.render('error/500.hbs');
    }
});

// @desc    Show user stories
// @route   GET /stories/user/:userId
router.get('/user/:userId', ensureAuth, async (req, res) => {
    try {
        const stories = await Story.find({
            user: req.params.userId,
            status: 'public'
        })
            .populate('user')
            .sort({ createdAt: 'desc' })
            .lean();

        res.render('stories/index.hbs', { stories });
    } catch (err) {
        console.error(err);
        return res.render('error/404.hbs');
    }
});

// @desc    Search stories by title
// @route   GET /stories/search/:query
router.get('/search/:query', ensureAuth, async (req, res) => {
    try {
        const stories = await Story.find({ title: new RegExp(req.query.query, 'i'), status: 'public' })
            .populate('user')
            .sort({ createdAt: 'desc' })
            .lean();

        res.render('stories/index.hbs', { stories });
    } catch (err) {
        console.error(err);
        return res.render('error/404.hbs');
    }
});

module.exports = router;