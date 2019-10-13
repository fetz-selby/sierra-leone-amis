import React, { Component } from 'react';
import {connect} from 'react-redux';
import avatar from '../../assets/icons/user.png';
import * as appAction from '../../store/actions/app/appActionCreators';
import './login.css';

class Login extends Component{
    state = {email:'', password:''};

    onLoginClickedHandler = () => {
        //TODO Validate email
        this.props.login(this.state.email, this.state.password);
    }

    onEmailChangeHandler=(event)=>{
        this.setState({
            email: event.target.value
        })
    }

    onPasswordChangeHandler=(event)=>{
        this.setState({
            password: event.target.value
        })
    }

    render(){
        return <div className='login-container'>

        <div className='login'>
            <div className='login-widget-container'>
                <div className='avatar-container'>
                    <img className='avatar' src={avatar} alt='Admin'/>
                    {/* <img className='avatar' src={icon} alt={props.name}/> */}
                </div>
                <div className='info-container'>
                    <div className='info'>Admin</div>
                    <input type='text' value={this.state.email} className='inputs' onChange={this.onEmailChangeHandler} />
                    <div className='clearfix'></div>
                    <input type='password' value={this.state.password} className='inputs' onChange={this.onPasswordChangeHandler} />
                </div>
            </div>

            <div className='clearfix'></div>

            <div className='login-widget-container'>
                <div className='action-container'>
                    <div className='login-btn' onClick={this.onLoginClickedHandler}>Login</div>
                </div>
            </div>
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
      login: (email, password)=> dispatch(appAction.login(email, password))
    }
  }

export default connect(mapStateToProps, mapDispatchToProps)(Login);