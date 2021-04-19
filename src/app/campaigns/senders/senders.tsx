import React, {useState} from "react";
import {Button, Popconfirm, Space, Table, Typography} from "antd";
import {DeleteOutlined, EditOutlined, PlusOutlined} from "@ant-design/icons";
import {SendersInterface} from "../campaignInterface";
import {updateBreadcrumb} from "../../../store/actions/root";
import {useDispatch} from "react-redux";
import {AmendSendersPage} from "./amendSenders/AmendSendersLoadable";

export const SendersPage: any = () => {
    const {Title} = Typography;
    const dispatch = useDispatch();

    const [segmentNameSelected, setSegmentNameSelected] = useState<string[]>([]);
    const [segmentDS, setSegmentDS] = useState<SendersInterface[]>([
        {
            key: '1',
            email: 'test+email@gmail.com',
            firstName: 'John',
            lastName: 'Pandey',
            domainVerified: 'Yes'
        },
        {
            key: '2',
            email: 'John.pandey@solulever.com',
            firstName: 'John Kumar',
            lastName: 'Pandey',
            domainVerified: 'No'
        }
    ]);
    const [segmentDSOps, setSegmentDSOps] = useState<SendersInterface[]>([
        {
            key: '1',
            email: 'test+email@gmail.com',
            firstName: 'John',
            lastName: 'Pandey',
            domainVerified: 'Yes'
        },
        {
            key: '2',
            email: 'John.pandey@solulever.com',
            firstName: 'John Kumar',
            lastName: 'Pandey',
            domainVerified: 'No'
        }
    ]);
    const columns = [
        {
            title: 'Email Address',
            dataIndex: 'email',
            key: 'email',
        },
        {
            title: 'First Name',
            dataIndex: 'firstName',
            key: 'firstName',
        },
        {
            title: 'Last Name',
            dataIndex: 'lastName',
            key: 'lastName',
        },
        {
            title: 'Domain Verified',
            dataIndex: 'domainVerified',
            key: 'domainVerified',
            width: '140px',
        },
        {
            title: 'Action',
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
                        <p><DeleteOutlined/></p>
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
            setSegmentNameSelected(rowsSelected);
        }
    };

    const openSegmentEdit = (record: any) => {
        setSendersObj(record);
        setModifySendersPage(true);
    };

    const deleteContact = (record: any) => {
        console.log(record);
    };

    const navigateToLandingPage = () => {
        dispatch(updateBreadcrumb(['Audience', 'Contacts']));
        setSendersObj({});
        setModifySendersPage(false);
    };

    return !modifySendersPage ? (
        <div className="pageLayout">
            <div className="reverseFlex">
                <Button type={'primary'} icon={<PlusOutlined/>} className="addBtn"
                        onClick={() => openSegmentEdit(true)}>Add New</Button>
            </div>
            <div className="thirdNav" style={{height: 'calc(100vh - 240px'}}>
                <Table rowSelection={{...segmentRowSelection}} columns={columns} dataSource={segmentDS} bordered/>
            </div>
        </div>
    ) : <AmendSendersPage sendersObj={sendersObj} routeToOverview={navigateToLandingPage}/>
}