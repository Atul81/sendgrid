import React, {useEffect, useState} from "react";
import {Button, message, Table, Typography} from "antd";
import {ImportsDetailsInterface} from "../../audienceInterface";
import {DownOutlined, StepBackwardOutlined} from "@ant-design/icons";
import {exportCSVFile, GET_SERVER_ERROR} from "../../../../utils/common";
import {getAllServerCall} from "../../../../service/serverCalls/mockServerRest";
import {useDispatch} from "react-redux";
import {updateBreadcrumb} from "../../../../store/actions/root";

export const RowDetailsPage: any = (props: any) => {
    const {Title} = Typography;
    const dispatch = useDispatch();
    useEffect(() => {
        getAllServerCall('importsRow').then(async getFailedRowsAsync => {
            let failedRowsRes = await getFailedRowsAsync.json();
            if (failedRowsRes) {
                let tempObj: ImportsDetailsInterface[] = [];
                failedRowsRes.forEach((itr: any) => {
                    tempObj.push({...itr})
                });
                setUploadDetailsDS(tempObj);
                dispatch(updateBreadcrumb(['Audience', 'Imports', props.rowObj.fileName]))
            }
        }).catch(reason => {
            console.log(reason);
            message.error(GET_SERVER_ERROR, 0.8).then(() => {
            });
        });
    }, [])
    const [uploadDetailsDS, setUploadDetailsDS] = useState<ImportsDetailsInterface[]>([]);
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
            key: 'postalCode'
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
                <Table columns={columns} dataSource={uploadDetailsDS} expandable={{
                    expandedRowRender: record => <p style={{margin: 0}}>{record.failureReason}</p>
                }} bordered/>
            </div>
        </div>
    )
}
