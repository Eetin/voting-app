import React, { Component } from 'react';

import AllPolls from './allpolls.jsx';

export default class Home extends Component {
    render() {
        return (
            <div className='row'>
                <div className='home content col-xs-12'>
                    <AllPolls />
                </div>
            </div>
        );
    }
}