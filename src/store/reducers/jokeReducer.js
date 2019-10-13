import * as actionTypes from '../actions/jokes/jokeActionTypes';
import _ from 'lodash';
import {JOKE_TRUNCATE_LIMIT} from '../../config';

const initial = {
   jokes:[],
   joke:{id:0,sentence:'',tags:[]},
   filteredJokes:[]
}

const reducer = (state = initial, action) => {
    switch(action.type){
        case actionTypes.JOKE_FETCH_WITH_TAG_FULFILLED:{
            //Truncate jokes
            const jokes = action.payload.map((joke)=>({id:joke.id, sentence: _.truncate(joke.sentence, {length: JOKE_TRUNCATE_LIMIT, separator:' '})}));
            return{
                ...state,
                jokes
            }
        }

        case actionTypes.JOKE_FETCH_FULFILLED:{
            const joke = action.payload;

            return{
                ...state,
                joke
            }
        }

        case actionTypes.JOKE_INIT_NEW :{
            const joke = {id:0, sentence:'', tags:[]};

            return{
                ...state,
                joke
            }
        }

        case actionTypes.JOKE_CREATE_FULFILLED :{
            const joke = {id:0, sentence:'', tags:[]};

            return{
                ...state,
                joke
            }
        }

        case actionTypes.JOKE_UPDATE_FULFILLED:{
            const joke = {id:0, sentence:'', tags:[]};

            return{
                ...state,
                joke
            }
        }

        case actionTypes.JOKE_DELETE_FULFILLED:{
            const joke = {id:0, sentence:'', tags:[]};

            return{
                ...state,
                joke
            }
        }

        case actionTypes.JOKE_SEARCH:{
            const val = action.payload.trim().toLowerCase();

            //Search by all category and search in a uniform case [lowercase]
            const jokes = _.filter(state.jokes, (joke)=>_.includes(joke.sentence.toLowerCase(), val)); 

            return{
                ...state,
                jokes
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