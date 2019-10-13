import * as actionTypes from '../actions/app/appActionTypes';
import cookies from 'react-cookies';

const initial = {
    logout: false,
    name:'',
    userId:0,
    token:'',
    showAddTag:false
}

const reducer = (state = initial, action) => {
    switch(action.type){
        case actionTypes.APP_LOGGED_IN:{
            const logout = false;
            const {id: userId,name,token} = action.payload;
            const showAddTag = false;

            cookies.save('token', token);
            cookies.save('userId', userId);
            cookies.save('name', name);

            return{
                ...state,
                logout,
                userId,
                name,
                token,
                showAddTag
            }
        }

        case actionTypes.APP_LOGGED_OUT:{
            const logout = true;
            const token = '';
            const userId = 0;

            cookies.remove('token');
            cookies.remove('userId');
            cookies.remove('name');

            return{
                ...state,
                logout,
                token,
                userId
            }
        }

        case actionTypes.APP_SHOW_ADD_TAG:{
            const showAddTag = true;

            return{
                ...state,
                showAddTag
            }
        }

        case actionTypes.APP_HIDE_ADD_TAG:{
            const showAddTag = false;
           
            return{
                ...state,
                showAddTag
            }
        }
        
        default:{
            return{
                ...state
            }
        }
    }
}

export default reducer;