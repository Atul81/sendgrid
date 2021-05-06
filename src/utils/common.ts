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
            address: (propsObj && propsObj.address) ? propsObj.address : undefined,
            city: (propsObj && propsObj.city) ? propsObj.city : undefined,
            postalCode: (propsObj && propsObj.postalCode) ? propsObj.postalCode : undefined,
            country: (propsObj && propsObj.country) ? propsObj.country : undefined,
            location: (propsObj && propsObj.location) ? propsObj.location : undefined
        }
    });
};

export const filterSelectOptions = (input: string, option: any) => {
    return option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
};

export const getTimeFromUnix = (unixTime: number) => {
    let date = new Date(unixTime * 1000);
    let hours = date.getHours();
    let minutes = "0" + date.getMinutes();
    let seconds = "0" + date.getSeconds();
    return hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);
}