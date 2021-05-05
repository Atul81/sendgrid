import urlConfig from '.././../../config/urlConfig.json';

export const getAllContacts = () => {
    const allContactsRequest = {
        method: 'GET',
        headers: {'Content-Type': 'application/json'},
    };
    return fetch(urlConfig.contacts, allContactsRequest);
}

export const getContactById = (contactId: any) => {
    const contactByIdRequest = {
        method: 'GET',
        headers: {'Content-Type': 'application/json'},
    };
    return fetch(urlConfig.contacts.concat(`/${contactId}`), contactByIdRequest);
};

export const editContactById = (editObject: any) => {
    const contactByIdRequest = {
        method: 'PUT',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            ...editObject.formObj,
            emailMarketing: editObject.oldObj.emailMarketing,
            tags: editObject.oldObj.tags
        })
    };
    return fetch(urlConfig.contacts.concat(`/${editObject.oldObj.id}`), contactByIdRequest);
};

export const addNewContact = (editObject: any) => {
    const newContactRequest = {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({...editObject})
    };
    return fetch(urlConfig.contacts, newContactRequest);
};

export const deleteContactById = (contactId: any) => {
    const contactByIdRequest = {
        method: 'DELETE',
        headers: {'Content-Type': 'application/json'},
    };
    return fetch(urlConfig.contacts.concat(`/${contactId}`), contactByIdRequest);
};