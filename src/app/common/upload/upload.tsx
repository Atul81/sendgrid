import React, {useEffect, useState} from "react";
import {message, Select, Upload} from "antd";
import 'antd/dist/antd.css';
import {InboxOutlined} from '@ant-design/icons';
import Paragraph from "antd/es/typography/Paragraph";
import {Link} from "react-router-dom";
import {AddSegment} from "../../audience/audienceInterface";
import Title from "antd/lib/typography/Title";
import {filterSelectOptions, GET_SERVER_ERROR} from "../../../utils/common";
import {getAllServerCall} from "../../../service/serverCalls/mockServerRest";

export const UploadPage: any = (props: any) => {

    useEffect(() => {
        getAllServerCall('segments').then(async response => {
            let resBody = await response.json();
            let data: AddSegment[] = [];
            if (resBody && Array.isArray(resBody)) {
                resBody.forEach((itr: any) => {
                    data.push({segment: itr.name, key: itr.id});
                });
            }
            setAllSegments(data);
        }).catch(reason => {
            console.log(reason);
            message.error(GET_SERVER_ERROR, 0.8).then(() => {
            });
        });
    }, []);

    const {Dragger} = Upload;
    const {Option} = Select;
    const [allSegments, setAllSegments] = useState<AddSegment[]>([]);
    const [segmentSelected, setSegmentSelected] = useState<AddSegment>({
        key: '',
        segment: ''
    });

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

    const newSegmentSelectChange = (option: any) => {
        setSegmentSelected({key: option.key, segment: option.children});
    };
    return (
        <>
            <p className="ant-upload-hint">
                <Title level={5}>Select Segment</Title>
                <Select style={{width: 360}} showSearch
                        value={segmentSelected.segment.length === 0 ? undefined : segmentSelected.segment}
                        placeholder="Select Segments"
                        optionFilterProp="children"
                        filterOption={(input, option) => filterSelectOptions(input, option)}
                        onChange={(value, option) => newSegmentSelectChange(option)}>
                    {allSegments.map(value => {
                        return <Option key={value.key} value={value.key}>{value.segment}</Option>
                    })}
                </Select>
            </p>
            <Paragraph>Download our <Link to='/files/Contact_Upload_Template.csv' target={'_blank'}
                                          style={{color: "red", cursor: 'pointer'}} download>CSV template</Link> to
                ensure appropriate formatting</Paragraph>
            <Dragger {...uploadProps}>
                <p className="ant-upload-drag-icon">
                    <InboxOutlined/>
                </p>
                <p className="ant-upload-text">Drop your .CSV file here or <strong style={{color: "red"}}>click here to
                    upload</strong> the file</p>
            </Dragger>
        </>
    )
}
