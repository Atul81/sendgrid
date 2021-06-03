import React, {useEffect, useState} from "react";
import {Button, message, Popconfirm, Space, Table, Typography} from "antd";
import {DeleteOutlined, EditOutlined, PlusOutlined} from "@ant-design/icons";
import {SendersInterface} from "../campaignInterface";
import {updateBreadcrumb} from "../../../store/actions/root";
import {useDispatch} from "react-redux";
import {AmendSendersPage} from "./amendSenders/AmendSendersLoadable";
import {deleteObjectById, getAllServerCall} from "../../../service/serverCalls/mockServerRest";
import Search from "antd/es/input/Search";

export const SendersPage: any = () => {
    const {Title} = Typography;
    const dispatch = useDispatch();

    useEffect(() => {
        populateAllSenders();
    }, []);

    const [segmentNamesSelected, setSegmentNamesSelected] = useState<string[]>([]);
    const [segmentDS, setSegmentDS] = useState<SendersInterface[]>([]);
    const [segmentDSOps, setSegmentDSOps] = useState<SendersInterface[]>([]);
    const [senderId, setSenderId] = useState<number>(5);

    const columns = [
        {
            title: 'Email Address',
            dataIndex: 'email',
            key: 'email',
            sorter: (a: any, b: any) => a.email.length - b.email.length
        },
        {
            title: 'First Name',
            dataIndex: 'firstName',
            key: 'firstName',
            sorter: (a: any, b: any) => a.firstName.length - b.firstName.length
        },
        {
            title: 'Last Name',
            dataIndex: 'lastName',
            key: 'lastName',
            sorter: (a: any, b: any) => a.lastName.length - b.lastName.length
        },
        {
            dataIndex: '',
            key: 'action',
            width: '75px',
            render: ((text: string, record: any) => {
                return <Space size="small">
                    <p className={"actionColumn"} onClick={() => openSegmentEdit(record)}><EditOutlined/></p>
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

    const [sendersObj, setSendersObj] = useState({});
    const [modifySendersPage, setModifySendersPage] = useState(false);

    const segmentRowSelection = {
        onChange: (selectedRowKeys: React.Key[], selectedRows: SendersInterface[]) => {
            let rowsSelected: string[] = [];
            selectedRows.forEach(segItr => {
                rowsSelected.push(segItr.email);
            });
            setSegmentNamesSelected(rowsSelected);
        }
    };

    const openSegmentEdit = (record: any) => {
        setSendersObj({...record, generatedId: senderId});
        setSenderId(senderId + 1);
        setModifySendersPage(true);
    };

    const deleteContact = (record: any) => {
        deleteObjectById(record.key, 'senders').then(async deleteResAsync => {
            let delRes = await deleteResAsync.json();
            if (delRes) {
                message.success(`Sender of email ${record.email} has been successfully deleted`, 0.6);
                populateAllSenders();
            }
        })
    };

    const navigateToLandingPage = () => {
        populateAllSenders();
        dispatch(updateBreadcrumb(['Campaigns', 'Senders']));
        setSendersObj({});
        setModifySendersPage(false);
    };

    const populateAllSenders = () => {
        getAllServerCall('senders').then(async allSendersAsync => {
            let allSendersRes = await allSendersAsync.json();
            let tempItrObj: SendersInterface[] = [];
            if (allSendersRes) {
                allSendersRes.forEach((itr: any) => {
                    tempItrObj.push({...itr, key: itr.id});
                });
            }
            setSegmentDS(tempItrObj);
            setSegmentDSOps(tempItrObj);
        })
    };

    const onSearchSenders = (searchParam: string) => {
        setSegmentDS(segmentDSOps.filter(value => {
            return value.email.includes(searchParam);
        }));
    };

    return !modifySendersPage ? (
        <div className="pageLayout">
            <div className="secondNav">
                <Title level={4}>All Senders</Title>
            </div>
            <div className="firstNav">
                <div className="leftPlacement">
                    <div className="searchInput">
                        <Search placeholder="input search text" onSearch={onSearchSenders} enterButton/>
                    </div>
                </div>
                <div className="rightPlacement">
                    <Button type={'primary'} icon={<PlusOutlined/>} className="addBtn"
                            onClick={() => openSegmentEdit(true)}>Add New</Button>
                </div>
            </div>

            <div className="thirdNav">
                <Table rowSelection={{...segmentRowSelection}} columns={columns} dataSource={segmentDS} bordered/>
            </div>
        </div>
    ) : <AmendSendersPage sendersObj={sendersObj} routeToOverview={navigateToLandingPage}/>
}
