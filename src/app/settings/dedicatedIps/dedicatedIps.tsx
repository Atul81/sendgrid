import React, {useEffect, useState} from "react";
import {Button, message, Space, Table, Tag} from "antd";
import {DedicatedIpsInterface} from "../settingsInterface";
import {DeleteOutlined, PlusOutlined} from "@ant-design/icons";

export const DedicatedIpsPage: any = () => {
    const deleteDedicatedIps = (record: any) => {
    }
    const columns = [
        {
            title: 'IP Address',
            dataIndex: 'ipAddress',
            key: 'ipAddress',
            width: '70%'
        },
        {
            title: 'Purchase Date',
            dataIndex: 'purchaseDate',
            key: 'purchaseDate'
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: ((text: string, record: any) => {
                return (
                    <Tag key={record.key} color={text === 'Active' ? 'green' : 'red'}>{text}</Tag>
                );
            }),
            width: '10%'
        },
        {
            title: 'Action',
            dataIndex: '',
            key: 'action',
            width: '75px',
            render: ((text: string, record: any) => {
                return <Space size="small">
                    <p className={"actionColumn noMarginIcon"} onClick={() => deleteDedicatedIps(record)}>
                        <DeleteOutlined/></p>
                </Space>
            }),
        }
    ];
    const addNewDedicatedIp = () => {
        message.warn("Value has been successfully verified", 0.7);
    }

    const [dedicatedIpsDS, setDedicatedIpsDS] = useState<DedicatedIpsInterface[]>([]);

    useEffect(() => {
        let data: DedicatedIpsInterface[] = [];
        for (let i = 0; i < 100; i++) {
            data.push({
                key: i.toString(10),
                ipAddress: `127.0.0.${i}`,
                purchaseDate: `Doe ${i}`,
                status: 'Active'
            });
        }
        setDedicatedIpsDS(data);
    }, []);

    return <div className="domain pageLayout">
        <div className="reverseFlex">
            <Button className={'addBtn'} type={'primary'} onClick={addNewDedicatedIp}
                    icon={<PlusOutlined/>}>Add New</Button>
        </div>
        <div className="thirdNav" style={{height: 'calc(100vh - 238px)'}}>
            <Table scroll={{y: 'calc(100vh - 332px)'}} dataSource={dedicatedIpsDS} columns={columns} bordered/>
        </div>
    </div>
}