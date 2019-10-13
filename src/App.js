import React, { Component } from 'react';
import {HashRouter as Router, Route} from 'react-router-dom';
import {connect} from 'react-redux';
import LeftSideBar from './components/sidebars/left';
import RightSideBar from './components/sidebars/right';
import JokesContainer from './containers/jokes/JokesContainer';
import Search from './components/header/search-header'
import Overlay from './components/overlay';
import TagDialog from './components/tag-dialog';
import Login from './components/login';
import * as tagAction from './store/actions/tags/tagActionCreators';
import * as jokeAction from './store/actions/jokes/jokeActionCreators';
import * as appAction from './store/actions/app/appActionCreators';

import './assets/styles/layout.css';
import './assets/styles/reset.css';
import Dialog from './components/dialog';
import ErrorInfo from './components/error';

class App extends Component {

  showLoginOverlay=(users=[])=>
    <Overlay showHeader={false}>
      <Login onLoginClicked={this.onLoginClickedHandler} users={users}/>
    </Overlay>

  showConfirmOverlay=(message, id)=>
    <Overlay showHeader={true} onHide={this.hideDeleteDialogHandler}>
       <Dialog id={id} 
               message={message}
               onContinue={this.onDeleteContinueClickedHandler}
               onCancel={this.onDeleteCancelClickHandler}/>
    </Overlay>

  showNetworkErrorOverlay = (message) =>
    <Overlay>
      <ErrorInfo message={message}
                 onCancel={this.onErrorCancel}></ErrorInfo>
    </Overlay>

  showAddTagOverlay = () =>
    <Overlay>
      <TagDialog />
    </Overlay>
  
  tagWidgetClickHandler=(id)=>{
    //Fetch all joke with tagId
    this.props.loadJokes(id);
  }

  onSearchChangeHandler=(event)=>{
    const word = event.target.value;
    this.props.searchTag(word);
  }

  onAddClickedHandler=()=>{
    this.props.showAddTagDialog();
  }

  onLogoutHandler=()=>{
    this.props.logout();
  }

  render() {
    const {tags, token, username, joke, showAddTag} = this.props;
    return  <div>
              {token.length ? '' : this.showLoginOverlay()}
              {showAddTag ? this.showAddTagOverlay(): ''}
              {/* {networkError ? this.showNetworkErrorOverlay(networkErrorMessage) : ''} */}
              <Search></Search>
              <LeftSideBar tags={tags} 
                       showSideBar={true} 
                       onSearchChange={this.onSearchChangeHandler}
                       tagWidgetClick={this.tagWidgetClickHandler}
                       onAddClicked={this.onAddClickedHandler}
                       username={username} 
                       onLogout={this.onLogoutHandler}/>
              <div className='content'>
                <Router>
                  <div>   
                    <Route path='/' exact component={JokesContainer}/> 
                  </div>
                </Router>
              </div>
              <RightSideBar joke={joke} />
          </div>
  }
}

const mapStateToProps = state =>{
  return {
     token : state.app.token,
     tags: state.tags.tags,
     username: state.app.name,
     joke: state.jokes.joke,
     showAddTag: state.app.showAddTag
  }
}

const mapDispatchToProps = dispatch =>{
  return {
    loadTags: ()=> dispatch(tagAction.fetchAllTags()),
    loadJokes: (tagId)=>dispatch(jokeAction.fetchJokesWithTag(tagId)),
    searchTag: (word)=>dispatch(tagAction.tagSearch(word)),
    showAddTagDialog: ()=>dispatch(appAction.showAddTag()),
    logout: ()=>dispatch(appAction.logout())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);