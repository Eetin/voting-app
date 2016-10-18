import React, { Component } from 'react';
import PollLink from './pollLink.jsx';

export default class Polls extends Component {
    constructor(props) {
        super(props);
        this.state = {
            polls: null
        };
        this.renderLoading = this.renderLoading.bind(this);
        this.renderPolls = this.renderPolls.bind(this);
    }
    
    componentWillMount() {
        this.serverRequest = this.props.loader(polls => {
            this.setState(polls);
        });
    }
    
    componentWillUnmount() {
        this.serverRequest.abort();
    }
    
    renderLoading() {
        return (
            <div className='polls content'>
                <h1 className='text-center'>Loading polls...</h1>
            </div>
        );
    }
    
    renderPolls() {
        return (
            <div className='polls content'>
                <h1 className='text-center'>{this.props.label}</h1>
                {
                    this.state.polls.map((poll, i) => {
                        return (
                            <PollLink
                                key={`poll-${i}`}
                                title={poll.title}
                                pollId={poll._id} />
                        );
                    })
                }
            </div>
        );
    }
    
    render() {
        return !!this.state.polls ? this.renderPolls() : this.renderLoading();
    }
}