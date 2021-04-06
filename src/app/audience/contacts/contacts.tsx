import React, {useState} from "react";
import "./contacts.scss";
import {Button, Cascader, Dropdown, Input, Menu, message, Modal, Popconfirm, Space, Table, Typography} from "antd";
import {DropDown} from "../../../utils/Interfaces";
import {CloseOutlined, DeleteOutlined, DownloadOutlined, EditOutlined, ExportOutlined} from '@ant-design/icons';
import Tag from "antd/es/tag";
import {exportCSVFile} from "../../../utils/common";
import {ContactEditPage} from "./edit/ContactEditLoadable";
import {updateBreadcrumb} from "../../../store/actions/root";
import {useDispatch} from "react-redux";
import {UploadPage} from "../../common/upload/UploadLoadable";
import {ContactsInterface} from "../contactInterface";

export const ContactsPage: any = () => {
    const {Search} = Input;
    const {Title} = Typography;

    const [segmentSelect, setSegmentSelect] = useState<DropDown[]>([
        {
            value: 'allContacts',
            label: 'All Contacts',
            children: null
        },
        {
            value: 'segments',
            label: 'Segments',
            children: [
                {
                    value: 'xennials',
                    label: 'The Xennials',
                    children: null
                },
            ],
        }]);
    const [emailIdSelected, setEmailIdSelected] = useState<string[]>([]);

    const [contactDS, setContactDS] = useState<ContactsInterface[]>([
        {
            key: '1',
            email: 'atulkp.eee13@nituk.ac.in',
            firstName: 'Atul',
            lastName: 'Pandey',
            emailMarketing: 'Subscribed',
            tags: 'Prospect'
        },
        {
            key: '2',
            email: 'atul.pandey@solulever.com',
            firstName: 'Atul Kumar',
            lastName: 'Pandey',
            emailMarketing: 'Not Subscribed',
            tags: 'Zoho Campaign'
        }
    ]);
    const [contactDSOps, setContactDSOps] = useState<ContactsInterface[]>([
        {
            key: '1',
            email: 'atulkp.eee13@nituk.ac.in',
            firstName: 'Atul',
            lastName: 'Pandey',
            emailMarketing: 'Subscribed',
            tags: 'Prospect'
        },
        {
            key: '2',
            email: 'atul.pandey@solulever.com',
            firstName: 'Atul Kumar',
            lastName: 'Pandey',
            emailMarketing: 'Not Subscribed',
            tags: 'Zoho Campaign'
        },
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
    const [tableLabel, setTableLabel] = useState<string>('All Contacts');
    const [editPage, setEditPage] = useState(false);
    const [contactObj, setContactObj] = useState({});
    const [uploadModal, setUploadModal] = useState(false);
    const [uploadFileInfo, setUploadFileInfo] = useState({
        file: {},
        fileList: [{}]
    });

    const dispatch = useDispatch();

    const handleSegmentChange = (value: any) => {
        setTableLabel(value[value.length - 1].label);
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
        }
    };

    const openContactEdit = (record: any) => {
        setContactObj(record);
        setEditPage(true);
    };
    const deleteContact = (record: any) => {
        console.log(record);
    }

    const exportCsv = () => {
        let str = columns.map(itr => itr.title !== 'Action' ? itr.title : null).join(",");
        contactDSOps.forEach(item => {
            let currentRow = item.email + "," + item.firstName + "," + item.lastName + "," + item.emailMarketing + "," + item.tags;
            str = str + "\n" + currentRow;
        });
        exportCSVFile(str, tableLabel);
    };

    const handleAddContactMenuClick = (e: any) => {
        if (e.key === 'addManually') {
            setEditPage(true);
            setContactObj({});
        } else {
            setUploadModal(true);
        }
    };

    const addContactMenu = (
        <Menu onClick={handleAddContactMenuClick}>
            <Menu.Item key="addManually">Add Manually</Menu.Item>
            <Menu.Item key="uploadCSV">Upload .CSV</Menu.Item>
        </Menu>
    );

    const navigateToLandingPage = () => {
        dispatch(updateBreadcrumb(['Audience', 'Contacts']));
        setContactObj({});
        setEditPage(false);
    };

    const deleteAllContact = () => {
        if (emailIdSelected.length === 0) {
            message.warning("Please use the checkbox to select contact for deletion", 0.8).then(() => {
            });
        }
        console.log(emailIdSelected);
    };

    const cancelUploadProcess = () => {
        setUploadModal(false);
        setUploadFileInfo({file: {}, fileList: [{}]});
    }
    const processUploadedFile = () => {
        console.log(uploadFileInfo.fileList);
    }
    return !editPage ? (
        <div className="contacts pageLayout">
            <div className="firstNav">
                <div className="leftPlacement">
                    <div className="searchInput">
                        <Search placeholder="input search text" onSearch={onSearch} enterButton/>
                    </div>
                    <div>
                        <Cascader options={segmentSelect}
                                  onChange={(value, selectedOptions) => handleSegmentChange(selectedOptions)}
                                  placeholder="Select Segment"/>
                    </div>
                </div>
                <div className="rightPlacement">
                    <Popconfirm overlayClassName="ant-popover-audience" placement="left"
                                title={<p><Title level={5}>Are you sure you want to delete?</Title>
                                    This will permanently delete these records and all associated data from your
                                    account. Deleting and re-adding records can alter your monthly contact limits.
                                    <a href={"https://www.google.com"} target={'_blank'} rel={'noreferrer'}>Learn
                                        More</a></p>}
                                okText="Delete" cancelText="Cancel"
                                onConfirm={deleteAllContact}>
                        <Button className="deleteBtn" icon={<DeleteOutlined/>} type="primary" danger>Delete</Button>
                    </Popconfirm>
                    <Button className="exportBtn" onClick={exportCsv} icon={<ExportOutlined/>}>Export CSV</Button>
                    <Dropdown.Button type={'primary'} overlay={addContactMenu}>Add
                        Contact</Dropdown.Button>
                </div>
                <Modal title="Upload Contacts" centered visible={uploadModal} width={'75%'} footer={[
                    <Button key="cancel" onClick={cancelUploadProcess} icon={<CloseOutlined/>}>
                        Cancel
                    </Button>,
                    <Button key="upload" type="primary" icon={<DownloadOutlined/>} onClick={processUploadedFile}>
                        Upload
                    </Button>
                ]} onCancel={cancelUploadProcess}>
                    <UploadPage fileInfo={(fileInfo: any) => setUploadFileInfo(fileInfo)}/>
                </Modal>
            </div>
            <div className="secondNav">
                <Title level={4}>{tableLabel}</Title>
            </div>
            <div className="thirdNav">
                <Table rowSelection={{...contactRowSelection}} dataSource={contactDS} columns={columns} bordered/>
            </div>
        </div>
    ) : <ContactEditPage contactObj={contactObj} routeToOverview={navigateToLandingPage}/>
}