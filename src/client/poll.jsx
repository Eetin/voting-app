import React, { Component } from 'react';
import { browserHistory } from 'react-router';
import {
    scaleLinear,
    max,
    schemeCategory20,
    select
} from 'd3';
import { FacebookButton } from 'react-social';

import { isLoggedIn, getPoll, postVote, addOption, removePoll } from './util';
import InputElement from './inputElement.jsx';

export default class Poll extends Component {
    
    constructor(props) {
        super(props);
        this.state = {
            poll: {
                _id: '',
                title: '',
                options: [],
                votes: []
            },
            newOption: '',
            canVote: false,
            newOptionDisabled: true,
            myPoll: false
        };
        this.barHeight = 20;
        this.width = 600,
        this.height = 3 * this.state.poll.options.length * this.barHeight;
        this.margin = { top: 50, right: 20, bottom: 20, left: 20 };
        this.handleVote = this.handleVote.bind(this);
        this.updateChart = this.updateChart.bind(this);
        this.handleOptionsChange = this.handleOptionsChange.bind(this);
        this.handleNewOption = this.handleNewOption.bind(this);
        this.handleRemovePoll = this.handleRemovePoll.bind(this);
        this.validate = this.validate.bind(this);
    }
    
    componentWillMount() {
        getPoll(this.props.params.pollId, poll => {
            this.setState(poll);
        });
    }
    
    componentDidMount() {
        const { title } = this.state.poll;
        this.chart = select('#chart')
            .append('svg')
            .attr('width', this.margin.left + this.width + this.margin.right)
            .attr('height', this.margin.top + this.height + this.margin.bottom);
            
        this.header = this.chart.append('text')
            .text(title)
            .attr('x', (this.margin.left + this.width + this.margin.right) / 2)
            .attr('y', 40)
            .attr('text-anchor', 'middle')
            .style('font-size', '2em');
            
        this.optionsGroup = this.chart.append('g');
    }
    
    componentWillUpdate(nextProps, nextState) {
        this.updateChart(nextState.poll, nextState.canVote);
        this.validate(nextState);
    }
    
    shouldComponentUpdate(nextProps, nextState) {
        return this.state !== nextState;
    }
    
    updateChart(poll, canVote) {
        const padding = 5;
        const voteButtonWidth = 100;
        const { title, options, votes } = poll;
        const optionsData = options.map((option, i) => [option, votes[i]]);
        this.height = 3 * optionsData.length * (this.barHeight + padding);
        
        this.chart
            .attr('height', this.margin.top + this.height + this.margin.bottom);
        this.header
            .text(title);
        
        const optionsGroup = this.optionsGroup.selectAll('g')
            .data(optionsData)
            .enter().append('g')
            .attr('transform', (d, i) => {
                const x = this.margin.left;
                const y = this.margin.top + 2*this.barHeight + padding + 3*i * (this.barHeight + padding);
                return 'translate(' + x + ', ' + y + ')';
            });
            
        const xScale = scaleLinear()
            .domain([0, max(votes)])
            .range([20, this.width]);
            
        const color = schemeCategory20;
        
        optionsGroup.append('text')
            .attr('fill', 'black')
            .attr('y', -this.barHeight / 2)
            .text(d => d[0]);
        
        optionsGroup.append('rect').classed('votesRect', true)
            .style('fill', (d, i) => color[i % color.length])
            .attr('y', padding)
            .attr('height', this.barHeight)
            .attr('width', 0)
            .transition()
            .attr('width', d => xScale(d[1]));
            
        optionsGroup.append('text').classed('votesText', true)
            .attr('fill', 'white')
            .attr('font-weight', 'bold')
            .attr('x', d => {
                const x = xScale(d[1]) - 20;
                return x >= 0 ? x : 0;
            })
            .attr('y', this.barHeight / 2 + padding)
            .attr('text-anchor', 'right')
            .attr('alignment-baseline', 'middle')
            .text(d => d[1]);
            
        optionsGroup.append('line')
            .attr('x1', 0)
            .attr('y1', this.barHeight + 3 * padding)
            .attr('x2', this.width)
            .attr('y2', this.barHeight + 3 * padding)
            .attr('stroke', 'black')
            .attr('stroke-width', '1');
            
        optionsGroup.append('rect').classed('voteButtonRect', true)
            .attr('x', this.width - voteButtonWidth)
            .attr('y', -this.barHeight)
            .attr('width', voteButtonWidth)
            .attr('height', this.barHeight)
            .attr('fill', 'white')
            .attr('stroke', 'black')
            .attr('stroke-width', 1)
            .attr('rx', 5)
            .attr('ry', 5)
            .attr('cursor', 'pointer')
            .on('mouseover', function() {
                select(this).attr('fill', 'green');
            })
            .on('mouseout', function() {
                select(this).attr('fill', 'white');
            })
            .on('click', (d, i) =>
                this.handleVote(this.state.poll._id, i));
            
        optionsGroup.append('text').classed('voteButtonText', true)
            .attr('fill', 'black')
            .attr('x', this.width - voteButtonWidth / 2)
            .attr('y', -this.barHeight / 2)
            .attr('text-anchor', 'middle')
            .attr('alignment-baseline', 'middle')
            .text('Vote!')
            .attr('pointer-events', 'none');
            
        this.optionsGroup.selectAll('g')
            .select('.votesRect')
            .attr('width', d => xScale(d[1]));
            
        this.optionsGroup.selectAll('g')
            .select('.votesText')
            .attr('text-anchor', 'middle')
            .attr('x', d => {
                const x = xScale(d[1]) - 20;
                return x >= 10 ? x : 10;
            })
            .text(d => d[1]);
            
        this.optionsGroup.selectAll('g')
            .select('.voteButtonRect')
            .classed('hidden', !canVote);
            
        this.optionsGroup.selectAll('g')
            .select('.voteButtonText')
            .classed('hidden', !canVote);
    }
    
