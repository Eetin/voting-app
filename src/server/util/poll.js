const checkIfVoted = (userId, ip, poll) => {
    const userVoted = !!userId && poll.users.indexOf(userId) !== -1;
    const ipVoted = poll.ips.indexOf(ip) !== -1;
    return { userVoted, ipVoted };
};

const vote = (userId, ip, poll, option, res) => {
    const { userVoted, ipVoted } = checkIfVoted(userId, ip, poll);
    if ((!!userId && !userVoted) || (!userId && !ipVoted)) {
        if (!!userId && !userVoted) poll.users.push(userId);
        if (!userId && !ipVoted) poll.ips.push(ip);
        poll.votes.set(option, poll.votes[option] + 1);
        poll.save(err => {
            if (err) return res.json({ error: 'Could not save vote.' });
            res.json({
                poll: {
                    _id: poll._id,
                    title: poll.title,
                    options: poll.options,
                    votes: poll.votes
                },
                canVote: false
            });
        });
    } else {
        if (userVoted) res.json({ error: 'You have already voted' });
        else res.json({ error: 'Someone have already voted from this ip. Log in to vote.' });
    }
};

module.exports = { checkIfVoted, vote };
