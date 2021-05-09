import React, {useEffect, useState} from "react";
import {Button, Input, message, Modal, Popconfirm, Space, Table} from "antd";
import {DeleteOutlined, EditOutlined, EyeOutlined, PlusOutlined} from "@ant-design/icons";
import Title from "antd/lib/typography/Title";
import Search from "antd/lib/input/Search";
import {CampaignInterface} from "../campaignInterface";
import {AmendAutomationPage} from "./amendAutomation/AmendAutomationLoadable";
import {addNewObject, deleteObjectById, getAllServerCall} from "../../../service/serverCalls/mockServerRest";

export const AutomationPage: any = () => {

    useEffect(() => {
        populateAllAutomations();
    }, []);

    const [openAutomationAmend, setOpenAutomationAmend] = useState(false);
    const [automationObj, setAutomationObj] = useState({
        name: ''
    });
    const [automationDS, setAutomationDS] = useState<CampaignInterface[]>([]);
    const [automationDSOps, setAutomationDSOps] = useState<CampaignInterface[]>([]);
    const [selectedAutomationKeys, setAutomationKeys] = useState<string[]>([]);
    const [newAutomationModal, setNewAutomationModal] = useState(false);
    const [automationId, setAutomationId] = useState(3);

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

    const populateAllAutomations = () => {
        getAllServerCall('automation').then(async res => {
            let data = await res.json();
            let tempObj: CampaignInterface[] = [];
            if (data && Array.isArray(data)) {
                data.forEach((itr: any) => {
                    tempObj.push({...itr, key: itr.id})
                });
            }
            setAutomationDS(tempObj);
            setAutomationDSOps(tempObj);
        });
    };

    const openAutomationRow = (record: any, openType: string) => {
        setOpenAutomationAmend(true);
        setAutomationObj({...record, viewType: openType});
    };

    const onSearch = (searchParam: string) => {
        setAutomationDS(automationDSOps.filter(value => {
            return value.name.includes(searchParam);
        }));
    };

    const deleteCustomFields = (record: any) => {
        deleteObjectById(record.key, 'automation').then(async response => {
            let delRes = await response.json();
            if (delRes) {
                message.success(`Automation ${record.name} has been successfully deleted`);
                populateAllAutomations();
            }
        })
    };

    const addNewAutomation = () => {
        if (automationObj.name) {
            addNewObject({
                name: automationObj.name,
                status: 'Un-scheduled',
                id: automationId
            }, 'automation').then(async newAutRes => {
                let autRes = newAutRes.json();
                if (autRes) {
                    openAutomationRow(null, 'create')
                    setAutomationId(automationId + 1);
                    setNewAutomationModal(false);
                    populateAllAutomations();
                }
            });
        } else {
            message.error("Automation Name required", 0.5).then(() => {
            });
        }
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

    const navigateToLandingPage = () => {
        setOpenAutomationAmend(false);
        setAutomationObj({name: ''});
    };

    const deleteSelectFields = () => {
        if (selectedAutomationKeys.length === 0) {
            message.warning("Please use the checkbox to select contact for deletion", 0.8).then(() => {
            });
        } else {
            message.error("Bulk Delete not supported", 0.7).then(() => {
            });
        }
    };

    return !openAutomationAmend ? (
        <div className="pageLayout">
            <div className="firstNav">
                <div className="leftPlacement">
                    <Search placeholder="Search Custom field" onSearch={onSearch} enterButton/>
                </div>
                <div className="rightPlacement">
                    {selectedAutomationKeys.length > 0 ?
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
                        </Popconfirm> : null}
                    <Button style={{width: 90}} icon={<PlusOutlined/>} onClick={() => setNewAutomationModal(true)}
                            type={'primary'}>Add New</Button>
                </div>
            </div>
            <Modal title="Add New Automation" centered visible={newAutomationModal}
                   onOk={addNewAutomation} destroyOnClose={true}
                   onCancel={() => setNewAutomationModal(false)} width={300}>
                <Input placeholder="New Automation Name"
                       onChange={(inpEvent) => setAutomationObj({name: inpEvent.target.value})}/>
            </Modal>
            <div className="thirdNav" style={{height: 'calc(100vh - 228px)'}}>
                <Table rowSelection={{...customFieldRowSelection}} dataSource={automationDS} columns={columns}
                       bordered/>
            </div>
        </div>
    ) : <AmendAutomationPage amendObj={automationObj} routeToOverview={navigateToLandingPage}/>;
}