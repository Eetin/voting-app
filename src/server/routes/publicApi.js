const express = require('express');
const { getAuth } = require('../jwt');
const publicApiRouter = express.Router();

const Poll = require('../models/poll');
const { vote } = require('../util');

//Get all polls
publicApiRouter.get('/polls', (req, res) => {
    Poll.find({}, 'title options votes', (err, polls) => {
        if (err) return res.json({ error: 'Could not get polls' });
        res.json({ polls });
    });
});

// Get poll with given id
publicApiRouter.get('/poll/:id', (req, res) => {
    const userId = getAuth(req);
    const ip = req.ip;
    const pollId = req.params.id;
    
    Poll.findOne({ _id: pollId }, (err, poll) => {
        if (!err && !!poll) {
            const myPoll = !!userId && userId === poll._creator;
            const canVote = (!!userId && poll.users.indexOf(userId) === -1) ||
                (!userId && poll.ips.indexOf(ip) === -1);
            res.json({
                poll: {
                    _id: poll._id,
                    title: poll.title,
                    options: poll.options,
                    votes: poll.votes
                },
                canVote,
                myPoll
            });
        } else {
            res.json({ error: 'Could not find poll' });
        }
    });
});

// Vote for given option
publicApiRouter.post('/poll/:id', (req, res) => {
    const userId = getAuth(req);
    const ip = req.ip;
    const pollId = req.params.id;
    const option = +req.body.option;
    
    Poll.findOne({ _id: pollId }, (err, poll) => {
        if (err) return res.json({ error: 'Could not find poll' });
        vote(userId, ip, poll, option, res);
    });
});

module.exports = publicApiRouter;