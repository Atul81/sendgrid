import { all, fork } from 'redux-saga/effects';
import { watchRootSaga } from './rootSaga';
import { watchBreadcrum } from './updateBreadcrum';

export const rootSaga = function* root() {
  yield all([
    fork(watchRootSaga),
    fork(watchBreadcrum),
  ]);
};