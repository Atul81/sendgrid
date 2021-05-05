const contacts = require('./audience/contacts.json');
const customFields = require('./audience/customFields.json');
const segments = require('./audience/segments.json');

module.exports = () => ({
    contacts,
    customFields,
    segments
});