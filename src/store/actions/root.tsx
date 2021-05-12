import * as types from '../../constants/actionTypes'

export const updateBreadcrumb = (payload: any) => ({
    type: types.UPDATE_BREADCRUMB,
    payload
});

export const updateActiveContent = (payload: any) => ({
    type: types.ACTIVE_CONTENT,
    payload
});

export const updateActiveMenuContent = (payload: any) => ({
    type: types.ACTIVE_MENU_CONTENT,
    payload
});

export const populateAllSegments = () => ({
    type: types.ALL_SEGMENTS,
});

