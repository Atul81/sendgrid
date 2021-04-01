import {all, put, takeLatest} from 'redux-saga/effects';
import * as types from '../../constants/actionTypes';

// Responsible for searching media library, making calls to the API
// and instructing the redux-saga middle ware on the next line of action,
// for success or failure operation.


// @ts-ignore
export function* updateActiveContent({type: string, payload}) {
    yield put({type: types.ACTIVE_CONTENT_SUCCESS, activeContent: payload});
}

// @ts-ignore
export function* updateActiveMenuContent({type: string, payload}) {
    yield put({type: types.ACTIVE_MENU_CONTENT_SUCCESS, activeMenuContent: payload});
}

export function* watchRootSaga() {
    yield all([
        takeLatest((types.ACTIVE_CONTENT), updateActiveContent),
        takeLatest((types.ACTIVE_MENU_CONTENT), updateActiveMenuContent)
    ])

}
