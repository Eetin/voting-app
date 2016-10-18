const mongoose = require('../db');
const Schema = mongoose.Schema;

const pollSchema = new Schema({
    _creator: { type: String, ref: 'User', required: true, index: true },
    title: { type: String, required: true },
    options: { type: [String], required: true },
    votes: { type: [Number], required: true },
    users: { type: [String] },
    ips: { type: [String] }
});

const Poll = mongoose.model('Poll', pollSchema);

module.exports = Poll;  