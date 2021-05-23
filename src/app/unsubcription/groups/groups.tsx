import React, {useEffect, useState} from "react";
import {Button, Form, Input, message, Modal, Popconfirm, Space, Switch, Table} from "antd";
import {CheckOutlined, CloseOutlined, DeleteOutlined, EditOutlined, PlusOutlined} from "@ant-design/icons";
import Title from "antd/es/typography/Title";
import {GroupNameInterface} from "../unsubcriptionInterface";
import Paragraph from "antd/es/typography/Paragraph";
import {useLocation} from "react-router-dom";
import {
    addNewObject,
    deleteObjectById,
    editObjectById,
    getAllServerCall
} from "../../../service/serverCalls/mockServerRest";
import {updateActiveContent, updateBreadcrumb} from "../../../store/actions/root";
import {useDispatch} from "react-redux";
import Search from "antd/es/input/Search";

export const GroupsPage: any = () => {
    const dispatch = useDispatch();
    const [groupNameDS, setGroupNameDS] = useState<GroupNameInterface[]>([]);
    const [groupNameDSOps, setGroupNameDSOps] = useState<GroupNameInterface[]>([]);
    const [selectedGroups, setSelectedGroups] = useState<string[]>([]);
    const urlPath = useLocation();
    const [groupId, setGroupId] = useState(7);
    const [groupObj, setGroupObj] = useState({
        id: ''
    });

    const contactRowSelection = {
        onChange: (selectedRowKeys: React.Key[], selectedRows: GroupNameInterface[]) => {
            let rowsSelected: string[] = [];
            selectedRows.forEach(contactsData => {
                rowsSelected.push(contactsData.key);
            });
            setSelectedGroups(rowsSelected);
        }
    };
    useEffect(() => {
        dispatch(updateBreadcrumb(['unsubscription', 'groups']));
        dispatch(updateActiveContent('groups'));
        populateAllGroups();
    }, [dispatch, urlPath.pathname]);

    const openGroupNameEdit = (record: any) => {
        unsubscribeForm.setFieldsValue({
            formObj: {
                groupName: record.groupName,
                groupDesc: record.groupDesc,
                globalDisplay: record.globalDisplay,
            }
        });
        setGroupObj({...record, id: record.key});
        setSwitchCheck(record.globalDisplay);
        setAmendGroupModal(true);
    };

    const deleteGroupName = (record: any) => {
        deleteObjectById(record.key, 'groups').then(async deleteGroupAsync => {
            let delGroupRes = await deleteGroupAsync.json();
            if (delGroupRes) {
                message.success(`Group ${record.groupName} has been successfully deleted`, 0.7);
                populateAllGroups();
            }
        })
    }
    const columns = [
        {
            title: 'Group Name',
            dataIndex: 'groupName',
            key: 'groupName',
        },
        {
            dataIndex: '',
            key: 'action',
            width: '75px',
            render: ((text: string, record: any) => {
                return <Space size="small">
                    <p className={"actionColumn"} onClick={() => openGroupNameEdit(record)}><EditOutlined/></p>
                    <Popconfirm overlayClassName="ant-popover-audience" placement="left"
                                title={<p><Title level={5}>Are you sure you want to delete?</Title>
                                    This will permanently delete these records and all associated data from your
                                    account. Deleting and re-adding records can alter your monthly contact limits. <a>Learn
                                        More</a></p>}
                                okText="Delete" cancelText="Cancel"
                                onConfirm={() => deleteGroupName(record)}>
                        <p className={"actionColumn"}><DeleteOutlined/></p>
                    </Popconfirm>
                </Space>
            }),
        }
    ];

    const [amendGroupModal, setAmendGroupModal] = useState(false);
    const [switchCheck, setSwitchCheck] = useState(false);
    const [unsubscribeForm] = Form.useForm();
    const {TextArea} = Input;

    const cancelUnsubscribeAmend = () => {
        setAmendGroupModal(false);
        unsubscribeForm.resetFields();
        setSwitchCheck(false);
        setGroupObj({id: ''});
    };

    const amendGroupService = (values: any) => {
        if (groupObj && groupObj.id) {
            let editObject = {
                ...values.formObj,
                globalDisplay: switchCheck,
                id: groupObj.id
            }
            editObjectById(editObject, 'groups').then(async editGroupAsync => {
                let editGroupRes = await editGroupAsync.json();
                if (editGroupRes) {
                    message.success(`Group ${values.formObj.groupName} has been successfully updated`);
                }
            });
        } else {
            let newGrpId = groupId + 1;
            let amendGrpObj = {...values.formObj, globalDisplay: switchCheck, id: newGrpId};
            addNewObject(amendGrpObj, 'groups').then(async newGroupAsync => {
                let newGrpRes = await newGroupAsync.json();
                if (newGrpRes) {
                    message.success(`New Group ${amendGrpObj.groupName} has been successfully created`, 0.6);
                    setGroupId(newGrpId);
                }
            })
        }
        setAmendGroupModal(false);
        populateAllGroups();
    };

    const populateAllGroups = () => {
        getAllServerCall('groups').then(async allGroupsAsync => {
            let allGroupsRes = await allGroupsAsync.json();
            let tempItrObj: GroupNameInterface[] = [];
            if (allGroupsRes) {
                allGroupsRes.forEach((itr: any) => {
                    tempItrObj.push({...itr, key: itr.id});
                    setGroupId(itr.id);
                });
            }
            setGroupNameDS(tempItrObj);
            setGroupNameDSOps(tempItrObj);
        });
    };

    const onSearchGroups = (searchParam: string) => {
        setGroupNameDS(groupNameDSOps.filter(value => {
            return value.groupName.includes(searchParam);
        }));
    };

    return (
        <div className={'pageLayout'}>
            <div className="secondNav">
                <Title level={4}>All Groups</Title>
            </div>
            <div className="firstNav">
                <div className="leftPlacement">
                    <div className="searchInput">
                        <Search placeholder="input search text" onSearch={onSearchGroups} enterButton/>
                    </div>
                </div>
                <div className="rightPlacement">
                    {selectedGroups.length > 0 ?
                        <Button style={{marginRight: 8}} className={'deleteBtn'} key="delGroup" type="primary" danger
                                icon={<DeleteOutlined/>}>
                            Delete
                        </Button> : null}
                    <Button key="addGroup" type="primary" style={{width: 100}}
                            onClick={() => setAmendGroupModal(true)}
                            icon={<PlusOutlined/>}>
                        Add New
                    </Button>
                </div>
            </div>
            <Modal title="Add Unsubscribe Group" centered visible={amendGroupModal} width={500} footer={null}
                   closable={false} destroyOnClose={true}
                   onCancel={cancelUnsubscribeAmend}>
                <div className='columnFlex'>
                    <Form form={unsubscribeForm} layout={'vertical'} onFinish={amendGroupService}>
                        <Form.Item label="Group Name" required>
                            <Form.Item name={['formObj', 'groupName']}
                                       noStyle rules={[{required: true, message: 'Email Address required'}]}>
                                <Input placeholder="Text Only" type={"text"}/>
                            </Form.Item>
                        </Form.Item>
                        <Form.Item label="Group Description">
                            <Form.Item name={['formObj', 'groupDesc']} noStyle>
                                <TextArea placeholder="Text Only"/>
                            </Form.Item>
                        </Form.Item>
                        <Form.Item label={null}>
                            <Form.Item noStyle>
                                <div className={'flexEqualSpacing'}>
                                    <Switch defaultChecked={switchCheck}
                                            onChange={(checked => setSwitchCheck(checked))}/>
                                    <Paragraph>Display this group in global subscription preferences</Paragraph></div>
                            </Form.Item>
                        </Form.Item>
                        <div className='reverseFlex'>
                            <Form.Item>
                                <Button key="cancel" htmlType={'reset'} onClick={cancelUnsubscribeAmend}
                                        icon={<CloseOutlined/>}>
                                    Cancel
                                </Button>
                            </Form.Item>
                            <Form.Item>
                                <Button style={{marginRight: 8}} key="quickAdd" htmlType={'submit'} type="primary"
                                        icon={groupObj.id ? <CheckOutlined/> : <PlusOutlined/>}>
                                    {groupObj.id ? 'Save' : 'Add'}
                                </Button>
                            </Form.Item>
                        </div>
                    </Form>
                </div>
            </Modal>
            <div className="thirdNav">
                <Table rowSelection={{...contactRowSelection}} dataSource={groupNameDS} columns={columns} bordered/>
            </div>
        </div>
    )
}
