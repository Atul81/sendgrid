import {
  Middleware,
} from '@reduxjs/toolkit';
import { createStore, applyMiddleware, compose } from 'redux';
import createSagaMiddleware from 'redux-saga';
import { routerMiddleware } from 'connected-react-router';
import { createReducer } from './reducers';
import { History } from 'history';
import { rootSaga } from './sagas';

//  Returns the store instance
// It can  also take initialState argument when provided
const configureStore = (history?: History) => {
  const sagaMiddleware = createSagaMiddleware();
  const middlewares = [sagaMiddleware] as Middleware[];
  if (history) {
    middlewares.push(routerMiddleware(history));
  }
  const composeEnhancers =
      typeof window === 'object' && window['__REDUX_DEVTOOLS_EXTENSION_COMPOSE__']
      ? window['__REDUX_DEVTOOLS_EXTENSION_COMPOSE__']({
        // Specify extension’s options like name, actionsBlacklist, actionsCreators, serialize...
      }) : compose;
  const store = createStore(
      createReducer(),
      composeEnhancers(applyMiddleware(...middlewares))
  );
  sagaMiddleware.run(rootSaga);

  return store;
};

export default configureStore;