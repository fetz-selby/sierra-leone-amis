import React, { Component } from 'react';
import {connect} from 'react-redux';
import Jokes from '../../components/jokes'
import * as jokeAction from '../../store/actions/jokes/jokeActionCreators';
import './jokes-container.css';

class JokesContainer extends Component {

    onJokeClickedHandler=(id)=>{
       this.props.fetchJoke(id);
    }

    render() {
        const {jokes} = this.props;
        return <div className='jokes-container'>
                <Jokes jokes={jokes}
                        onJokeClicked={this.onJokeClickedHandler}></Jokes>
            </div>
    }
}

const mapStateToProps = state =>{
    return {
        jokes: state.jokes.jokes
    }
}

const mapDispatchToProps = dispatch =>{
    return {
        fetchJoke : (jokeId) => dispatch(jokeAction.fetchJoke(jokeId))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(JokesContainer);
