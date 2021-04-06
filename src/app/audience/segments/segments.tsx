import React, {useState} from "react";
import {Button, Input, message, Popconfirm, Space, Table, Typography} from "antd";
import {SegmentInterface} from "../contactInterface";
import {DeleteOutlined, EditOutlined} from "@ant-design/icons";

export const SegmentsPage: any = () => {
    const {Search} = Input;
    const {Title} = Typography;

    const [segmentNameSelected, setSegmentNameSelected] = useState<string[]>([]);
    const [segmentDS, setSegmentDS] = useState<SegmentInterface[]>([
        {
            key: '1',
            name: 'Atul Pandey',
            contacts: 9411355956,
            conditions: 1
        },
        {
            key: '2',
            name: 'Ejaz Ali',
            contacts: 123456789,
            conditions: 2
        }
    ]);
    const [segmentDSOps, setSegmentDSOps] = useState<SegmentInterface[]>([
        {
            key: '1',
            name: 'Atul Pandey',
            contacts: 9411355956,
            conditions: 1
        },
        {
            key: '2',
            name: 'Ejaz Ali',
            contacts: 123456789,
            conditions: 2
        }
    ]);
    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Contacts',
            dataIndex: 'contacts',
            key: 'contacts',
        },
        {
            title: 'Conditions',
            dataIndex: 'conditions',
            key: 'conditions',
        },
        {
            title: 'Action',
            dataIndex: '',
            key: 'action',
            width: '75px',
            render: ((text: string, record: any) => {
                return <Space size="small">
                    <p className={"actionColumn"}
                       onClick={() => openSegmentEdit(record)}><EditOutlined/></p>
                    <Popconfirm overlayClassName="ant-popover-audience" placement="left"
                                title={<p><Title level={5}>Are you sure you want to delete?</Title>
                                    This will permanently delete these records and all associated data from your
                                    account. Deleting and re-adding records can alter your monthly contact limits.
                                    <a href={"https://www.google.com"} target={'_blank'} rel={'noreferrer'}>Learn
                                        More</a></p>}
                                okText="Delete" cancelText="Cancel"
                                onConfirm={() => deleteContact(record)}>
                        <p><DeleteOutlined/></p>
                    </Popconfirm>
                </Space>
            }),
        },
    ];
    const [newSegmentModal, setNewSegmentMoal] = useState(false);
    const [segmentObj, setSegmentObj] = useState({});

    const onSearch = (searchParam: string) => {
        setSegmentDS(segmentDSOps.filter(value => {
            return value.name.includes(searchParam);
        }));
    };

    const segmentRowSelection = {
        onChange: (selectedRowKeys: React.Key[], selectedRows: SegmentInterface[]) => {
            let rowsSelected: string[] = [];
            selectedRows.forEach(segItr => {
                rowsSelected.push(segItr.name);
            });
            setSegmentNameSelected(rowsSelected);
        }
    };

    const openSegmentEdit = (record: any) => {
        setSegmentObj(record);
        setNewSegmentMoal(true);
        message.warn("Work in progress", 0.2).then(() => {});
    };

    const deleteContact = (record: any) => {
        console.log(record);
    }

    const updateNewSegmentService = (segObj: any) => {
        console.log('click', segObj);
    };

    const deleteAllContact = () => {
        if (segmentNameSelected.length === 0) {
            message.warning("Please use the checkbox to select contact for deletion", 0.8);
        }
        console.log(segmentNameSelected);
    };
    return (
        <div className="contacts pageLayout">
            <div className="firstNav">
                <div className="leftPlacement">
                    <div className="searchInput">
                        <Search placeholder="input search text" onSearch={onSearch} enterButton/>
                    </div>
                </div>
                <div className="rightPlacement">
                    <Popconfirm overlayClassName="ant-popover-audience" placement="left"
                                title={<p><Title level={5}>Are you sure you want to delete?</Title>
                                    This will permanently delete these records and all associated data from your
                                    account. Deleting and re-adding records can alter your monthly contact limits. <a>Learn
                                        More</a></p>}
                                okText="Delete" cancelText="Cancel"
                                onConfirm={deleteAllContact}>
                        <Button className="deleteBtn" icon={<DeleteOutlined/>} type="primary" danger>Delete</Button>
                    </Popconfirm>
                    <Button type={'primary'} className="addBtn" onClick={() => openSegmentEdit(true)}>Add New
                        Segment</Button>
                </div>
            </div>
            <div className="secondNav">
                <Title level={4}>All Segments</Title>
            </div>
            <div className="thirdNav">
                <Table rowSelection={{...segmentRowSelection}} columns={columns} dataSource={segmentDS} bordered/>
            </div>
        </div>
    )
}