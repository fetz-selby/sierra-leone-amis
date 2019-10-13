import React from 'react';
import PropTypes from 'prop-types';
import './dialog.css';

const Dialog = (props)=>
    <div className='dialog-container'>
        <div className='message-container'>
            <div className='message'>{props.message}</div>
        </div>
        <div className='action-container'>
            <div className='btn-link' onClick={props.onCancel}>cancel</div>
            <button className='btn' onClick={()=>props.onContinue(props.id)}>continue</button>
        </div>
    </div>


Dialog.propTypes = {
    id: PropTypes.number,
    message: PropTypes.string.isRequired,
    onContinue: PropTypes.func,
    onCancel: PropTypes.func
}

export default Dialog;