import React, {useState} from "react";
import {Button, message, Popconfirm, Space, Table} from "antd";
import {CopyOutlined, DeleteOutlined, EditOutlined, EyeOutlined, PlusOutlined} from "@ant-design/icons";
import Title from "antd/lib/typography/Title";
import Search from "antd/lib/input/Search";
import {AmendCampaignsPage} from "./amendCampaigns/AmendCampaignsLoadable";
import {CampaignInterface} from "../campaignInterface";

export const CampaignPage: any = () => {
    const [openAutomationAmend, setOpenAutomationAmend] = useState(false);
    const [automationOpenType, setOpenType] = useState('view');
    const [automationObj, setAutomationObj] = useState({});
    const [customFieldsDS, setCustomFieldsDS] = useState<CampaignInterface[]>([
        {
            key: '1',
            name: 'Name of the automation',
            status: 'Scheduled'
        },
        {
            key: '2',
            name: 'Exit Intent Flow',
            status: 'Sent'
        }
    ]);
    const [customFieldsDSOps, setCustomFieldsDSOps] = useState<CampaignInterface[]>([
        {
            key: '1',
            name: 'Name of the automation',
            status: 'Scheduled'
        },
        {
            key: '2',
            name: 'Exit Intent Flow',
            status: 'Sent'
        }
    ]);
    const [selectedAutomationKeys, setAutomationKeys] = useState<string[]>([]);

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
        },
        {
            title: 'Action',
            dataIndex: '',
            key: 'action',
            width: '75px',
            render: ((text: string, record: any) => {
                return <Space size="small">
                    <p className={"actionColumn"} onClick={() => openAutomationRow(record, 'view')}><EyeOutlined/></p>
                    <p className={"actionColumn"} onClick={() => openAutomationRow(record, 'copy')}><CopyOutlined/></p>
                    <p className={"actionColumn"} onClick={() => openAutomationRow(record, 'edit')}><EditOutlined/></p>
                    <Popconfirm overlayClassName="ant-popover-audience" placement="left"
                                title={<p><Title level={5}>Are you sure you want to delete?</Title>
                                    This will permanently delete these records and all associated data from your
                                    account. Deleting and re-adding records can alter your monthly contact limits. <a>Learn
                                        More</a></p>}
                                okText="Delete" cancelText="Cancel"
                                onConfirm={() => deleteCustomFields(record)}>
                        <p className={"actionColumn"}>
                            <DeleteOutlined/>
                        </p>
                    </Popconfirm>
                </Space>
            }),
        },
    ];

    const openAutomationRow = (record: any, openType: string) => {
        setOpenAutomationAmend(true);
        setAutomationObj(record);
        setOpenType(openType);
    };

    const deleteCustomFields = (record: any) => {
        console.log(record);
    }
    const onSearch = (searchParam: string) => {
        setCustomFieldsDS(customFieldsDSOps.filter(value => {
            return value.name.includes(searchParam);
        }));
    };

    const customFieldRowSelection = {
        onChange: (selectedRowKeys: React.Key[], selectedRows: CampaignInterface[]) => {
            let rowsSelected: string[] = [];
            selectedRows.forEach(customFieldItr => {
                rowsSelected.push(customFieldItr.key);
            });
            setAutomationKeys(rowsSelected);
        }
    };

    const deleteSelectFields = () => {
        if (selectedAutomationKeys.length === 0) {
            message.warning("Please use the checkbox to select contact for deletion", 0.8).then(() => {
            });
        }
        console.log(selectedAutomationKeys);
    };

    const navigateToLandingPage = () => {
        setOpenAutomationAmend(false);
        setAutomationObj({});
        setOpenType('view');
    };

    return !openAutomationAmend ? (
        <div className="pageLayout">
            <div className="firstNav">
                <div className="leftPlacement">
                    <Search placeholder="Search Custom field" onSearch={onSearch} enterButton/>
                </div>
                <div className="rightPlacement">
                    <Popconfirm overlayClassName="ant-popover-audience" placement="left"
                                title={<p><Title level={5}>Are you sure you want to delete?</Title>
                                    This will permanently delete these records and all associated data from your
                                    account. Deleting and re-adding records can alter your monthly contact
                                    limits. <a href={"https://www.google.com"} target={'_blank'} rel={'noreferrer'}>Learn
                                        More</a></p>}
                                okText="Delete" cancelText="Cancel"
                                onConfirm={deleteSelectFields}>
                        <Button className="deleteBtn" icon={<DeleteOutlined/>} type="primary"
                                danger>Delete</Button>
                    </Popconfirm>
                    <Button style={{width: 90}} icon={<PlusOutlined/>} onClick={() => openAutomationRow(null, 'create')}
                            type={'primary'}>Add New</Button>
                </div>
            </div>
            <div className="thirdNav" style={{height: 'calc(100vh - 228px)'}}>
                <Table rowSelection={{...customFieldRowSelection}} dataSource={customFieldsDS} columns={columns}
                       bordered/>
            </div>
        </div>
    ) : <AmendCampaignsPage amendObj={automationObj} routeToOverview={navigateToLandingPage}/>;
}