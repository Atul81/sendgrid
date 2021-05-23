import React, {useEffect, useState} from "react";
import {message, Space, Table, Tag} from "antd";
import {EditOutlined} from "@ant-design/icons";
import {CustomEventsInterface} from "../settingsInterface";
import Title from "antd/lib/typography/Title";
import {getAllServerCall} from "../../../service/serverCalls/mockServerRest";
import Search from "antd/es/input/Search";

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
    const [customEventsDSOps, setCustomEventsDSOps] = useState<CustomEventsInterface[]>([]);

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
            setCustomEventsDSOps(data);
        });
    };

    const onSearchImports = (searchParam: string) => {
        setCustomEventsDS(customEventsDSOps.filter(value => {
            return value.name.includes(searchParam);
        }));
    };
    return (
        <div className="domain pageLayout">
            <div className="secondNav">
                <Title level={4}>Event Settings</Title>
            </div>
            <div className="firstNav">
                <div className="leftPlacement">
                    <div className="searchInput">
                        <Search placeholder="input search text" onSearch={onSearchImports} enterButton/>
                    </div>
                </div>
            </div>
            <div className="thirdNav">
                <Table dataSource={customEventsDS} columns={columns} bordered/>
            </div>
        </div>
    )
}
