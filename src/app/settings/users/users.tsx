import React, {useEffect, useState} from "react";
import {Button, message, Space, Table, Tag} from "antd";
import {DeleteOutlined, EditOutlined, PlusOutlined} from "@ant-design/icons";
import {UsersInterface} from "../settingsInterface";

export const UsersPage: any = () => {
    const deleteSelectedUser = (record: any) => {
    };

    const editSelectedUser = (record: any) => {
    };
    const columns = [
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
            width: '70%'
        },
        {
            title: 'Type',
            dataIndex: 'type',
            key: 'type',
            render: ((text: string, record: any) => {
                return (
                    <Tag key={record.key} color={text === 'Admin' ? 'green' : 'red'}>{text}</Tag>
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
                    <p className={"actionColumn noMarginIcon"} onClick={() => editSelectedUser(record)}>
                        <EditOutlined/></p>
                    <p className={"actionColumn noMarginIcon"} onClick={() => deleteSelectedUser(record)}>
                        <DeleteOutlined/></p>
                </Space>
            }),
        }
    ];
    const addNewUser = () => {
        message.warn("Value has been successfully verified", 0.7);
    }

    const [usersDS, setUsersDS] = useState<UsersInterface[]>([]);

    useEffect(() => {
        let data: UsersInterface[] = [];
        for (let i = 0; i < 100; i++) {
            data.push({
                key: i.toString(10),
                email: `dev-testing${i}@gmail.com`,
                type: 'Admin'
            });
        }
        setUsersDS(data);
    }, []);

    return <div className="domain pageLayout">
        <div className="reverseFlex">
            <Button className={'addBtn'} type={'primary'} onClick={addNewUser} icon={<PlusOutlined/>}>Add New</Button>
        </div>
        <div className="thirdNav" style={{height: 'calc(100vh - 238px)'}}>
            <Table scroll={{y: 'calc(100vh - 332px)'}} dataSource={usersDS} columns={columns} bordered/>
        </div>
    </div>
}