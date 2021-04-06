import {getDate, getMonth, getYear} from "date-fns";

export const exportCSVFile = (str: string, fileParam: string) => {
    let day = getDate(new Date()) + '_' + (getMonth(new Date()) + 1) + '_' + getYear(new Date());
    const fileName = `${day}_${fileParam}.csv`;
    let csvData = new Blob([str], {type: 'text/csv;charset=utf-8;'});
    let csvURL = window.URL.createObjectURL(csvData);
    let tempLink = document.createElement('a');
    tempLink.href = csvURL;
    tempLink.setAttribute('download', fileName);
    tempLink.click();
    return;
};

export const populateFormObj = (propsObj: any, formObj: any) => {
    formObj.setFieldsValue({
        formObj: {
            email: (propsObj && propsObj.email) ? propsObj.email : undefined,
            firstName: (propsObj && propsObj.firstName) ? propsObj.firstName : undefined,
            lastName: (propsObj && propsObj.lastName) ? propsObj.lastName : undefined,
            address: undefined,
            city: undefined,
            postalCode: undefined,
            country: undefined,
            location: undefined,
        }
    });
}