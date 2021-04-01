import React, {useState} from "react";
import "./contacts.scss";
import {Button, Cascader, Dropdown, Input, Menu, Popconfirm, Space, Table, Typography} from "antd";
import {DropDown} from "../../../utils/Interfaces";
import {DeleteOutlined, EditOutlined, ExportOutlined} from '@ant-design/icons';
import {ContactsInterface} from "../Interface";
import Tag from "antd/es/tag";
import {exportCSVFile} from "../../../utils/common";
import {getDate, getMonth, getYear} from 'date-fns';
import {EditContactPage} from "./edit/EditContactLoadable";
import {updateBreadcrumb} from "../../../store/actions/root";
import {useDispatch} from "react-redux";

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
        },
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
                    <p className={"actionColumn"}
                       onClick={() => openContactEdit(record)}><EditOutlined/></p>
                    <Popconfirm overlayClassName="ant-popover-contact" placement="left"
                                title={<p><Title level={5}>Are you sure you want to delete?</Title>
                                    This will permanently delete these records and all associated data from your
                                    account. Deleting and re-adding records can alter your monthly contact limits. <a>Learn
                                        More</a></p>}
                                okText="Delete" cancelText="Cancel"
                                onConfirm={() => deleteContact(record)}>
                        <p className={"actionColumn"}>
                            <DeleteOutlined/>
                        </p>
                    </Popconfirm>
                </Space>
            }),
        },
    ];
    const [tableLabel, setTableLabel] = useState<string>('All Contacts');
    const [editPage, setEditPage] = useState(false);
    const [contactObj, setContactObj] = useState({});
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
        let str = columns.map(itr => {
            return itr.title !== 'Action' ? itr.title : null;
        }).join(",");
        contactDSOps.forEach(item => {
            let currentRow = item.email + "," + item.firstName + "," +
                item.lastName + "," + item.emailMarketing + "," + item.tags;
            str = str + "\n" + currentRow;
        });
        let day = getDate(new Date()) + '_' + (getMonth(new Date()) + 1) + '_' + getYear(new Date());
        const fileName = `${day}_${tableLabel}.csv`;
        exportCSVFile(str, fileName);
    };

    const handleAddContactMenuClick = (e: any) => {
        console.log('click', e.key);
    };

    const addContactMenu = (
        <Menu onClick={handleAddContactMenuClick}>
            <Menu.Item key="addManually">Add Manually</Menu.Item>
            <Menu.Item key="uploadCSV">Upload .CSV</Menu.Item>
        </Menu>
    );

    const navigateToLandingPage = () => {
        dispatch(updateBreadcrumb(['Audience', 'Contacts']));
        setEditPage(false);
    }
    return !editPage ? (<div className="contacts">
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
                    <Button className="deleteBtn" icon={<DeleteOutlined/>} type="primary" danger>Delete</Button>
                    <Button className="exportBtn" onClick={exportCsv} icon={<ExportOutlined/>}>Export CSV</Button>
                    <Dropdown.Button type={'primary'} className="addContactBtn" overlay={addContactMenu}>Add
                        Contact</Dropdown.Button>
                </div>
            </div>
            <div className="secondNav">
                <Title level={4}>{tableLabel}</Title>
            </div>
            <div className="thirdNav">
                <Table rowSelection={{...contactRowSelection}} dataSource={contactDS}
                       columns={columns} bordered/>
            </div>
        </div>
    ) : <EditContactPage contactObj={contactObj} routeToOverview={navigateToLandingPage}/>
}