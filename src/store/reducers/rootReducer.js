import {combineReducers} from 'redux';
import jokeReducer from './jokeReducer';
import appReducer from './appReducer';
import tagReducer from './tagReducer';

export default combineReducers({
    tags : tagReducer,
    app : appReducer,
    jokes: jokeReducer
})