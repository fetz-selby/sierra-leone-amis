import React from 'react';
import InfoWidget from '../../infowidget';

import PropTypes from 'prop-types';
import '../../../assets/styles/layout.css';
import logo from '../../../assets/icons/healthera.png';
import './left-sidebar.css';

const SideBarLogo = (props) =>{

    const logo_label = 'healthera';
    return <div className='logo-container'>
                <div className='logo'>
                     <img className='logo-img' src={logo} alt={logo_label}></img>
                </div>
                <div onClick={props.onLogout} className='logout'>logout</div>
                <div className='clearfix'></div>
            </div>
}

const AddTagButton = (props) =>
    <div className='tag-container'>
        <div className='add-tag-btn' onClick={props.onAddClicked}>Add Tag</div>
    </div>

const SearchInput = (props) =>
    <input className='search' placeholder='search saved tags' onChange={props.onChange} />

const UserOption = (props) =>
    <div>
        <div className='user-option'>
            <div className='user-label'>Welcome 
                 <span className='user-name'>{props.username?' '+props.username:' User'}</span>!
            </div>
        </div>
        <div className='clearfix'></div>
    </div>

const SideBarMenuItemContainer = props =>{

        function renderWidgets(tags){
            return tags.map((tag)=>
                <InfoWidget key={tag.id} 
                                id={tag.id}
                                title={tag.name} 
                                click={props.tagWidgetClick} />
            )
        }

        function renderEmpty(){
            return <div className='empty-tag'>Empty</div>
        }

        return <nav className={props.showSideBar ? 'show sidebar-container sidebar' : 'sidebar-container sidebar'}>
                <SideBarLogo onLogout={props.onLogout}/>
                <UserOption username={props.username} />
                <AddTagButton onAddClicked={props.onAddClicked}/>
                <SearchInput onChange={props.onSearchChange}/>
                <div className='tag-widget-container'>
                    {props.tags.length ? renderWidgets(props.tags): renderEmpty()}
                </div>
            </nav>
}

SideBarMenuItemContainer.propTypes = {
    showSideBar: PropTypes.bool.isRequired,
    onSearchChange: PropTypes.func.isRequired,
    tags : PropTypes.array.isRequired,
    onAddClicked: PropTypes.func,
    username: PropTypes.string.isRequired,
    onLogout: PropTypes.func.isRequired,
    tagWidgetClick: PropTypes.func.isRequired
}

export default SideBarMenuItemContainer