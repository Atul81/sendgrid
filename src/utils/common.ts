import {getDate, getMonth, getYear} from "date-fns";
import {message} from "antd";

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
            location: (propsObj && propsObj.location) ? propsObj.location : undefined,
            domainVerified: (propsObj && propsObj.domainVerified) ? propsObj.domainVerified : undefined,
            tags: (propsObj && propsObj.tags) ? propsObj.tags.split(', ') : undefined,
            segments: (propsObj && propsObj.segments) ? propsObj.segments.split(', ') : undefined
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
};

export const textOnlyValidation = () => {
    return {
        validator(_: any, value: string) {
            if (value && validateTextRegex(value)) {
                return Promise.reject(new Error('Only text value allowed!'));
            } else {
                return Promise.resolve();
            }
        }
    };
}

export const validateTextRegex = (inp: string) => {
    const textRegex = /[^A-Za-z]/
    return textRegex.test(inp);
}

export const validateDomainRegex = (inp: string) => {
    const textRegex = /[^A-Za-z.]/
    return textRegex.test(inp);
}

export const validateEmail = (email: string) => {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email.toLowerCase());
}

export const generateCopiedMessage = (text: any) => {
    const columnVal = document.createElement('textarea');
    columnVal.value = text;
    document.body.appendChild(columnVal);
    columnVal.select();
    document.execCommand('copy');
    message.success(text.concat(' has been copied on your clipboard'), 0.7).then(() => {
    });
    document.body.removeChild(columnVal);
}

export const GET_SERVER_ERROR = 'Unable to fetch data, we are working on it, please try after sometime';
export const POST_SERVER_ERROR = 'Unable to save request, we are working on it, please try after sometime';
export const PUT_SERVER_ERROR = 'Unable to update request, we are working on it, please try after sometime';
export const DELETE_SERVER_ERROR = 'Unable to delete request, we are working on it, please try after sometime';
