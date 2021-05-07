const contacts = require('./audience/contacts.json');
const customFields = require('./audience/customFields.json');
const segments = require('./audience/segments.json');
const imports = require('./audience/imports.json');
const exportsData = require('./audience/exports.json');
const automation = require('./campaigns/automation.json');
const workFlow = require('./campaigns/workFlow.json');

module.exports = () => ({
    contacts,
    customFields,
    segments,
    imports,
    exportsData,
    automation,
    workFlow
});