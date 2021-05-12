import React, {useEffect, useState} from "react";
import {message, Space, Table, Tag} from "antd";
import {EditOutlined} from "@ant-design/icons";
import {CustomEventsInterface} from "../settingsInterface";
import Title from "antd/lib/typography/Title";
import {getAllServerCall} from "../../../service/serverCalls/mockServerRest";

export const CustomEventsPage: any = () => {
    const editCustomEvent = (record: any) => {
        message.warn("Pending design, Work In Progress", 0.7).then(() => {
        });
    };

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
        populateTableData();
    }, []);

    const populateTableData = () => {
        getAllServerCall('customEvents').then(async allCustomEventsAsync => {
            let allCustomEventsRes = await allCustomEventsAsync.json();
            let data: CustomEventsInterface[] = [];
            if (allCustomEventsRes) {
                allCustomEventsRes.forEach((itr: any) => {
                    data.push({...itr, key: itr.id});
                });
            }
            setCustomEventsDS(data);
        });
    }

    return <div className="domain pageLayout">
        <div className="firstNav">
            <Title level={4}>Event Settings</Title>
        </div>
        <div className="thirdNav" style={{height: 'calc(100vh - 238px)'}}>
            <Table scroll={{y: 'calc(100vh - 332px)'}} dataSource={customEventsDS} columns={columns} bordered/>
        </div>
    </div>
}