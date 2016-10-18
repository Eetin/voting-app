import React, { Component } from 'react';
import { getPolls } from './util';

import Polls from './polls.jsx';

export default class MyPolls extends Component {
    render() {
        return (
            <Polls loader={getPolls} label='My polls' />
        );
    }
}