import * as jokeActionTypes from '../actions/jokes/jokeActionTypes';
import {fetchJokesWithTagFulfilled,fetchJokeFulfilled,createJokeFulfilled,updateJokeFulfilled, deleteJokeFulfilled} from '../actions/jokes/jokeActionCreators';

import {takeLatest, put, call} from 'redux-saga/effects';
import axios from 'axios';
import {BASE_URL, API_RES_BASE, JOKES_ENDPOINT} from '../../config';
import cookies from 'react-cookies';

function* getJokeAsync(action){
       
    const token = cookies.load('token');
    const jokeId = action.payload;
    const url = BASE_URL+API_RES_BASE+JOKES_ENDPOINT+`/${jokeId}`;


    const feed = yield axios.get(url, {params:{token}});

    if(feed.data.success){
        const {results} = feed.data;

        yield put(fetchJokeFulfilled(results));
    }else{
        // yield put(appActionCreators.networkError('could not retreive user session'))
    }
}

function* getAllJokeAsync(){
       
    const url = BASE_URL+API_RES_BASE+JOKES_ENDPOINT;
    const token = cookies.load('token');

    const feed = yield axios.get(url, {params:{token}});

    if(feed.data.success){
        const {results} = feed.data;

        yield put(fetchJokesWithTagFulfilled(results));
    }else{
        // yield put(appActionCreators.networkError('could not retreive user session'))
    }
}

function* getJokeWithTagsAsync(action){
       
    const url = BASE_URL+API_RES_BASE+JOKES_ENDPOINT;
    const token = cookies.load('token');
    const tagId = action.payload;

    if(tagId === 0){
        yield call(getAllJokeAsync);
        return;
    }

    const feed = yield axios.get(url, {params:{token,tags:tagId}});

    if(feed.data.success){
        const {results} = feed.data;

        yield put(fetchJokesWithTagFulfilled(results));
    }else{
        // yield put(appActionCreators.networkError('could not retreive user session'))
    }
}

function* createJokeAsync(action){
       
    const url = BASE_URL+API_RES_BASE+JOKES_ENDPOINT;
    const token = cookies.load('token');
    const data = {sentence: action.payload.sentence, tags:action.payload.tags, token}

    const feed = yield axios.post(url, data);

    if(feed.data.success){
        const {results} = feed.data;

        yield put(createJokeFulfilled(results));
    }else{
        // yield put(appActionCreators.networkError('could not retreive user session'))
    }
}

function* updateJokeAsync(action){
       
    const token = cookies.load('token');
    let {id,joke} = action.payload;
    joke.token = token;

    const url = BASE_URL+API_RES_BASE+JOKES_ENDPOINT+`/${id}`;

    const feed = yield axios.put(url, joke);

    if(feed.data.success){

        yield put(updateJokeFulfilled());
    }else{
        // yield put(appActionCreators.networkError('could not retreive user session'))
    }
}

function* deleteJokeAsync(action){
       
    const token = cookies.load('token');
    const id = action.payload;
    const url = BASE_URL+API_RES_BASE+JOKES_ENDPOINT+`/${id}`;

    const feed = yield axios.delete(url, {params:{token}});

    if(feed.data.success){
        const {results} = feed.data;

        yield put(deleteJokeFulfilled(results));
    }else{
        // yield put(appActionCreators.networkError('could not retreive user session'))
    }
}


export default function* watchApp(){
    yield takeLatest(jokeActionTypes.JOKE_FETCH_WITH_TAG, getJokeWithTagsAsync);
    yield takeLatest(jokeActionTypes.JOKE_FETCH, getJokeAsync);
    yield takeLatest(jokeActionTypes.JOKE_CREATE, createJokeAsync);
    yield takeLatest(jokeActionTypes.JOKE_UPDATE, updateJokeAsync);
    yield takeLatest(jokeActionTypes.JOKE_DELETE, deleteJokeAsync);
}