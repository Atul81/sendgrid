import React, {useEffect, useState} from "react";
import {Button, Input, message, Modal, Popconfirm, Space, Table} from "antd";
import {CopyOutlined, DeleteOutlined, EditOutlined, EyeOutlined, PlusOutlined} from "@ant-design/icons";
import Title from "antd/lib/typography/Title";
import Search from "antd/lib/input/Search";
import {AmendCampaignsPage} from "./amendCampaigns/AmendCampaignsLoadable";
import {CampaignInterface} from "../campaignInterface";
import {addNewObject, deleteObjectById, getAllServerCall} from "../../../service/serverCalls/mockServerRest";
import {updateBreadcrumb} from "../../../store/actions/root";
import {useDispatch} from "react-redux";

export const CampaignPage: any = () => {

    const dispatch = useDispatch();

    useEffect(() => {
        populateAllCampaigns();
    }, []);

    const [openAutomationAmend, setOpenAutomationAmend] = useState(false);
    const [campaignObj, setCampaignObj] = useState({
        name: ''
    });
    const [campaignsDS, setCampaignsDS] = useState<CampaignInterface[]>([]);
    const [campaignsDSOps, setCampaignsDSOps] = useState<CampaignInterface[]>([]);
    const [selectedAutomationKeys, setAutomationKeys] = useState<string[]>([]);
    const [newCampaignModal, setNewCampaignModal] = useState(false);
    const [campaignId, setCampaignId] = useState(3);

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
                    <p className={"actionColumn"} onClick={() => addNewCampaign(true, record)}><CopyOutlined/></p>
                    <p className={"actionColumn"} onClick={() => openAutomationRow(record, 'edit')}><EditOutlined/></p>
                    <Popconfirm overlayClassName="ant-popover-audience" placement="left"
                                title={<p><Title level={5}>Are you sure you want to delete?</Title>
                                    This will permanently delete these records and all associated data from your
                                    account. Deleting and re-adding records can alter your monthly contact limits.
                                    <a href={'https://www.google.com'} target={'_blank'} rel={'noreferrer'}>Learn
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
        dispatch(updateBreadcrumb(['Campaign', 'Campaigns', 'amend-campaign']));
        setCampaignObj({...record, openType: openType});
    };

    const deleteCustomFields = (record: any) => {
        deleteObjectById(record.key, 'campaigns').then(async deleteRes => {
            let deleteData = deleteRes.json();
            if (deleteData) {
                message.success(`Campaign of name ${record.name} has been successfully deleted`, 0.7);
                populateAllCampaigns();
            }
        });
    };

    const onSearch = (searchParam: string) => {
        setCampaignsDS(campaignsDSOps.filter(value => {
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
        } else {
            message.error("Bulk Delete not supported", 0.7).then(() => {
            });
        }
    };

    const navigateToLandingPage = () => {
        setOpenAutomationAmend(false);
        setCampaignObj({name: ''});
        dispatch(updateBreadcrumb(['Campaign', 'Campaigns']));
    };

    const populateAllCampaigns = () => {
        getAllServerCall('campaigns').then(async res => {
            let data = await res.json();
            let tempObj: CampaignInterface[] = [];
            if (data && Array.isArray(data)) {
                data.forEach((itr: any) => {
                    tempObj.push({...itr, key: itr.id})
                });
            }
            setCampaignsDS(tempObj);
            setCampaignsDSOps(tempObj);
        });
    };

    const addNewCampaign = (copied: boolean, existingCampaign: any) => {
        if (campaignObj.name || (copied && existingCampaign.name)) {
            addNewObject({
                name: (copied && null !== existingCampaign) ? existingCampaign.name.concat(` - 
                Copied ${existingCampaign.key}`) : campaignObj.name,
                status: (copied && null !== existingCampaign) ? existingCampaign.status : 'Un-scheduled',
                id: campaignId
            }, 'campaigns').then(async newAutRes => {
                let autRes = newAutRes.json();
                if (autRes) {
                    openAutomationRow(campaignObj, 'create')
                    setCampaignId(campaignId + 1);
                    setNewCampaignModal(false);
                    populateAllCampaigns();
                }
            });
        } else {
            message.error("Automation Name required", 0.5).then(() => {
            });
        }
    };


    return !openAutomationAmend ? (
        <div className="pageLayout">
            <div className="secondNav">
                <Title level={4}>Campaigns</Title>
            </div>
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
                                        limits. <a href={"https://www.google.com"}
                                                   target={'_blank'} rel={'noreferrer'}>Learn More</a></p>}
                                    okText="Delete" cancelText="Cancel" onConfirm={deleteSelectFields}>
                            <Button className="deleteBtn" icon={<DeleteOutlined/>} type="primary"
                                    danger>Delete</Button>
                        </Popconfirm> : null}
                    <Button style={{width: 90}} icon={<PlusOutlined/>} onClick={() => setNewCampaignModal(true)}
                            type={'primary'}>Add New</Button>
                </div>
            </div>
            <Modal title="Add New Campaign" centered visible={newCampaignModal}
                   onOk={() => addNewCampaign(false, null)} destroyOnClose={true}
                   onCancel={() => setNewCampaignModal(false)} width={300}>
                <Input placeholder="New Campaign Name"
                       onChange={(inpEvent) => setCampaignObj({name: inpEvent.target.value})}/>
            </Modal>
            <div className="thirdNav">
                <Table rowSelection={{...customFieldRowSelection}} dataSource={campaignsDS} columns={columns}
                       bordered/>
            </div>
        </div>
    ) : <AmendCampaignsPage amendObj={campaignObj} routeToOverview={navigateToLandingPage}/>;
}