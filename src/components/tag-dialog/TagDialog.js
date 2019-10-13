import React, { Component } from 'react';
import {connect} from 'react-redux';
import * as tagAction from '../../store/actions/tags/tagActionCreators';
import * as appAction from '../../store/actions/app/appActionCreators';

import './tag-dialog.css';

class TagDialog extends Component {
    state={tag:''}

    onTagChangedHandler=(event)=>{
        this.setState({
            tag: event.target.value
        })
    }

    onSaveClickedHandler=()=>{
        //Check if name exist
        const name = this.state.tag;
        if(name.length){
            this.props.saveTag(name);
        }else{
            //TODO show message to prompt
        }
    }

    onCancelClickedHandler=()=>{
        this.props.hideAddTag();
    }

    render(){
        return <div className='tag-dialog-container'>
            <div className='add-tag-label'>
                Tag Name
            </div>
            <div className='clearfix'></div>
            <input type='text' className='tag-input' value={this.state.tag} onChange={this.onTagChangedHandler} />
            <div className='clearfix'></div>
            <div className='tag-action-container'>
                <button className='tag-save-btn' onClick={this.onSaveClickedHandler}>save</button>
                <div className='tag-cancel-btn' onClick={this.onCancelClickedHandler}>cancel</div>
            </div>
        </div>
    }
}

const mapStateToProps = state =>{
    return {
    }
  }
  
  const mapDispatchToProps = dispatch =>{
    return {
      hideAddTag: ()=> dispatch(appAction.hideAddTag()),
      saveTag: (name)=> dispatch(tagAction.createTag(name))
    }
  }
  
  export default connect(mapStateToProps, mapDispatchToProps)(TagDialog);