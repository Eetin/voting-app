import React, { Component } from 'react';
import { getAllPolls } from './util';

import Polls from './polls.jsx';

export default class AllPolls extends Component {
    render() {
        return (
            <Polls loader={getAllPolls} label='Polls' />
        );
    }
}