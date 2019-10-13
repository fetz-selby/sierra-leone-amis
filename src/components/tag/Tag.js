import React from 'react';
import PropTypes from 'prop-types';
import './tag.css';

const Tag = (props)=>
    <div className='tag-widget-selector-container'>
        <div className='header'>
            <div className='close' onClick={()=>props.onClose(props.id)}>x</div>
        </div>
        <div className='clearfix'></div>
        <div className='content'>
            {props.name}
        </div>
    </div>


Tag.propTypes = {
    id: PropTypes.number,
    name: PropTypes.string
}

export default Tag;