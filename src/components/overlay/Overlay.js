import React from 'react';
import PropTypes from 'prop-types';
import './overlay.css';
import cancel from '../../assets/icons/cancel.svg';

const Overlay = (props)=>
    <div className='overlay-container'>
        <div className='overlay'>
            <div className={props.showHeader?'header':'hide'} >
                <img onClick={props.onHide} className='close' src={cancel} alt='close' />
            </div>
            <div className='clearfix'></div>
            {props.children}
        </div>
    </div>

Overlay.propTypes = {
    showHeader: PropTypes.bool,
    onHide: PropTypes.func
}    

export default Overlay;