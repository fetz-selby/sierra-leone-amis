import * as actionTypes from './appActionTypes';

export const login = (email, password) => (
    {type: actionTypes.APP_LOG_IN, payload: {email, password}}
) 

export const logout = () => (
    {type: actionTypes.APP_LOGGED_OUT}
) 

export const loginFulfilled = (id,name,token) => (
    {type: actionTypes.APP_LOGGED_IN, payload: {id, name, token}}
) 

export const showAddTag = () => (
    {type: actionTypes.APP_SHOW_ADD_TAG}
) 

export const hideAddTag = () => (
    {type: actionTypes.APP_HIDE_ADD_TAG}
) 