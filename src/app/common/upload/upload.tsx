import React from "react";
import {message, Upload} from "antd";
import 'antd/dist/antd.css';
import {InboxOutlined} from '@ant-design/icons';
import Paragraph from "antd/es/typography/Paragraph";
import {Link} from "react-router-dom";

export const UploadPage: any = (props: any) => {
    const {Dragger} = Upload;
    const uploadProps = {
        name: 'file',
        multiple: false,
        action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
        onChange(info: { file: { name?: any; status?: any; }; fileList: any; }) {
            const {status} = info.file;
            if (status !== 'uploading') {
                props.fileInfo(info);
                console.log(info.file, info.fileList);
            }
            if (status === 'done') {
                message.success(`${info.file.name} file uploaded successfully.`).then(() => {
                });
            } else if (status === 'error') {
                message.error(`${info.file.name} file upload failed.`).then(() => {
                });
            }
        },
    };
    return (
        <>
            <Paragraph>Download our <Link to='/files/Contact_Upload_Template.csv' target={'_blank'} style={{color:"red", cursor:'pointer'}} download>CSV template</Link> to ensure appropriate formatting</Paragraph>
            <Dragger {...uploadProps}>
                <p className="ant-upload-drag-icon">
                    <InboxOutlined/>
                </p>
                <p className="ant-upload-text">Drop your .CSV file here or <strong style={{color:"red"}}>click here to upload</strong> the file</p>
                <p className="ant-upload-hint">
                    Support for a single upload. Strictly prohibit from uploading company data or other
                    band files
                </p>
            </Dragger>
        </>
    )
}