import React, {useState} from "react";
import {Button, Table, Typography} from "antd";
import {ImportsDetailsInterface} from "../../audienceInterface";
import Title from "antd/lib/typography/Title";
import {DownOutlined, StepBackwardOutlined} from "@ant-design/icons";
import {exportCSVFile} from "../../../../utils/common";

export const RowDetailsPage: any = (props: any) => {
    const {Title} = Typography;
    const [uploadDetailsDS, setUploadDetailsDS] = useState<ImportsDetailsInterface[]>([
        {
            key: '1',
            email: '-',
            firstName: 'John',
            lastName: 'Dow',
            city: 'Subscribed',
            postalCode: '-'
        },
        {
            key: '2',
            email: 'john.doe@solulever.com',
            firstName: '-',
            lastName: 'Doe',
            city: '-',
            postalCode: 'Zoho Campaign'
        }
    ]);
    const columns = [
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
        },
        {
            title: 'First Name',
            dataIndex: 'firstName',
            key: 'firstName',
        },
        {
            title: 'Last Name',
            dataIndex: 'lastName',
            key: 'lastName',
        },
        {
            title: 'City',
            dataIndex: 'city',
            key: 'city',
        },
        {
            title: 'Postal Code',
            dataIndex: 'postalCode',
            key: 'postalCode',
        },
    ];

    const downloadFile = () => {
        let str = columns.map(itr => itr.title).join(",");
        uploadDetailsDS.forEach(item => {
            let currentRow = item.email + "," + item.firstName + "," + item.lastName + "," + item.city + "," + item.postalCode;
            str = str + "\n" + currentRow;
        });
        exportCSVFile(str, props.rowObj.fileName.substr(0, props.rowObj.fileName.length - 4));
    };

    return (
        <div className="pageLayout">
            <div className="firstNav">
                <div className="leftPlacement">
                    <Title
                        level={4}>{props.rowObj.fileName}</Title>
                </div>
                <div className="rightPlacement">
                    <Button className="deleteBtn" icon={<StepBackwardOutlined/>}
                            onClick={props.routeToOverview}>Cancel</Button>
                    <Button className="addBtn" icon={<DownOutlined/>} type={'primary'}
                            onClick={downloadFile}>Download File</Button>
                </div>
            </div>
            <div className="thirdNav" style={{height: 'calc(100vh - 228px)'}}>
                <Table columns={columns} dataSource={uploadDetailsDS} bordered/>
            </div>
        </div>
    )
}
