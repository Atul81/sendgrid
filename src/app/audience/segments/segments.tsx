import React, {useEffect, useState} from "react";
import {Button, Input, message, Popconfirm, Space, Table, Typography} from "antd";
import {SegmentInterface} from "../audienceInterface";
import {DeleteOutlined, EditOutlined, PlusOutlined} from "@ant-design/icons";
import {deleteObjectById, getAllServerCall} from "../../../service/serverCalls/mockServerRest";

export const SegmentsPage: any = () => {

    useEffect(() => {
        populateAllSegments();
    }, []);

    const populateAllSegments = () => {
        getAllServerCall('segments').then(async response => {
            let resBody = await response.json();
            let data: SegmentInterface[] = [];
            if (resBody && Array.isArray(resBody)) {
                resBody.forEach((itr: any) => {
                    data.push({...itr, key: itr.id});
                });
            }
            setSegmentDS(data);
            setSegmentDSOps(data);
        });
    }
    const {Search} = Input;
    const {Title} = Typography;

    const [segmentNameSelected, setSegmentNameSelected] = useState<string[]>([]);
    const [segmentDS, setSegmentDS] = useState<SegmentInterface[]>([]);
    const [segmentDSOps, setSegmentDSOps] = useState<SegmentInterface[]>([]);
    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Type',
            dataIndex: 'type',
            key: 'type',
            width: '15%'
        },
        {
            title: 'Last Modified',
            dataIndex: 'lastModified',
            key: 'lastModified',
            width: '15%'
        },
        {
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
                        <p className={"actionColumn"}><DeleteOutlined/></p>
                    </Popconfirm>
                </Space>
            }),
        },
    ];
    const [newSegmentModal, setNewSegmentModal] = useState(false);
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
        setNewSegmentModal(true);
        message.warn("Work in progress", 0.2).then(() => {
        });
    };

    const deleteContact = (record: any) => {
        deleteObjectById(record.key, 'segments').then(async response => {
            let resBody = await response.json();
            if (resBody) {
                populateAllSegments();
                message.success(`Segment with name ${record.name} has been successfully deleted`);
            }
        });
    };

    const deleteAllContact = () => {
        if (segmentNameSelected.length === 0) {
            message.warning("Please use the checkbox to select contact for deletion", 0.8).then(() => {
            });
        }
        message.error("Bulk Delete not yet supported").then(() => {
        });
    };
    return (
        <div className="pageLayout">
            <div className="secondNav">
                <Title level={4}>All Segments</Title>
            </div>
            <div className="firstNav">
                <div className="leftPlacement">
                    <div className="searchInput">
                        <Search placeholder="input search text" onSearch={onSearch} enterButton/>
                    </div>
                </div>
                <div className="rightPlacement">
                    {segmentNameSelected.length > 0 ?
                        <Popconfirm overlayClassName="ant-popover-audience" placement="left"
                                    title={<p><Title level={5}>Are you sure you want to delete?</Title>
                                        This will permanently delete these records and all associated data from your
                                        account. Deleting and re-adding records can alter your monthly contact
                                        limits. <a href={'https://www.google.com'} target={'_blank'} rel={'noreferrer'}>Learn
                                            More</a></p>}
                                    okText="Delete" cancelText="Cancel"
                                    onConfirm={deleteAllContact}>
                            <Button className="deleteBtn" icon={<DeleteOutlined/>} type="primary" danger>Delete</Button>
                        </Popconfirm> : null}
                    <Button type={'primary'} icon={<PlusOutlined/>} style={{width: 150}}
                            onClick={() => openSegmentEdit(true)}>Add New
                        Segment</Button>
                </div>
            </div>
            <div className="thirdNav">
                <Table rowSelection={{...segmentRowSelection}} columns={columns} dataSource={segmentDS} bordered/>
            </div>
        </div>
    )
}
