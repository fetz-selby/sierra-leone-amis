import React from 'react';
import PropTypes from 'prop-types';
// import arrow from '../../assets/icons/right-arrow.svg';
import './jokes.css';

const JokeWidget = (props) => 
    <div className='joke-widget-container' onClick={()=>props.click(props.joke.id)}>
        <div className='info'>{props.joke.sentence}</div>
        <div className='clearfix'></div>
    </div>

const Jokes = (props) => 
    <div className='joke-list-container'>
        {props.jokes.map((joke)=>
        <JokeWidget key={joke.id} joke={joke} click={props.onJokeClicked}></JokeWidget>)}
    </div>

Jokes.propTypes = {
    jokes: PropTypes.array.isRequired,
    onJokeClicked: PropTypes.func.isRequired
}

export default Jokes;