const contacts = [];

for (let i = 0; i < 110; i++) {
    if(i % 2 === 0) {
        contacts.push({
            "id": i,
            "email": `test-example${i}@gmail.com`,
            "firstName": `John${i}`,
            "lastName": "Doe",
            "emailMarketing": "Un-subscribed",
            "tags": "Prospect",
            "segments": "2021 Leads",
            "address": null,
            "city": null,
            "country": null,
            "postalCode": null
        });
    } else {
        contacts.push({
            "id": i,
            "email": `test-example${i}@gmail.com`,
            "firstName": `John${i}`,
            "lastName": "Doe",
            "emailMarketing": "Subscribed",
            "tags": "Campaign",
            "segments": "Chicago Companies",
            "address": null,
            "city": null,
            "country": null,
            "postalCode": null
        });
    }
}
const customFields = require('./audience/customFields.json');
const segments = require('./audience/segments.json');
const imports = require('./audience/imports.json');
const importsRow = require('./audience/importsRow.json');
const exportsData = require('./audience/exports.json');
const automation = require('./campaigns/automation.json');
const workFlow = require('./campaigns/workFlow.json');
const campaigns = require('./campaigns/campaigns.json');
const campaignsForm = require('./campaigns/campaignsForm.json');
const senders = require('./campaigns/senders.json');
const templates = require('./templates/templates.json');
const templatesP = require('./templates/templatesP.json');
const deliveryTesting = require('./templates/deliveryTesting.json');
const groups = require('./unsubscriptions/groups.json');
const customizeForm = require('./unsubscriptions/customizeForm.json');
const domain = require('./settings/domain.json');
const dedicatedIps = require('./settings/dedicatedIps.json');
const customEvents = require('./settings/customEvents.json');
const preferences = require('./settings/preferences.json');
const users = require('./settings/users.json');
const utils = require('./extras/utils.json');

module.exports = () => ({
    contacts,
    customFields,
    segments,
    imports,
    importsRow,
    exportsData,
    automation,
    workFlow,
    campaigns,
    campaignsForm,
    senders,
    templates,
    templatesP,
    deliveryTesting,
    groups,
    customizeForm,
    domain,
    dedicatedIps,
    customEvents,
    preferences,
    users,
    utils
});
