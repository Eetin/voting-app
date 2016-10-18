const express = require('express');
const apiRouter = express.Router();
const User = require('../models/user');
const Poll = require('../models/poll');
const { vote } = require('../util');

// Get logged in user profile
apiRouter.get('/my/profile', (req, res) => {
    const userId = req.userId;
    User.findOne({ userId }, (err, user) => {
        if (!err && !!user) {
            res.json({ name: user.name, email: user.email, photo: user.photo });
        } else {
            res.json({ error: 'Could not find user profile.' });
        }
    });
});

// Get logged in user polls
apiRouter.get('/my/polls', (req, res) => {
    const userId = req.userId;
    Poll.find({ _creator: userId }, 'title options votes', (err, polls) => {
        if (!err) {
            res.json({ polls });
        } else {
            res.json({ error: 'Could not find user polls.' });
        }
    });
});

// Create new poll
apiRouter.post('/my/polls', (req, res) => {
    const userId = req.userId;
    const { title, options } = req.body;
    
    const poll = new Poll({
        _creator: userId,
        title: title,
        options: options,
        votes: Array(options.length).fill(0),
        users: [],
        ips: []
    });
    poll.save(err => {
        if (err) {
            return res.json({ error: 'Failed to save poll to database' });
        }
        res.json({ _id: poll._id, title: poll.title });
    });
});

// Add another option to existing poll
apiRouter.post('/my/addoption', (req, res) => {
    const userId = req.userId;
    const ip = req.ip;
    const { id, option } = req.body;
    
    Poll.findOne({ _id: id}, (err, poll) => {
        if (err) return res.json({ error: 'Could not find poll' });
        const newIndex = poll.options.length;
        poll.options.set(newIndex, option);
        poll.votes.set(newIndex, 0);
        vote(userId, ip, poll, newIndex, res);
    });
});

// Delete poll
apiRouter.delete('/my/poll/:id', (req, res) => {
    const userId = req.userId;
    const id = req.params.id;
    
    Poll.findOneAndRemove({ _id: id, _creator: userId }, (err, poll) => {
        if (err || !poll) return res.json({ error: 'Could not delete poll' });
        res.json({ success: true });
    });
});

module.exports = apiRouter;