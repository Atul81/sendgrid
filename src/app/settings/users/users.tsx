import React, {useEffect, useState} from "react";
import {Button, Form, Input, message, Modal, Popconfirm, Radio, Select, Space, Table, Tag} from "antd";
import {CheckOutlined, CloseOutlined, DeleteOutlined, EditOutlined, PlusOutlined} from "@ant-design/icons";
import {UsersInterface} from "../settingsInterface";
import {DropDown} from "../../../utils/Interfaces";
import Title from "antd/lib/typography/Title";
import {
    addNewObject,
    deleteObjectById,
    editObjectById,
    getAllServerCall
} from "../../../service/serverCalls/mockServerRest";

export const UsersPage: any = () => {

    const [userAmendModal, setUserAmendModal] = useState(false);
    const [userModalForm] = Form.useForm();
    const {Option} = Select;
    const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
    const [userId, setUserId] = useState(11);
    const [userObj, setUserObj] = useState({
        key: 0,
        email: ''
    });
    const [userRoles, setUserRoles] = useState<DropDown[]>([{
        label: 'Admin',
        value: 'admin',
        children: null
    }, {label: 'Standard', value: 'std', children: null}]);

    const deleteSelectedUser = (record: any) => {
        deleteObjectById(record.key, 'users').then(async deleteUserAsync => {
            let deleteUserRes = await deleteUserAsync.json();
            if (deleteUserRes) {
                message.success(`User ${record.email} has been successfully deleted`);
                populateAllUsers();
            }
        });
    };

    const createEditUser = (record: any) => {
        setUserAmendModal(true);
        if (null !== record) {
            userModalForm.setFieldsValue({
                formObj: {
                    userEmail: record.email,
                    userRole: record.type,
                    userPermission: record.permission
                }
            });
            setUserObj(record);
        }
    };

    const closeUserAmendModal = () => {
        setUserAmendModal(false);
        userModalForm.resetFields();
        setUserObj({key: 0, email: ''});
    }

    const userAmendModalService = (formValues: any) => {
        let userAmendObj = formValues.formObj;
        if (userObj && userObj.key > 0) {
            editObjectById({
                id: userObj.key,
                email: userObj.email,
                type: userAmendObj.userRole,
                permission: userAmendObj.userPermission
            }, 'users').then(async editUserAsync => {
                let editUserRes = await editUserAsync.json();
                if (editUserRes) {
                    message.success(`User ${formValues.userEmail} has been successfully edited`, 0.7);
                }
            });
        } else {
            addNewObject({
                id: userId,
                email: userAmendObj.userEmail,
                type: userAmendObj.userRole,
                permission: userAmendObj.userPermission
            }, 'users').then(async newUserAsync => {
                let newUserRes = await newUserAsync.json();
                if (newUserRes) {
                    message.success(`User ${formValues.userEmail} has been successfully created`, 0.6);
                    setUserId(userId + 1);
                }
            });
        }
        populateAllUsers();
        closeUserAmendModal();
    };

    const deleteBulkUsersService = () => {
        message.error("Bulk Delete not supported", 0.7).then(() => {
        });
    }

    const userRowSelections = {
        onChange: (selectedRowKeys: React.Key[], selectedRows: UsersInterface[]) => {
            let rowsSelected: string[] = [];
            selectedRows.forEach(usersItr => {
                rowsSelected.push(usersItr.key);
            });
            setSelectedUserIds(rowsSelected);
        }
    };

    const getColor = (record: any) => {
        switch (record.type) {
            case 'Admin':
                return 'red';
            case 'Auditor':
                return 'blue';
            case 'Standard':
                return 'green';
            case 'Viewer':
                return 'purple';
        }
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
                    <Tag key={record.key} color={getColor(record)}>{text}</Tag>
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
                    <p className={"actionColumn noMarginIcon"} onClick={() => createEditUser(record)}>
                        <EditOutlined/></p>
                    <Popconfirm overlayClassName="ant-popover-audience" placement="left"
                                title={<p><Title level={5}>Are you sure you want to delete?</Title>
                                    This will permanently delete these records and all associated data from your
                                    account. Deleting and re-adding records can alter your monthly contact limits. <a>Learn
                                        More</a></p>}
                                okText="Delete" cancelText="Cancel"
                                onConfirm={() => deleteSelectedUser(record)}>
                        <p className={"actionColumn noMarginIcon"}><DeleteOutlined/></p>
                    </Popconfirm>
                </Space>
            }),
        }
    ];

    const [usersDS, setUsersDS] = useState<UsersInterface[]>([]);

    useEffect(() => {
        populateAllUsers();
        getAllServerCall('utils').then(async allUserRolesAsync => {
            let allUserRolesRes = await allUserRolesAsync.json();
            let data: DropDown[] = [];
            if (allUserRolesRes && allUserRolesRes.userRoles) {
                allUserRolesRes.userRoles.forEach((itr: any) => {
                    data.push({...itr});
                });
            }
            setUserRoles(data);
        });
    }, []);

    const populateAllUsers = () => {
        getAllServerCall('users').then(async allUsersAsync => {
            let allUsersRes = await allUsersAsync.json();
            let data: UsersInterface[] = [];
            if (allUsersRes) {
                allUsersRes.forEach((itr: any) => {
                    data.push({...itr, key: itr.id});
                });
            }
            setUsersDS(data);
        });
    }

    return <div className="domain pageLayout">
        <div className="reverseFlex">
            <Button className={'addBtn'} type={'primary'} onClick={() => createEditUser(null)} icon={<PlusOutlined/>}>Add
                New</Button>
            {selectedUserIds.length > 0 ? <Button style={{marginRight: 8}} className={'delBtn'} type={'primary'} danger
                                                  onClick={deleteBulkUsersService}
                                                  icon={<DeleteOutlined/>}>Delete</Button> : null}
        </div>
        <Modal title="Add/Edit User" centered visible={userAmendModal} width={'30%'} footer={null}
               onCancel={closeUserAmendModal}>
            <Form form={userModalForm} layout={'vertical'} onFinish={userAmendModalService}>
                <Form.Item label="User Email">
                    <Form.Item name={['formObj', 'userEmail']}
                               noStyle rules={[{required: true, message: 'User Email Address required'}]}>
                        <Input disabled={userObj.key > 0} placeholder="Text only" type={"email"}/>
                    </Form.Item>
                </Form.Item>
                <Form.Item label="User Role">
                    <Form.Item name={['formObj', 'userRole']} noStyle
                               rules={[{required: true, message: 'User Role required'}]}>
                        <Select style={{width: '50%'}} allowClear placeholder="Select User Role">
                            {userRoles.map(value => {
                                return <Option key={value.value} value={value.label}>{value.label}</Option>
                            })}
                        </Select>
                    </Form.Item>
                </Form.Item>
                <Form.Item label="Permissions">
                    <Form.Item name={['formObj', 'userPermission']} noStyle
                               rules={[{required: true, message: 'Permission required'}]}>
                        <Radio.Group>
                            <Radio value={'manageContacts'}>Manage Contacts</Radio>
                            <Radio value={'manageCampaigns'}>Manage Campaigns</Radio>
                            <Radio value={'manageUsers'}>Manage Users</Radio>
                            <Radio value={'moreOptions'}>More Options...</Radio>
                        </Radio.Group>
                    </Form.Item>
                </Form.Item>
                <div className='reverseFlex'>
                    <Form.Item>
                        <Button key="cancel" htmlType={'reset'} onClick={closeUserAmendModal}
                                icon={<CloseOutlined/>}>
                            Cancel
                        </Button>
                    </Form.Item>
                    <Form.Item>
                        <Button style={{marginRight: 8}} key="quickAdd" htmlType={'submit'} type="primary"
                                icon={<CheckOutlined/>}>
                            Done
                        </Button>
                    </Form.Item>
                </div>
            </Form>
        </Modal>
        <div className="thirdNav" style={{height: 'calc(100vh - 238px)'}}>
            <Table rowSelection={{...userRowSelections}} scroll={{y: 'calc(100vh - 332px)'}} dataSource={usersDS}
                   columns={columns} bordered/>
        </div>
    </div>
}