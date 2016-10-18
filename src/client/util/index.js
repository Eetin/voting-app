import { browserHistory } from 'react-router';
import $ from 'jquery';

const util = {
    isLoggedIn: () => !!window.localStorage.getItem('authenticated'),
    logOut: () => {
        $.get('/auth/logout');
        window.localStorage.removeItem('authenticated');
    },
    getProfile: (callback) => $.get('/api/my/profile', callback),
    getAllPolls: (callback) => $.get('/public-api/polls', callback),
    getPolls: (callback) => $.get('/api/my/polls', callback),
    getPoll: (id, callback) => $.get(`/public-api/poll/${id}`, callback),
    createPoll: (poll, callback) => $.post('/api/my/polls', poll, callback),
    addOption: (id, option, callback) => $.post('/api/my/addoption', { id, option }, callback),
    postVote: (pollId, option, callback) => $.post(`/public-api/poll/${pollId}`, { option }, callback),
    removePoll: (pollId, callback) => $.ajax({
        url: `/api/my/poll/${pollId}`,
        type: 'DELETE',
        success: result => callback(null, result),
        error: err => callback(err)
    })
};

export default util;
module.exports = util;