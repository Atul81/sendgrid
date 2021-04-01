import {all, put, takeLatest} from 'redux-saga/effects';
import * as types from '../../constants/actionTypes';

// @ts-ignore
export function* updateBreadCrumSaga({type: string, payload}) {
    yield put({type: types.UPDATE_BREADCRUMB_SUCCESS, updateBreadcrum: payload});
}

export function* watchBreadcrum() {
    yield all([
        takeLatest(
            types.UPDATE_BREADCRUMB,
            updateBreadCrumSaga
        )
    ])
}
