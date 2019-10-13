import * as actionTypes from '../actions/tags/tagActionTypes';
import _ from 'lodash';

const initial = {
   tags:[],
   tagsCopy:[]
}

const reducer = (state = initial, action) => {
    switch(action.type){
        case actionTypes.TAG_FETCH_ALL_FULFILLED:{
            const tags = action.payload;

            //Add default tag for all
            const defaultTag = _.concat([{id: 0, name: 'all'}], tags);
            const tagsCopy = [...defaultTag];

            return{
                ...state,
                tags: defaultTag,
                tagsCopy
            }
        }

        case actionTypes.TAG_SEARCH:{
            const val = action.payload.trim().toLowerCase();

            //Search by all category and search in a uniform case [lowercase]
            const tags = _.filter(state.tagsCopy, (tag)=>_.includes(tag.name.toLowerCase(), val)); 

            return{
                ...state,
                tags
            }
        }

        case actionTypes.TAG_CREATE_FULFILLED:{

            return{
                ...state,
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