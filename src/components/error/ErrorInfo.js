import React from 'react';
import PropTypes from 'prop-types';
import wifi from '../../assets/icons/no-con.svg';
import './error-info.css';

const ErrorInfo = (props)=>
    <div className='error-info-container'>
        <div className='icon-layout'>
            <img className='icon' src={wifi} alt='no connection' />
        </div>
        <div className='info-layout'>
            <div className='message-container'>
                <div className='message'>{props.message}</div>
            </div>
            <div className='action-container'>
                <div className='btn-link' onClick={props.onCancel}>close</div>
            </div>
        </div>
    </div>


ErrorInfo.propTypes = {
    message: PropTypes.string.isRequired,
    onCancel: PropTypes.func
}

export default ErrorInfo;