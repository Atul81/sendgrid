import React, {useEffect, useState} from "react";
import {ExportContactInterface} from "../audienceInterface";
import {Space, Table} from "antd";
import {DownloadOutlined} from "@ant-design/icons";
import {getAllServerCall} from "../../../service/serverCalls/mockServerRest";
import {getTimeFromUnix} from "../../../utils/common";
import Title from "antd/lib/typography/Title";
import Search from "antd/es/input/Search";

export const ExportPage: any = () => {

    useEffect(() => {
        getAllServerCall('exportsData').then(async response => {
            let tempObj: ExportContactInterface[] = [];
            let res = await response.json();
            res.forEach((itr: any) => {
                tempObj.push({...itr, exportTimestamp: getTimeFromUnix(itr.exportTimestamp), key: itr.id});
            });
            setExportContactDS(tempObj);
            setExportContactDSOps(tempObj);
        });
    }, []);
    const [exportContactDS, setExportContactDS] = useState<ExportContactInterface[]>([]);
    const [exportContactDSOps, setExportContactDSOps] = useState<ExportContactInterface[]>([]);

    const downloadFile = (record: any) => {
        console.log('Make the server call', record);
    };

    const columns = [
        {
            title: 'File Name',
            dataIndex: 'fileName',
            key: 'fileName',
            sorter: (a: any, b: any) => a.fileName.length - b.fileName.length
        },
        {
            title: 'Export Date & Time',
            dataIndex: 'exportTimestamp',
            key: 'exportTimestamp',
            sorter: (a: any, b: any) => a.exportTimestamp - b.exportTimestamp
        },
        {
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

    const onSearchExports = (searchParam: string) => {
        setExportContactDS(exportContactDSOps.filter(value => {
            return value.fileName.includes(searchParam);
        }));
    };

    return (
        <div className='pageLayout'>
            <div className="secondNav">
                <Title level={4}>All Exports</Title>
            </div>
            <div className="firstNav">
                <div className="leftPlacement">
                    <div className="searchInput">
                        <Search placeholder="input search text" onSearch={onSearchExports} enterButton/>
                    </div>
                </div>
            </div>
            <div className="thirdNav">
                <Table columns={columns} dataSource={exportContactDS} bordered/>
            </div>
        </div>
    )
}
