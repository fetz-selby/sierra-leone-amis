import React from 'react';
import PropTypes from 'prop-types';
import arrow from '../../assets/icons/right-arrow.svg';
import './info-widget.css';

const InfoWidget = (props) => 
    <div className='info-widget-container' onClick={()=>props.click(props.id)}>
        <div className='info'>
            <div className='row'>
                <div className='title'>{props.title}</div>
            </div>

            <div className='clearfix'></div>
        </div>
        <div className='action'>
            <img className='img' src={arrow} alt='hide'/>
        </div>
    </div>

InfoWidget.propTypes = {
    id: PropTypes.number,
    title: PropTypes.string.isRequired,
    click: PropTypes.func
}

export default InfoWidget;