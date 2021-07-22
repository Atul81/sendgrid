import React, {useEffect, useState} from "react";
import {Button, Checkbox, Form, Input, message, Modal, Popconfirm, Select, Space, Table, Tag} from "antd";
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
import Search from "antd/es/input/Search";
import Paragraph from "antd/lib/typography/Paragraph";
import {GET_SERVER_ERROR, POST_SERVER_ERROR, PUT_SERVER_ERROR, validateEmail} from "../../../utils/common";

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
    const [userRoles, setUserRoles] = useState<DropDown[]>([]);

    const userPermissionOptions = [
        {value: 'manageContacts', label: 'Manage Contacts'},
        {value: 'manageCampaigns', label: 'Manage Campaigns'},
        {value: 'manageUsers', label: 'Manage Users'},
        {value: 'manageTemplates', label: 'Manage Templates'},
        {value: 'manageUnsubscription', label: 'Manage Unsubscription'}
    ];

    const [currentUserRole, setCurrentUserRole] = useState('');
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
            setCurrentUserRole(record.type);
            setUserObj(record);
        }
    };

    const definedRoles = {
        standard: ["manageContacts"],
        admin: ["manageContacts", "manageCampaigns", "manageTemplates", "manageUnsubscription", "manageUsers"],
        auditor: ["manageContacts", "manageCampaigns", "manageTemplates",]

    }
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
                    message.success(`User ${userAmendObj.userEmail} has been successfully edited`, 0.7);
                }
            }).catch(reason => {
                console.log(reason);
                message.error(PUT_SERVER_ERROR, 0.8).then(() => {
                });
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
            }).catch(reason => {
                console.log(reason);
                message.error(POST_SERVER_ERROR, 0.8).then(() => {
                });
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
            case 'Custom':
                return 'yellow'
        }
    };

    const columns = [
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
            width: '70%',
            sorter: (a: any, b: any) => a.email.length - b.email.length
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
            sorter: (a: any, b: any) => a.type.length - b.type.length
        },
        {
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
                                    account. Deleting and re-adding records can alter your monthly contact limits. <a
                                        href={'https://www.google.com'} target={'_blank'} rel={'noreferrer'}>Learn
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
    const [usersDSOps, setUsersDSOps] = useState<UsersInterface[]>([]);

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
        }).catch(reason => {
            console.log(reason);
            message.error(GET_SERVER_ERROR, 0.8).then(() => {
            });
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
            setUsersDSOps(data);
        }).catch(reason => {
            console.log(reason);
            message.error(GET_SERVER_ERROR, 0.8).then(() => {
            });
        });
    };

    const onSearchUsers = (searchParam: string) => {
        setUsersDS(usersDSOps.filter(value => {
            return value.email.includes(searchParam);
        }));
    };

    const onRoleSelectChange = (roleSelected: string) => {
        setCurrentUserRole(roleSelected);
        switch (roleSelected) {
            case 'Admin': {
                userModalForm.setFieldsValue({
                    formObj: {
                        userEmail: userObj.email,
                        userPermission: [
                            "manageContacts",
                            "manageCampaigns",
                            "manageTemplates",
                            "manageUnsubscription",
                            "manageUsers"
                        ]
                    }
                });
                break;
            }
            case 'Standard': {
                userModalForm.setFieldsValue({
                    formObj: {
                        userEmail: userObj.email,
                        userPermission: [
                            "manageContacts"
                        ]
                    }
                });
                break;
            }
            case 'Auditor': {
                userModalForm.setFieldsValue({
                    formObj: {
                        userEmail: userObj.email,
                        userPermission: [
                            "manageContacts",
                            "manageCampaigns",
                            "manageTemplates",
                        ]
                    }
                });
                break;
            }
            default: {
                userModalForm.setFieldsValue({
                    formObj: {
                        userEmail: userObj.email,
                        userPermission: []
                    }
                });
            }
        }
    };

    const arrayEquals = (a: string[], b: string[]) => {
        return Array.isArray(a) && Array.isArray(b) && a.length === b.length && a.every(e => b.includes(e));
    }


    const onPermissionsChange = (selectedPermissions: any) => {
        if (selectedPermissions.length === 5) {
            userModalForm.setFieldsValue({
                formObj: {
                    userRole: 'Admin'
                }
            });
            setCurrentUserRole('Admin');
        } else if (currentUserRole === 'Standard') {
            if (!arrayEquals(selectedPermissions, definedRoles.standard)) {
                userModalForm.setFieldsValue({
                    formObj: {
                        userRole: 'Custom'
                    }
                });
            }
            setCurrentUserRole('Custom');
        } else if (currentUserRole === 'Auditor') {
            if (!arrayEquals(selectedPermissions, definedRoles.auditor)) {
                userModalForm.setFieldsValue({
                    formObj: {
                        userRole: 'Custom'
                    }
                });
            }
            setCurrentUserRole('Custom');
        } else {
            if (arrayEquals(selectedPermissions, definedRoles.standard)) {
                userModalForm.setFieldsValue({
                    formObj: {
                        userRole: 'Standard'
                    }
                });
                setCurrentUserRole('Standard');
            } else if (arrayEquals(selectedPermissions, definedRoles.auditor)) {
                userModalForm.setFieldsValue({
                    formObj: {
                        userRole: 'Auditor'
                    }
                });
                setCurrentUserRole('Auditor');
            }
        }
    }
    return (
        <div className="domain pageLayout">
            <div className="secondNav">
                <Title level={4}>All Imports</Title>
            </div>
            <div className="firstNav">
                <div className="leftPlacement">
                    <div className="searchInput">
                        <Search placeholder="input search text" onSearch={onSearchUsers} enterButton/>
                    </div>
                </div>
                <div className="rightPlacement">
                    {selectedUserIds.length > 0 ?
                        <Button style={{marginRight: 8}} className={'deleteBtn'} type={'primary'} danger
                                onClick={deleteBulkUsersService}
                                icon={<DeleteOutlined/>}>Delete</Button> : null}

                    <Button className={'addBtn'} type={'primary'} style={{width: 100}}
                            onClick={() => createEditUser(null)}
                            icon={<PlusOutlined/>}>Add New</Button>
                </div>
            </div>

            <Modal title="Add/Edit User" centered visible={userAmendModal} width={'30%'} footer={null}
                   onCancel={closeUserAmendModal}>
                <Form form={userModalForm} layout={'vertical'} onFinish={userAmendModalService}>
                    <Form.Item label="User Email">
                        <Form.Item name={['formObj', 'userEmail']}
                                   noStyle rules={[() => ({
                            validator(_, value) {
                                if (value) {
                                    if (validateEmail(value)) {
                                        return Promise.resolve();
                                    } else {
                                        return Promise.reject(new Error('Email Address not valid!'));
                                    }
                                } else {
                                    return Promise.reject(new Error('Email Address required'));
                                }
                            }
                        })]}>
                            <Input disabled={userObj.key > 0} placeholder="Text only" type={"email"}/>
                        </Form.Item>
                    </Form.Item>
                    <Form.Item label="User Role">
                        <Form.Item name={['formObj', 'userRole']} noStyle
                                   rules={[{required: true, message: 'User Role required'}]}>
                            <Select style={{width: '50%'}} allowClear placeholder="Select User Role"
                                    onChange={onRoleSelectChange}>
                                {userRoles.map(value => {
                                    return <Option key={value.value} value={value.label}>{value.label}</Option>
                                })}
                            </Select>
                        </Form.Item>
                    </Form.Item>
                    {currentUserRole !== 'Viewer' ?
                        <Form.Item label="Permissions">
                            <Form.Item name={['formObj', 'userPermission']} noStyle
                                       rules={[{required: true, message: 'Permission required'}]}>
                                <Checkbox.Group disabled={currentUserRole === 'Admin'} onChange={onPermissionsChange}
                                                options={userPermissionOptions}/>
                            </Form.Item>
                        </Form.Item> : <Paragraph style={{color: "red"}}>No permission access
                            with <strong>Viewer</strong> role</Paragraph>}
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
            <div className="thirdNav">
                <Table rowSelection={{...userRowSelections}} dataSource={usersDS} columns={columns} bordered/>
            </div>
        </div>
    )
}
