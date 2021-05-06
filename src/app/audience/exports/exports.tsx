import React, {useEffect, useState} from "react";
import {ExportContactInterface} from "../audienceInterface";
import {Space, Table} from "antd";
import {DownloadOutlined} from "@ant-design/icons";
import {getAllAudience} from "../serverCalls/audienceFetch";
import {getTimeFromUnix} from "../../../utils/common";

export const ExportPage: any = () => {

    useEffect(() => {
        getAllAudience('exportsData').then(async response => {
            let tempObj: ExportContactInterface[] = [];
            let res = await response.json();
            res.forEach((itr: any) => {
                tempObj.push({...itr, exportTimestamp: getTimeFromUnix(itr.exportTimestamp), key: itr.id});
            });
            setExportContactDS(tempObj);
        });
    }, []);
    const [exportContactDS, setExportContactDS] = useState<ExportContactInterface[]>([]);

    const downloadFile = (record: any) => {
        console.log('Make the server call', record);
    };

    const columns = [
        {
            title: 'File Name',
            dataIndex: 'fileName',
            key: 'fileName'
        },
        {
            title: 'Export Date & Time',
            dataIndex: 'exportTimestamp',
            key: 'exportTimestamp',
        },
        {
            title: 'Action',
            dataIndex: '',
            key: 'action',
            width: '75px',
            render: ((text: string, record: any) => {
                return <Space size="small">
                    <p className={"actionColumn noMarginIcon"} onClick={() => downloadFile(record)}><DownloadOutlined/>
                    </p>
                </Space>
            }),
        },
    ];
    return <div className="thirdNav" style={{height: 'calc(100vh - 228px)'}}>
        <Table columns={columns} dataSource={exportContactDS} bordered/>
    </div>
}