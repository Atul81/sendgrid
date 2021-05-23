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

export const updateNodeType = (payload: any) => ({
    type: types.NODE_TYPE,
    payload
});

export const updateUserRole = (payload: any) => ({
    type: types.USER_ROLE,
    payload
})

