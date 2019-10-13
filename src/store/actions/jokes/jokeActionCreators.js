import * as actionTypes from './jokeActionTypes';

export const fetchJokesWithTag = (tagId) => (
    {type: actionTypes.JOKE_FETCH_WITH_TAG, payload: tagId}
) 

export const fetchJokesWithTagFulfilled = (jokes) => (
    {type: actionTypes.JOKE_FETCH_WITH_TAG_FULFILLED, payload: jokes}
) 

export const fetchJoke = (jokeId) => (
    {type: actionTypes.JOKE_FETCH, payload: jokeId}
) 

export const fetchJokeFulfilled = (joke) => (
    {type: actionTypes.JOKE_FETCH_FULFILLED, payload: joke}
) 

export const createJoke = (joke) => (
    {type: actionTypes.JOKE_CREATE, payload: joke}
) 

export const createJokeFulfilled = (joke) => (
    {type: actionTypes.JOKE_CREATE_FULFILLED, payload: joke}
) 

export const updateJoke = (id, joke) => (
    {type: actionTypes.JOKE_UPDATE, payload: {id,joke}}
) 

export const updateJokeFulfilled = () => (
    {type: actionTypes.JOKE_UPDATE_FULFILLED}
) 

export const deleteJoke = (id) => (
    {type: actionTypes.JOKE_DELETE, payload: id}
) 

export const deleteJokeFulfilled = () => (
    {type: actionTypes.JOKE_DELETE_FULFILLED}
) 

export const initNewJoke = () => (
    {type: actionTypes.JOKE_INIT_NEW}
) 

export const searchJoke = (work) => (
    {type: actionTypes.JOKE_SEARCH, payload:work}
) 