    handleVote(pollId, option) {
        postVote(pollId, option, data => {
            if (!data.error) this.setState(data);
            else console.error(data.error);
        });
    }
    
    handleOptionsChange(e) {
        this.setState({ newOption: e.target.value.trim() });
    }
    
    handleNewOption(e) {
        e.preventDefault();
        addOption(this.state.poll._id, this.state.newOption, data => {
            if (!data.error) this.setState(data);
            else console.error(data.error);
        });
    }
    
    handleRemovePoll(e) {
        e.preventDefault();
        removePoll(this.state.poll._id, (err, result) => {
            if (err) return console.error(err);
            if (result.error) return console.error(result.error);
            browserHistory.push('/my/polls');
        });
    }
    
    validate(nextState) {
        let newOptionDisabled = nextState.newOption === '';
        if (nextState.newOptionDisabled !== newOptionDisabled) {
            this.setState({ newOptionDisabled });
        }
    }
    
    render() {
        return (
            <div className='row'>
                <div className='col-xs-12'>
                    <div className='row'>
                        <div className='col-xs-12 poll content text-center'>
                            <div id='chart'></div>
                            { isLoggedIn() && this.state.canVote ?
                                <form className='poll-form col-xs-12 col-sm-offset-1 col-sm-10'>
                                <div className='input-group'>
                                    <InputElement
                                        key={`option-${this.state.poll.options.length}`}
                                        ref={`option-${this.state.poll.options.length}`}
                                        id={`option-${this.state.poll.options.length}`}
                                        name={`option-${this.state.poll.options.length}`}
                                        placeholder='Add your option here'
                                        handler={this.handleOptionsChange} />
                                    <span className="input-group-btn">
                                        <input
                                            className='btn btn-success'
                                            type ='submit'
                                            value='Add and vote'
                                            disabled={this.state.newOptionDisabled}
                                            onClick={this.handleNewOption} />
                                    </span>
                                </div>
                            </form> : '' }
                            { this.state.myPoll ?
                                <button
                                    className='btn btn-danger'
                                    onClick={this.handleRemovePoll}>
                                    Remove poll
                                </button> : '' }
                        </div>
                    </div>
                    <div className='row'>
                        <div className='col-xs-12 text-center'>
                            <div className='share-button-facebook'>
                            	<FacebookButton
                            	    appId='496138937261798'
                            	    url={window.location.href}
                            	    target='popup'
                            	    message={this.state.poll.title}
                            	    className='btn btn-social btn-facebook'>
                            	    <span className="fa fa-facebook"></span> Share
                            	</FacebookButton>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}