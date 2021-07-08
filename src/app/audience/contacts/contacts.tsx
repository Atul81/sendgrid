import React, {useEffect, useState} from "react";
import {
    Button,
    Divider,
    Dropdown,
    Form,
    Input,
    Menu,
    message,
    Modal,
    Popconfirm,
    Result,
    Select,
    Space,
    Table,
    Typography
} from "antd";
import {
    CheckOutlined,
    CloseOutlined,
    DeleteOutlined,
    DownloadOutlined,
    DownOutlined,
    EditOutlined,
    ExportOutlined,
    HistoryOutlined,
    PlusOutlined
} from '@ant-design/icons';
import Tag from "antd/es/tag";
import {updateActiveContent, updateBreadcrumb} from "../../../store/actions/root";
import {useDispatch} from "react-redux";
import {UploadPage} from "../../common/upload/UploadLoadable";
import {ContactsInterface, QuickAddContactInterface} from "../audienceInterface";
import {
    addNewObject,
    deleteObjectById,
    editObjectById,
    getAllServerCall,
    getObjectById
} from "../../../service/serverCalls/mockServerRest";
import './contacts.scss';
import {DropDown} from "../../../utils/Interfaces";
import {ContactEditPage} from "./edit/ContactEditLoadable";
import {
    GET_SERVER_ERROR,
    POST_SERVER_ERROR,
    PUT_SERVER_ERROR,
    textOnlyValidation,
    validateEmail
} from "../../../utils/common";

