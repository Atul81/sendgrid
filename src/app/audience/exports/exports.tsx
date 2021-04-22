import React, {useState} from "react";
import {ExportContactInterface} from "../contactInterface";
import {Space, Table} from "antd";
import {DeleteOutlined, DownloadOutlined} from "@ant-design/icons";

export const ExportPage: any = () => {

    const [exportContactDS, setExportContactDS] = useState<ExportContactInterface[]>([
        {
            key: '1',
            fileName: 'Chicago_contacts.csv',
            exportTimestamp: new Date().toLocaleTimeString('kok-IN', {
                hour12: false,
                day: '2-digit',
                month: '2-digit',
                year: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
            })
        },
        {
            key: '2',
            fileName: 'omni_campaign_subscribers_list.csv',
            exportTimestamp: new Date().toLocaleTimeString('kok-IN', {
                hour12: false,
                day: '2-digit',
                month: '2-digit',
                year: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
            })
        }
    ]);

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