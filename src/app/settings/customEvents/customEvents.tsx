import React, {useEffect, useState} from "react";
import {Space, Table, Tag} from "antd";
import {EditOutlined} from "@ant-design/icons";
import {CustomEventsInterface} from "../settingsInterface";
import Title from "antd/lib/typography/Title";

export const CustomEventsPage: any = () => {
    const editCustomEvent = (record: any) => {
    }
    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
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
            title: 'Description',
            dataIndex: 'description',
            key: 'description',
            width: '40%',
            ellipsis: true
        },
        {
            title: 'Action',
            dataIndex: '',
            key: 'action',
            width: '75px',
            render: ((text: string, record: any) => {
                return <Space size="small">
                    <p className={"actionColumn noMarginIcon"} onClick={() => editCustomEvent(record)}>
                        <EditOutlined/></p>
                </Space>
            }),
        }
    ];

    const [customEventsDS, setCustomEventsDS] = useState<CustomEventsInterface[]>([]);

    useEffect(() => {
        let data: CustomEventsInterface[] = [];
        for (let i = 0; i < 100; i++) {
            data.push({
                key: i.toString(10),
                name: `Event Web Hook Requests ${i}`,
                description: `Allows notifications for events, such as bounces and ${i}`,
                status: 'Active'
            });
        }
        setCustomEventsDS(data);
    }, []);

    return <div className="domain pageLayout">
        <div className="firstNav">
            <Title level={4}>Event Settings</Title>
        </div>
        <div className="thirdNav" style={{height: 'calc(100vh - 238px)'}}>
            <Table scroll={{y: 'calc(100vh - 332px)'}} dataSource={customEventsDS} columns={columns} bordered/>
        </div>
    </div>
}