export const ContactsPage: any = () => {

    const [allSegments, setAllSegments] = useState<DropDown[]>([]);
    const [allTags, setAllTags] = useState<DropDown[]>([]);
    const [multiSelectValue, setMultiSelectValue] = useState<string[]>([]);
    const {Option} = Select;
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(updateBreadcrumb(['Audience', 'Contacts']));
        dispatch(updateActiveContent('contacts'));
        populateAllContacts();
        getAllServerCall('segments').then(async response => {
            let resBody = await response.json();
            let data: DropDown[] = [];
            if (resBody && Array.isArray(resBody)) {
                resBody.forEach((itr: any) => {
                    data.push({
                        value: itr.id,
                        label: itr.name,
                        children: null
                    });
                });
            }
            setAllSegments(data);
        }).catch(reason => {
            console.log(reason);
            message.error('Unable to fetch segments data', 0.8).then(() => {
            });
        });
        getAllServerCall('utils').then(async response => {
            let resBody = await response.json();
            let data: DropDown[] = [];
            if (resBody && Array.isArray(resBody.tags)) {
                resBody.tags.forEach((itr: any) => {
                    data.push(itr);
                });
            }
            setAllTags(data);
        }).catch(reason => {
            console.log(reason);
            message.error('Unable to fetch tags data', 0.8).then(() => {
            });
        });
    }, [dispatch]);

    const {Search} = Input;
    const {Title} = Typography;
    const [addContact] = Form.useForm();

    const [exportReqModal, setExportModalReq] = useState(false);
    const [idsSelected, setIdsSelected] = useState<string[]>([]);
    const [contactDS, setContactDS] = useState<ContactsInterface[]>([]);
    const [contactDSOps, setContactDSOps] = useState<ContactsInterface[]>([]);
    const [contactId, setContactId] = useState<number>(110);
    const [quickAddContactDS, setQuickAddContactDS] = useState<QuickAddContactInterface[]>([]);
    const tableLabel = 'All Contacts';
    const [editPage, setEditPage] = useState(false);
    const [contactObj, setContactObj] = useState({});
    const [uploadModal, setUploadModal] = useState(false);
    const [uploadFileInfo, setUploadFileInfo] = useState({
        file: {},
        fileList: [{}]
    });
    const [showBtnOnSelection, setShowBtnOnSelection] = useState(false);
    const [quickAddModal, setQuickAddModal] = useState(false);
    const [serviceInProgress, setServiceInProgress] = useState(false);
    const [openAdditionalModal, setAdditionalModal] = useState(false);
    const [additionalModalInfo, setAdditionalModalInfo] = useState('');
    const [newTagName, setNewTagName] = useState<string>('');
    const [tagId, setTagId] = useState<string>("5");

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
        }).catch(reason => {
            console.log(reason);
            message.error(GET_SERVER_ERROR, 0.8).then(() => {
            });
        });
    };

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
            title: 'Email Marketing',
            dataIndex: 'emailMarketing',
            key: 'emailMarketing',
            render: ((text: string, record: any) => {
                return (
                    <Tag
                        color={record.emailMarketing ? (record.emailMarketing.toLowerCase() === 'Subscribed'.toLowerCase() ? 'green' : 'purple') : ''}
                        key={record.key}>{text}</Tag>
                );
            }),
            sorter: (a: any, b: any) => a.emailMarketing.length - b.emailMarketing.length
        },
        {
            title: 'Tags',
            dataIndex: 'tags',
            key: 'tags',
            width: '15%',
            ellipsis: true,
            sorter: (a: any, b: any) => a.tags.length - b.tags.length
        },
        {
            dataIndex: '',
            key: 'action',
            width: '75px',
            render: ((text: string, record: any) => {
                return <Space size="small">
                    <p className={"actionColumn edit"} onClick={() => openContactEdit(record)}><EditOutlined/></p>
                    <Popconfirm overlayClassName="ant-popover-audience" placement="left"
                                title={<p><Title level={5}>Are you sure you want to delete?</Title>
                                    This will permanently delete these records and all associated data from your
                                    account. Deleting and re-adding records can alter your monthly contact limits.
                                    <a href={'https://programmablesearchengine.google.com/about/'} target={'_blank'}
                                       rel={'noreferrer'}>Learn More</a></p>}
                                okText="Delete" cancelText="Cancel"
                                onConfirm={() => deleteContact(record)}>
                        <p className={"actionColumn del"}><DeleteOutlined/></p>
                    </Popconfirm>
                </Space>
            })
        }
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
                    <p className={"actionColumn noMarginIcon del"} onClick={() => deleteQuickContact(record)}>
                        <DeleteOutlined/></p>
                </Space>
            }),
        }
    ];

    const deleteQuickContact = (record: any) => {
        let tempObj = quickAddContactDS.filter(value => record.key !== value.key);
        setQuickAddContactDS(tempObj);
    };

    const onSearch = (searchParam: string) => {
        setContactDS(contactDSOps.filter(value => {
            return value.email.includes(searchParam);
        }));
    };

    const contactRowSelection = {
        onChange: (selectedRowKeys: React.Key[], selectedRows: ContactsInterface[]) => {
            let rowsSelected: string[] = [];
            selectedRows.forEach(contactsData => {
                rowsSelected.push(contactsData.key);
            });
            setIdsSelected(rowsSelected);
            if (rowsSelected.length > 0) {
                setShowBtnOnSelection(true);
            } else {
                setShowBtnOnSelection(false);
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
        }).catch(reason => {
            console.log(reason);
            message.error(GET_SERVER_ERROR, 0.8).then(() => {
            });
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
        setIdsSelected([]);
        setShowBtnOnSelection(false);
    };

    const deleteAllContact = () => {
        if (idsSelected.length === 0) {
            message.warning("Please use the checkbox to select contact for deletion", 0.8).then(() => {
            });
        }
        message.error("Bulk delete not yet supported in mock server", 0.7).then(() => {
        });
    };

    const cancelUploadProcess = () => {
        setUploadModal(false);
        setUploadFileInfo({file: {}, fileList: [{}]});
    };

    const processUploadedFile = () => {
        console.log(uploadFileInfo.fileList);
    };

    const quickAddContactFormFinish = (values: any) => {
        let tempData = [...quickAddContactDS];
        tempData.push({...values.formObj, key: Math.random()});
        setQuickAddContactDS(tempData);
        addContact.resetFields();
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
                        message.success(`New Contact ${itr.email} successfully created`, 0.8);
                        setServiceInProgress(false);
                        populateAllContacts();
                        cancelQuickAdd();
                    }
                }).catch(reason => {
                    console.log(reason);
                    setServiceInProgress(false);
                    message.error(POST_SERVER_ERROR, 0.8).then(() => {
                    });
                });
            });
            setContactId(itrId++);
        }
    };

    const openAdditionInfoModal = (infoType: string) => {
        setAdditionalModal(true);
        setAdditionalModalInfo(infoType);
    };

    const closeAdditionalInfo = () => {
        setAdditionalModal(false);
        setAdditionalModalInfo('');
        setMultiSelectValue([]);
    };

    const onMultiSelectChange = (value: string[]) => {
        setMultiSelectValue(value);
    };

    const processAdditionalInfo = () => {
        let additionalInfoString = '';
        multiSelectValue.forEach(info => {
            additionalInfoString = additionalInfoString.concat(info).concat(', ');
        });
        if (additionalInfoString.length > 0) {
            additionalInfoString = additionalInfoString.substr(0, additionalInfoString.length - 2);
            idsSelected.forEach(itr => {
                getObjectById(itr, 'contacts').then(async contactByIdAsync => {
                    let contactByIdRes = await contactByIdAsync.json();
                    if (contactByIdRes) {
                        let editObject: {};
                        let editType: string;
                        if (additionalModalInfo === 'addTags') {
                            let existingTags = contactByIdRes.tags.split(', ');
                            existingTags.forEach((itr: string) => {
                                if (!(additionalInfoString.includes(itr))) {
                                    additionalInfoString = additionalInfoString.concat(`, ${itr}`);
                                }
                            });
                            editObject = {
                                ...contactByIdRes,
                                tags: additionalInfoString
                            };
                            editType = 'Tags';
                        } else {
                            editObject = {
                                ...contactByIdRes,
                                segment: additionalInfoString
                            };
                            editType = 'Segments';
                        }
                        editObjectById(editObject, 'contacts').then(async editContactAsync => {
                            let editContactRes = await editContactAsync.json();
                            if (editContactRes) {
                                message.success(`${editType} has been added for ${contactByIdRes.email}`);
                                populateAllContacts();
                            }
                        }).catch(reason => {
                            console.log(reason);
                            message.error(PUT_SERVER_ERROR, 0.8).then(() => {
                            });
                        });
                    }
                }).catch(reason => {
                    console.log(reason);
                    message.error(GET_SERVER_ERROR, 0.8).then(() => {
                    });
                });
            });
            closeAdditionalInfo();
        } else {
            message.error('Select at least one option from Dropdown', 0.7).then(() => {
            });
        }
    };

    const onNameChange = (event: any) => {
        setNewTagName(event.target.value);
    };

    const addItem = () => {
        if (newTagName && newTagName.length > 1) {
            let tempTags = [...allTags];
            let newTagObj = {
                value: tagId,
                label: newTagName,
                children: null
            };
            tempTags.push(newTagObj);
            setTagId(String(Number(tagId) + 1));
            setAllTags(tempTags);
            message.success('New Tag has been cached, Server Call needs backend', 0.6).then(() => {
            });
            let tempSelected = [...multiSelectValue];
            tempSelected.push(newTagName);
            setMultiSelectValue(tempSelected);
            setNewTagName('');
        } else {
            message.error('Please provide a tag name', 0.6).then(() => {
            });
        }
    };

    return !editPage ? (
        <div className="pageLayout">
            <div className="secondNav">
                <Title level={4}>{tableLabel}</Title>
            </div>
            <div className="firstNav">
                <div className="leftPlacement">
                    <div className="searchInput">
                        <Search placeholder="input search text" onSearch={onSearch} enterButton/>
                    </div>
                </div>
                <div className="rightPlacement">
                    {showBtnOnSelection ?
                        <>
                            <Button key="addTags" style={{marginRight: 8, width: 88}} type={'dashed'}
                                    onClick={() => openAdditionInfoModal('addTags')}
                                    icon={<PlusOutlined/>}>Add Tags</Button>
                            <Button key="addSegments" style={{marginRight: 8, width: 136}} type={'dashed'}
                                    onClick={() => openAdditionInfoModal('addSegments')}
                                    icon={<PlusOutlined/>}>Add To Segments</Button>
                            <Popconfirm overlayClassName="ant-popover-audience" placement="left"
                                        title={<p><Title level={5}>Are you sure you want to delete?</Title>
                                            This will permanently delete these records and all associated data
                                            from your account. Deleting and re-adding records can alter your
                                            monthly contact limits.
                                            <a href={"https://www.google.com"} target={'_blank'}
                                               rel={'noreferrer'}> Learn More</a></p>}
                                        okText="Delete" cancelText="Cancel"
                                        onConfirm={deleteAllContact}>
                                <Button className="deleteBtn" icon={<DeleteOutlined/>} type="primary"
                                        danger>Delete</Button>
                            </Popconfirm>
                        </> : null}
                    <Button className="exportBtn" onClick={exportCsv} icon={<ExportOutlined/>}>Export CSV</Button>
                    <Dropdown overlay={addContactMenu}>
                        <Button type={'primary'} style={{width: 104}}>Add Contact<DownOutlined/>
                        </Button>
                    </Dropdown>
                </div>
                <Modal title="Upload Contacts" centered visible={uploadModal} width={'65%'} footer={[
                    <Button key="cancel" onClick={cancelUploadProcess} icon={<CloseOutlined/>}>
                        Cancel
                    </Button>,
                    <Button key="upload" type="primary" icon={<DownloadOutlined/>} onClick={processUploadedFile}>
                        Upload
                    </Button>
                ]} onCancel={cancelUploadProcess}><UploadPage
                    fileInfo={(fileInfo: any) => setUploadFileInfo(fileInfo)}/>
                </Modal>
                <Modal title={additionalModalInfo === 'addTags' ? 'Add Tags' : 'Add Segments'} centered
                       destroyOnClose={true}
                       visible={openAdditionalModal} width={548} footer={[
                    <Button key="cancel" onClick={closeAdditionalInfo} icon={<CloseOutlined/>}>
                        Cancel
                    </Button>,
                    <Button key="upload" type="primary" icon={<PlusOutlined/>} onClick={processAdditionalInfo}>
                        Add
                    </Button>
                ]} onCancel={closeAdditionalInfo}>
                    {additionalModalInfo === 'addTags' ?
                        <>
                            <Select onChange={onMultiSelectChange} value={multiSelectValue} mode={'multiple'}
                                    style={{width: 496}}
                                    dropdownRender={menu => (
                                        <div>
                                            {menu}
                                            <Divider style={{margin: '4px 0'}}/>
                                            <div style={{display: 'flex', flexWrap: 'nowrap', padding: 8}}>
                                                <Input style={{flex: 'auto'}} value={newTagName}
                                                       onChange={onNameChange}/>
                                                <a style={{
                                                    flex: 'none',
                                                    padding: '8px',
                                                    display: 'block',
                                                    cursor: 'pointer'
                                                }}
                                                   onClick={addItem}>
                                                    <PlusOutlined/> Add New Tag
                                                </a>
                                            </div>
                                        </div>
                                    )} placeholder="Select Tags">
                                {
                                    allTags.map(itr => {
                                        return <Option value={itr.label} key={itr.value}>{itr.label}</Option>
                                    })}
                            </Select>
                        </> :
                        <>
                            <Select onChange={onMultiSelectChange} mode={'multiple'} style={{width: 496}}
                                    placeholder="Select Segments">
                                {
                                    allSegments.map(itr => {
                                        return <Option value={itr.label} key={itr.value}>{itr.label}</Option>
                                    })}
                            </Select>
                        </>}
                </Modal>
                <Modal title="Add Contact" centered visible={quickAddModal} width={750} className={'contacts'}
                       footer={quickAddContactDS.length > 0 ?
                           <Button disabled={serviceInProgress} key="done" style={{background: 'darkgreen'}}
                                   type="primary" icon={<CheckOutlined/>} loading={serviceInProgress}
                                   onClick={quickAddContactService}>
                               Done
                           </Button> : null}
                       onCancel={cancelQuickAdd}>
                    <div className='columnFlex'>
                        <Form form={addContact} layout={'vertical'} onFinish={quickAddContactFormFinish}>
                            <Form.Item label={<strong>Email Address</strong>}>
                                <Form.Item name={['formObj', 'email']}
                                           noStyle rules={[{
                                    required: true,
                                    message: 'Email Address required'
                                }, () => ({
                                    validator(_, value) {
                                        if (value) {
                                            if (validateEmail(value)) {
                                                if (quickAddContactDS.length > 0) {
                                                    let tempData = [...quickAddContactDS];
                                                    let sameEmail: boolean = false;
                                                    for (let i = 0; i < quickAddContactDS.length; i++) {
                                                        sameEmail = tempData[i].email === value;
                                                    }
                                                    if (sameEmail) {
                                                        return Promise.reject(new Error('Email Address already in use!'));
                                                    } else {
                                                        return Promise.resolve();
                                                    }
                                                } else {
                                                    return Promise.resolve();
                                                }
                                            } else {
                                                return Promise.reject(new Error('Email Address not valid!'));
                                            }
                                        }
                                    }
                                })]}>
                                    <Input placeholder="email+test@gmail.com" type={"email"}/>
                                </Form.Item>
                            </Form.Item>
                            <div className='flexEqualSpacing flexFormItems'>
                                <Form.Item label={<strong>First Name</strong>}>
                                    <Form.Item name={['formObj', 'firstName']} noStyle rules={[{
                                        required: true,
                                        message: 'First Name required'
                                    }, textOnlyValidation]}>
                                        <Input placeholder="Text Only" type={'text'}/>
                                    </Form.Item>
                                </Form.Item>
                                <Form.Item label={<strong>Last Name</strong>}>
                                    <Form.Item name={['formObj', 'lastName']} noStyle rules={[{
                                        required: true,
                                        message: 'Last Name required'
                                    }, textOnlyValidation]}>
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
            <div className="thirdNav">
                <Table scroll={{y: 'calc(100vh - 400px)'}}
                       rowSelection={{...contactRowSelection}} dataSource={contactDS} columns={columns} bordered/>
            </div>
        </div>
    ) : <ContactEditPage contactObj={contactObj} routeToOverview={navigateToLandingPage}/>
}
