import React, { Component } from 'react';
import { Link } from 'react-router';

export default class PollLink extends Component {
    render() {
        const { pollId, title } = this.props;
        return (
            <p><Link to={`/poll/${pollId}`}>{title}</Link></p>
        );
    }
}