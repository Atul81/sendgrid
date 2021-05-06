import urlConfig from '.././../../config/urlConfig.json';

export const getAllAudience = (urlType: string) => {
    const allAudienceRequest = {
        method: 'GET',
        headers: {'Content-Type': 'application/json'},
    };
    return fetch(urlConfig[urlType], allAudienceRequest);
}

export const getAudienceById = (audienceId: any, urlType: string) => {
    const audienceByIdRequest = {
        method: 'GET',
        headers: {'Content-Type': 'application/json'},
    };
    return fetch(urlConfig[urlType].concat(`/${audienceId}`), audienceByIdRequest);
};

export const editAudienceById = (editObject: any, urlType: string) => {
    const audienceByIdRequest = {
        method: 'PUT',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            ...editObject,
            emailMarketing: editObject.oldObj ? editObject.oldObj.emailMarketing : undefined,
            tags: editObject.oldObj ? editObject.oldObj.tags : undefined
        })
    };
    return fetch(urlConfig[urlType].concat(`/${editObject.oldObj ? editObject.oldObj.id : editObject.id}`), audienceByIdRequest);
};

export const addNewAudience = (editObject: any, urlType: string) => {
    const newAudienceRequest = {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({...editObject})
    };
    return fetch(urlConfig[urlType], newAudienceRequest);
};

export const deleteAudienceById = (audienceId: any, urlType: string) => {
    const audienceByIdRequest = {
        method: 'DELETE',
        headers: {'Content-Type': 'application/json'},
    };
    return fetch(urlConfig[urlType].concat(`/${audienceId}`), audienceByIdRequest);
};