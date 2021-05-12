import {all, put, takeLatest} from 'redux-saga/effects';
import * as types from '../../constants/actionTypes';
import {getAllServerCall} from "../../service/serverCalls/mockServerRest";

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

// @ts-ignore
export function* updateAllSegments({type: string}) {
    let payload: any[] = [];
    getAllServerCall('segments').then(async allSegmentsAsync => {
        let allSegmentsRes = await allSegmentsAsync.json();
        if (allSegmentsRes) {
            payload = [...allSegmentsRes];
        }
    });
    yield put({type: types.ALL_SEGMENTS_SUCCESS, activeMenuContent: payload});
}

export function* watchRootSaga() {
    yield all([
        takeLatest((types.ACTIVE_CONTENT), updateActiveContent),
        takeLatest((types.ACTIVE_MENU_CONTENT), updateActiveMenuContent),
        takeLatest((types.ALL_SEGMENTS), updateAllSegments)
    ]);
}
