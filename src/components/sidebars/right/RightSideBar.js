import React, { Component } from 'react';
import {connect} from 'react-redux';
import AutoSuggest from 'react-autosuggest';
import Tag from '../../tag'
import * as jokeAction from '../../../store/actions/jokes/jokeActionCreators';
import './right-sidebar.css';
import _ from 'lodash';
import * as utils from '../../../utils/utils'


const renderSuggestion = suggestion => (
    <div>
      {suggestion.name}
    </div>
  );

class RightSideBar extends Component {
    state={id:0, sentence: '', value:'', suggestions:[], selectedTagsList:[]}

    componentWillMount() {
        if(this.props.joke) this.setDefaultState(this.props.joke);
    }

    // When the component is loaded again.
    componentWillReceiveProps(nextProps) {
        this.setDefaultState(nextProps.joke);
    }

    setDefaultState(joke) {

        // Set state using data.
        this.setState({
            id: joke.id,
            sentence: joke.sentence,
            value: '',
            selectedTagsList: joke.tags
        })
    }

    onUpdateClickedHandler=()=>{
        //Return if sentence is less than 10
        if(this.state.sentence.length < 10) return;

        let joke={};

        //Save tags if there any
        if(this.state.selectedTagsList.length){
            const tags = utils.arrToStr(this.state.selectedTagsList, 'id');
            joke.tags = tags;
        }

        joke.sentence = this.state.sentence;
        if(this.state.id){
            //Update joke
            this.props.updateJoke(this.state.id, joke);
        }else{
            //Create new
            this.props.saveNewJoke(joke);
        }
    }

    onDeleteHandler=()=>{
        const jokeId = this.state.id;
        if(jokeId){
            this.props.deleteJoke(jokeId);
        }
    }

    onSentenceChangedHandler=(event)=>{
        this.setState({
            sentence: event.target.value
        })
    }

    onSuggestionsFetchRequested = ({ value }) => {
        this.setState({
          suggestions: this.getSuggestions(value)
        });
      };
     
    onSuggestionsClearRequested = () => {
        this.setState({
          suggestions: []
        });
      };

    getSuggestionValue = suggestion => {this.suggestedTag = {...suggestion}; return suggestion.name};

    getSuggestions = value => {
        const {tags} = this.props;
        const inputValue = value.trim().toLowerCase();
        const inputLength = inputValue.length;
       
        return inputLength === 0 ? [] : tags.filter(tag =>
          tag.name.toLowerCase().slice(0, inputLength) === inputValue
        );
    };
    onChange = (event, { newValue }) => {
        this.setState({
          value: newValue
        });
      };

    onSuggestionSelected=()=>{
        const selectedTagsList = [...this.state.selectedTagsList];

        //Kerb duplication
        if(!_.find(selectedTagsList, ['id', this.suggestedTag.id]) ){
            selectedTagsList.push(this.suggestedTag);
            this.setState({
                selectedTagsList: selectedTagsList
            })
        }
    }

    onTagCloseHandler=(id)=>{
        //Remove id from list
        const newTags = _.filter(this.state.selectedTagsList, (item)=>{ return item.id !== id;});
        this.setState({
            selectedTagsList : newTags
        })
    }

    onNewJokeClickedHandler=()=>{
        this.props.initNewJoke();
    }

    renderTags=()=>
        this.state.selectedTagsList.map((tag)=>
            <Tag key={tag.id} id={tag.id} name={tag.name} onClose={this.onTagCloseHandler}/>
        );

    render() {
        const { value, suggestions } = this.state;
 
        const inputProps = {
            placeholder: 'Search for a tag',
            value,
            onChange: this.onChange
        };
        return <div className='right-sidebar'>
                <div className='header-container'>
                    <button className='add-joke-btn' onClick={this.onNewJokeClickedHandler}>New Joke</button>
                </div>
                <div className='clearfix'></div>
                <div className='sentence-container'>
                    <div className='label'>tell a joke!</div>
                    <div className='clearfix'></div>
                    <textarea className='sentence' rows='8' cols='20' value={this.state.sentence} onChange={this.onSentenceChangedHandler}></textarea>
                </div>
                <div className='clearfix'></div>
                <div className='tags-container'>
                    <div className='label'>Tag this joke</div>
                    <div className='tags-search-container'>
                        <AutoSuggest
                            suggestions={suggestions}
                            onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
                            onSuggestionsClearRequested={this.onSuggestionsClearRequested}
                            getSuggestionValue={this.getSuggestionValue}
                            renderSuggestion={renderSuggestion}
                            inputProps={inputProps}
                            onSuggestionSelected={this.onSuggestionSelected}
                        />
                    </div>
                </div>
                <div className='clearfix'></div>
                <div className='selected-tags-container'>
                    {this.renderTags()}
                </div>
                <div className='clearfix'></div>
                <div className='action-container'>
                    <button className='save-btn' onClick={this.onUpdateClickedHandler}>{this.state.id?'update':'save'}</button>
                    <div className='delete-btn' onClick={this.onDeleteHandler}>delete</div>
                </div>
            </div>
    }
}

const mapStateToProps = state =>{
    return {
        joke: state.jokes.joke,
        tags: state.tags.tags
    }
}

const mapDispatchToProps = dispatch =>{
    return {
        fetchJoke : (jokeId) => dispatch(jokeAction.fetchJoke(jokeId)),
        initNewJoke : ()=>dispatch(jokeAction.initNewJoke()),
        updateJoke : (id, joke) =>dispatch(jokeAction.updateJoke(id, joke)),
        saveNewJoke : (joke)=>dispatch(jokeAction.createJoke(joke)),
        deleteJoke : (jokeId)=>dispatch(jokeAction.deleteJoke(jokeId))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(RightSideBar);
