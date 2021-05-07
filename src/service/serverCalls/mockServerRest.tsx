import urlConfig from '../../config/urlConfig.json';

export const getAllServerCall = (urlType: string) => {
    const getAllObjectsRequest = {
        method: 'GET',
        headers: {'Content-Type': 'application/json'},
    };
    return fetch(urlConfig[urlType], getAllObjectsRequest);
}

export const getObjectById = (objectId: any, urlType: string) => {
    const objectByIdRequest = {
        method: 'GET',
        headers: {'Content-Type': 'application/json'},
    };
    return fetch(urlConfig[urlType].concat(`/${objectId}`), objectByIdRequest);
};

export const editObjectById = (editObject: any, urlType: string) => {
    const objectEditByIdRequest = {
        method: 'PUT',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            ...editObject,
            emailMarketing: editObject.oldObj ? editObject.oldObj.emailMarketing : undefined,
            tags: editObject.oldObj ? editObject.oldObj.tags : undefined
        })
    };
    return fetch(urlConfig[urlType].concat(`/${editObject.oldObj ? editObject.oldObj.id : editObject.id}`), objectEditByIdRequest);
};

export const addNewObject = (editObject: any, urlType: string) => {
    const newObjectRequest = {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({...editObject})
    };
    return fetch(urlConfig[urlType], newObjectRequest);
};

export const deleteObjectById = (objectId: any, urlType: string) => {
    const objectDelByIdRequest = {
        method: 'DELETE',
        headers: {'Content-Type': 'application/json'},
    };
    return fetch(urlConfig[urlType].concat(`/${objectId}`), objectDelByIdRequest);
};