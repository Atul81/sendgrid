export const exportCSVFile = (str: string, fileName: string) => {
    let csvData = new Blob([str], { type: 'text/csv;charset=utf-8;' });
    let csvURL = window.URL.createObjectURL(csvData);
    let tempLink = document.createElement('a');
    tempLink.href = csvURL;
    tempLink.setAttribute('download', fileName);
    tempLink.click();
    return;
};