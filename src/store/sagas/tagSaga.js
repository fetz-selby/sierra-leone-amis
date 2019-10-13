import * as tagActionTypes from '../actions/tags/tagActionTypes';
import {fetchAllTagsFulfilled, } from '../actions/tags/tagActionCreators';
import {hideAddTag} from '../actions/app/appActionCreators';


import {takeLatest, put, call} from 'redux-saga/effects';
import axios from 'axios';
import {BASE_URL, API_RES_BASE, TAGS_ENDPOINT} from '../../config';
import cookies from 'react-cookies';

function* getTagsAsync(action){
       
    const url = BASE_URL+API_RES_BASE+TAGS_ENDPOINT;
    const token = cookies.load('token');

    const feed = yield axios.get(url, {params:{token}});

    if(feed.data.success){
        const {results} = feed.data;

        yield put(fetchAllTagsFulfilled(results));
    }else{
        // yield put(appActionCreators.networkError('could not retreive user session'))
    }
}

function* createTagsAsync(action){
       
    const url = BASE_URL+API_RES_BASE+TAGS_ENDPOINT;
    const token = cookies.load('token');
    const data = {name: action.payload, token}

    const feed = yield axios.post(url, data);

    if(feed.data.success){
        // const {results} = feed.data;

        yield call(getTagsAsync);
        yield put(hideAddTag());
    }else{
        // yield put(appActionCreators.networkError('could not retreive user session'))
    }
}


export default function* watchApp(){
    yield takeLatest(tagActionTypes.TAG_FETCH_ALL, getTagsAsync);
    yield takeLatest(tagActionTypes.TAG_CREATE, createTagsAsync);
}