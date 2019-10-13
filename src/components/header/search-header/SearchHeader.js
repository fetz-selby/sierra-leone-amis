import React, { Component } from 'react';
import {connect} from 'react-redux';
import * as jokeAction from '../../../store/actions/jokes/jokeActionCreators';
import './search-header.css';

class SearchHeader extends Component {
    state={search:''};

    onSearchChangeHandler=(event)=>{
        const word = event.target.value;
        this.setState({
            search: word
        });

        if(!word.length){
            this.props.fetchAllJokes(0);
        }else{
            this.props.jokeSearch(word);
        }
    }

    render() {
        return <div className='search-header-container'>
                <input className='search-input' type='text' placeholder='Type to Search' value={this.state.search} onChange={this.onSearchChangeHandler}/>
            </div>
    }
}

const mapStateToProps = state =>{
    return {
    }
}

const mapDispatchToProps = dispatch =>{
    return {
        jokeSearch : (word) => dispatch(jokeAction.searchJoke(word)),
        fetchAllJokes : (tagId) => dispatch(jokeAction.fetchJokesWithTag(tagId))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(SearchHeader);
