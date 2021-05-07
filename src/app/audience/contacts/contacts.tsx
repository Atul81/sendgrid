import React, {useEffect, useState} from "react";
import {Button, Dropdown, Form, Input, Menu, message, Modal, Popconfirm, Result, Space, Table, Typography} from "antd";
import {
    CheckOutlined,
    CloseOutlined,
    DeleteOutlined,
    DownloadOutlined,
    EditOutlined,
    ExportOutlined,
    HistoryOutlined,
    PlusOutlined
} from '@ant-design/icons';
import Tag from "antd/es/tag";
import {ContactEditPage} from "./edit/ContactEditLoadable";
import {updateBreadcrumb} from "../../../store/actions/root";
import {useDispatch} from "react-redux";
import {UploadPage} from "../../common/upload/UploadLoadable";
import {ContactsInterface, QuickAddContactInterface} from "../audienceInterface";
import {addNewObject, deleteObjectById, getAllServerCall, getObjectById} from "../../../service/serverCalls/mockServerRest";
import './contacts.scss';

export const ContactsPage: any = () => {

    useEffect(() => {
        populateAllContacts();
    }, []);

    const {Search} = Input;
    const {Title} = Typography;
    const [addContact] = Form.useForm();
    const dispatch = useDispatch();

    const [exportReqModal, setExportModalReq] = useState(false);
    const [emailIdSelected, setEmailIdSelected] = useState<string[]>([]);
    const [contactDS, setContactDS] = useState<ContactsInterface[]>([]);
    const [contactDSOps, setContactDSOps] = useState<ContactsInterface[]>([]);
    const [contactId, setContactId] = useState<number>(13);
    const [quickAddContactDS, setQuickAddContactDS] = useState<QuickAddContactInterface[]>([]);
    const [tableLabel, setTableLabel] = useState<string>('All Contacts');
    const [editPage, setEditPage] = useState(false);
    const [contactObj, setContactObj] = useState({});
    const [uploadModal, setUploadModal] = useState(false);
    const [uploadFileInfo, setUploadFileInfo] = useState({
        file: {},
        fileList: [{}]
    });
    const [showDelBtn, setShowDelBtn] = useState(false);
    const [quickAddModal, setQuickAddModal] = useState(false);
    const [serviceInProgress, setServiceInProgress] = useState(false);

    const populateAllContacts = () => {
        getAllServerCall('contacts').then(async response => {
            let resBody = await response.json();
            let data: ContactsInterface[] = [];
            if (resBody && Array.isArray(resBody)) {
                resBody.forEach((itr: any) => {
                    data.push({...itr, key: itr.id});
                });
            }
            setContactDS(data);
            setContactDSOps(data);
        });
    };

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
            title: 'Email Marketing',
            dataIndex: 'emailMarketing',
            key: 'emailMarketing',
            render: ((text: string, record: any) => {
                return (
                    <Tag color={'geekblue'} key={record.emailMarketing}>
                        {text}
                    </Tag>
                );
            })
        },
        {
            title: 'Tags',
            dataIndex: 'tags',
            key: 'tags',
        },
        {
            title: 'Action',
            dataIndex: '',
            key: 'action',
            width: '75px',
            render: ((text: string, record: any) => {
                return <Space size="small">
                    <p className={"actionColumn"} onClick={() => openContactEdit(record)}><EditOutlined/></p>
                    <Popconfirm overlayClassName="ant-popover-audience" placement="left"
                                title={<p><Title level={5}>Are you sure you want to delete?</Title>
                                    This will permanently delete these records and all associated data from your
                                    account. Deleting and re-adding records can alter your monthly contact limits. <a>Learn
                                        More</a></p>}
                                okText="Delete" cancelText="Cancel"
                                onConfirm={() => deleteContact(record)}>
                        <p className={"actionColumn"}><DeleteOutlined/></p>
                    </Popconfirm>
                </Space>
            }),
        },
    ];

    const quickAddColumns = [
        {
            title: 'Email Address',
            dataIndex: 'email',
            key: 'email',
            ellipsis: true
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
            ellipsis: true
        },
        {
            title: 'Action',
            dataIndex: '',
            key: 'action',
            width: '75px',
            render: ((text: string, record: any) => {
                return <Space size="small">
                    <p className={"actionColumn noMarginIcon"} onClick={() => deleteQuickContact(record)}>
                        <DeleteOutlined/></p>
                </Space>
            }),
        }
    ];

    const deleteQuickContact = (record: any) => {
        let tempObj = quickAddContactDS.filter(value => record.key !== value.key);
        setQuickAddContactDS(tempObj);
    }

    const onSearch = (searchParam: string) => {
        setContactDS(contactDSOps.filter(value => {
            return value.email.includes(searchParam);
        }));
    };

    const contactRowSelection = {
        onChange: (selectedRowKeys: React.Key[], selectedRows: ContactsInterface[]) => {
            let rowsSelected: string[] = [];
            selectedRows.forEach(contactsData => {
                rowsSelected.push(contactsData.email);
            });
            setEmailIdSelected(rowsSelected);
            if (rowsSelected.length > 0) {
                setShowDelBtn(true);
            } else {
                setShowDelBtn(false);
            }
        }
    };

    const openContactEdit = (record: any) => {
        getObjectById(record.key, 'contacts').then(async response => {
            let resBody = await response.json();
            if (resBody) {
                setContactObj({...resBody});
                setEditPage(true);
            }
        });
    };
    const deleteContact = (record: any) => {
        deleteObjectById(record.id, 'contacts').then(async response => {
            let resBody = await response.json();
            if (resBody) {
                populateAllContacts();
                message.success(`Contact with email ${record.email} has been successfully deleted`);
            }
        });
    };

    const exportCsv = () => {
        setExportModalReq(true);
    };

    const handleAddContactMenuClick = (e: any) => {
        if (e.key === 'addManually') {
            setEditPage(true);
            setContactObj({id: contactId});
        } else if (e.key === 'quickAdd') {
            setQuickAddModal(true);
        } else {
            setUploadModal(true);
        }
    };

    const cancelQuickAdd = () => {
        setQuickAddModal(false);
        addContact.resetFields();
        setQuickAddContactDS([]);
    }

    const addContactMenu = (
        <Menu onClick={handleAddContactMenuClick}>
            <Menu.Item key="quickAdd">Quick Add</Menu.Item>
            <Menu.Item key="addManually">Add Manually</Menu.Item>
            <Menu.Item key="uploadCSV">Upload .CSV</Menu.Item>
        </Menu>
    );

    const navigateToLandingPage = () => {
        dispatch(updateBreadcrumb(['Audience', 'Contacts']));
        populateAllContacts();
        setContactObj({});
        setEditPage(false);
        setContactId(contactId + 1);
    };

    const deleteAllContact = () => {
        if (emailIdSelected.length === 0) {
            message.warning("Please use the checkbox to select contact for deletion", 0.8).then(() => {
            });
        }
        message.error("Bulk delete not yet supported in mock server", 0.7).then(() => {
        });
    };

    const cancelUploadProcess = () => {
        setUploadModal(false);
        setUploadFileInfo({file: {}, fileList: [{}]});
    }
    const processUploadedFile = () => {
        console.log(uploadFileInfo.fileList);
    };

    const handleTablePaginationChange = (pagination: any) => {
    };

    const quickAddContactFormFinish = (values: any) => {
        let tempData = [...quickAddContactDS];
        let filteredItem = tempData.filter(itr => itr.email.toLowerCase() === values.formObj.email.toLowerCase());
        if (filteredItem.length > 0) {
            message.warn('Email Address already in use', 0.6).then(() => {
            });
        } else {
            tempData.push({...values.formObj, key: Math.random()});
            setQuickAddContactDS(tempData);
            addContact.resetFields();
        }
    };

    const quickAddContactService = () => {
        if (quickAddContactDS.length > 0) {
            setServiceInProgress(true);
            let itrId = contactId;
            quickAddContactDS.forEach(itr => {
                itrId++;
                addNewObject({...itr, id: itrId}, 'contacts').then(async response => {
                    let resBody = await response.json();
                    if (resBody) {
                        message.success(`New Contact ${itr.email} successfully created`, 0.6);
                    }
                }).catch(reason => {
                    console.log(reason);
                });
            });
            setContactId(itrId++);
        }
        setServiceInProgress(false);
        populateAllContacts();
        cancelQuickAdd();
    };

    return !editPage ? (
        <div className="pageLayout">
            <div className="firstNav">
                <div className="leftPlacement">
                    <div className="searchInput">
                        <Search placeholder="input search text" onSearch={onSearch} enterButton/>
                    </div>
                </div>
                <div className="rightPlacement">
                    {showDelBtn ?
                        <Popconfirm overlayClassName="ant-popover-audience" placement="left"
                                    title={<p><Title level={5}>Are you sure you want to delete?</Title>
                                        This will permanently delete these records and all associated data
                                        from your account. Deleting and re-adding records can alter your
                                        monthly contact limits.
                                        <a href={"https://www.google.com"} target={'_blank'}
                                           rel={'noreferrer'}> Learn More</a></p>}
                                    okText="Delete" cancelText="Cancel"
                                    onConfirm={deleteAllContact}>
                            <Button className="deleteBtn" icon={<DeleteOutlined/>} type="primary" danger>Delete</Button>
                        </Popconfirm> : null}
                    <Button className="exportBtn" onClick={exportCsv} icon={<ExportOutlined/>}>Export CSV</Button>
                    <Dropdown.Button type={'primary'} overlay={addContactMenu}>Add Contact</Dropdown.Button>
                </div>
                <Modal title="Upload Contacts" centered visible={uploadModal} width={'65%'} footer={[
                    <Button key="cancel" onClick={cancelUploadProcess} icon={<CloseOutlined/>}>
                        Cancel
                    </Button>,
                    <Button key="upload" type="primary" icon={<DownloadOutlined/>} onClick={processUploadedFile}>
                        Upload
                    </Button>
                ]} onCancel={cancelUploadProcess}>
                    <UploadPage fileInfo={(fileInfo: any) => setUploadFileInfo(fileInfo)}/>
                </Modal>
                <Modal title="Add Contact" centered visible={quickAddModal} width={550} className={'contacts'}
                       footer={quickAddContactDS.length > 0 ?
                           <Button disabled={serviceInProgress} key="done" style={{background: 'darkgreen'}}
                                   type="primary" icon={<CheckOutlined/>}
                                   onClick={quickAddContactService}>
                               Done
                           </Button> : null}
                       onCancel={cancelQuickAdd}>
                    <div className='columnFlex'>
                        <Form form={addContact} layout={'vertical'} onFinish={quickAddContactFormFinish}>
                            <Form.Item label="Email Address">
                                <Form.Item name={['formObj', 'email']}
                                           noStyle rules={[{required: true, message: 'Email Address required'}]}>
                                    <Input placeholder="email+test@gmail.com" type={"email"}/>
                                </Form.Item>
                            </Form.Item>
                            <div className='flexEqualSpacing flexFormItems'>
                                <Form.Item label="First Name">
                                    <Form.Item name={['formObj', 'firstName']} noStyle>
                                        <Input placeholder="Text Only" type={'text'}/>
                                    </Form.Item>
                                </Form.Item>
                                <Form.Item label="Last Name">
                                    <Form.Item name={['formObj', 'lastName']} noStyle>
                                        <Input placeholder="Text Only" type={'text'}/>
                                    </Form.Item>
                                </Form.Item>
                            </div>
                            <div className='reverseFlex'>
                                <Form.Item>
                                    <Button key="cancel" htmlType={'reset'} onClick={cancelQuickAdd}
                                            icon={<CloseOutlined/>}>
                                        Cancel
                                    </Button>
                                </Form.Item>
                                <Form.Item>
                                    <Button style={{marginRight: 8}} key="quickAdd" htmlType={'submit'} type="primary"
                                            icon={<PlusOutlined/>}>
                                        Add
                                    </Button>
                                </Form.Item>
                            </div>
                        </Form>
                    </div>
                    {quickAddContactDS.length > 0 ?
                        <Table dataSource={quickAddContactDS} columns={quickAddColumns} bordered/> : null}
                </Modal>
                <Modal centered visible={exportReqModal} width={'50%'} footer={null} closable={false}>
                    <Result icon={<HistoryOutlined/>}
                            title="Your export is being processed"
                            subTitle={
                                <span>You can view exported contacts in the <strong>{'"Audience > Contacts"'}</strong> section after receiving a confirmation email</span>}
                            extra={<Button type="primary" key="done" onClick={() => setExportModalReq(false)}>
                                Done
                            </Button>
                            }
                    />
                </Modal>
            </div>
            <div className="secondNav">
                <Title level={4}>{tableLabel}</Title>
            </div>
            <div className="thirdNav">
                <Table scroll={{y: 'calc(100vh - 400px)'}} onChange={handleTablePaginationChange}
                       rowSelection={{...contactRowSelection}} dataSource={contactDS} columns={columns} bordered/>
            </div>
        </div>
    ) : <ContactEditPage contactObj={contactObj} routeToOverview={navigateToLandingPage}/>
}