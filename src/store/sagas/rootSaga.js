import {all} from 'redux-saga/effects';
import jokesSaga from './jokeSaga';
import tagsSaga from './tagSaga';
import appSaga from './appSaga';

export default function* () {
    yield all([
        jokesSaga(),
        tagsSaga(),
        appSaga()
      ])
}