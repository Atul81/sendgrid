import initialState from './initialState';
import * as types from '../../constants/actionTypes';

// Handles image related actions
// eslint-disable-next-line import/no-anonymous-default-export
export default function (state = initialState.root, action: any) {
    switch (action.type) {
        case types.UPDATE_BREADCRUMB:
            return {...state, ...{selectedBreadCrum: action.payload}};
        case types.ACTIVE_MENU_CONTENT:
            return {...state, ...{activeMenuContent: action.payload}};
        case types.ACTIVE_CONTENT:
            return {...state, ...{activeContent: action.payload}}
        case types.ALL_SEGMENTS:
            return {...state, ...{allSegments: action.payload}}
        case types.NODE_TYPE:
            return {...state, ...{nodeType: action.payload}}
        case types.USER_ROLE:
            return {...state, ...{userRole: action.payload}}
        default:
            return state;
    }
}
