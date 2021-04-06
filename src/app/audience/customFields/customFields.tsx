import React, {useState} from "react";
import './customFields.scss';
import {Button, Card, Input, message, Modal, Popconfirm, Radio, Space, Table} from "antd";
import {DeleteOutlined, EditOutlined} from "@ant-design/icons";
import Search from "antd/lib/input/Search";
import {CustomFields} from "../contactInterface";
import Title from "antd/lib/typography/Title";
import Paragraph from "antd/lib/typography/Paragraph";

export const CustomFieldsPage: any = () => {

    const [editModal, setEditModal] = useState(false);
    const [customFieldsDS, setCustomFieldsDS] = useState<CustomFields[]>([
        {
            key: '1',
            fieldName: 'atulkp.eee13@nituk.ac.in',
            fieldType: 'Text',
        },
        {
            key: '2',
            fieldName: 'info@solulever.com',
            fieldType: 'Pandey',
        }
    ]);
    const [customFieldsDSOps, setCustomFieldsDSOps] = useState<CustomFields[]>([
        {
            key: '1',
            fieldName: 'atulkp.eee13@nituk.ac.in',
            fieldType: 'Text',
        },
        {
            key: '2',
            fieldName: 'info@solulever.com',
            fieldType: 'Pandey',
        }
    ]);
    const [selectedFieldKeys, setFieldKeys] = useState<string[]>([]);

    const columns = [
        {
            title: 'Field Name',
            dataIndex: 'fieldName',
            key: 'fieldName',
        },
        {
            title: 'Field Type',
            dataIndex: 'fieldType',
            key: 'fieldType',
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

    const openContactEdit = (record: any) => {
        setEditModal(true);
        setCustomFields({
            ...customFields,
            radioValue: record.fieldType !== 'Text' ? 'Number' : 'Text',
            name: record.fieldName
        });
    };

    const deleteCustomFields = (record: any) => {
        console.log(record);
    }
    const onSearch = (searchParam: string) => {
        setCustomFieldsDS(customFieldsDSOps.filter(value => {
            return value.fieldName.includes(searchParam);
        }));
    };

    const [customFields, setCustomFields] = useState({
        name: '',
        radioValue: 'text'
    });

    const cancelFieldModification = () => {
        setEditModal(false);
    };

    const modifyCustomField = () => {
        console.log(customFields);
        setEditModal(false);
    };

    const customFieldRowSelection = {
        onChange: (selectedRowKeys: React.Key[], selectedRows: CustomFields[]) => {
            let rowsSelected: string[] = [];
            selectedRows.forEach(customFieldItr => {
                rowsSelected.push(customFieldItr.key);
            });
            setFieldKeys(rowsSelected);
        }
    };

    const deleteSelectFields = () => {
        if (selectedFieldKeys.length === 0) {
            message.warning("Please use the checkbox to select contact for deletion", 0.8).then(() => {
            });
        }
        console.log(selectedFieldKeys);
    };
    return (
        <div className="customFields">
            <div className="tableAndReserved">
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
                                            limits. <a href={"https://www.google.com"} target={'_blank'}
                                                       rel={'noreferrer'}>Learn More</a></p>}
                                        okText="Delete" cancelText="Cancel"
                                        onConfirm={deleteSelectFields}>
                                <Button className="deleteBtn" icon={<DeleteOutlined/>} type="primary"
                                        danger>Delete</Button>
                            </Popconfirm>
                            <Button className="addBtn" onClick={() => setEditModal(true)} type={'primary'}>Add Custom
                                Field</Button>
                        </div>
                    </div>
                    <div className="thirdNav" style={{height: 'calc(100vh - 228px)'}}>
                        <Modal title="Add/Edit Custom Field" centered visible={editModal} width={450} footer={[
                            <Button key="cancel" onClick={cancelFieldModification}>
                                Cancel
                            </Button>,
                            <Button key="done" type="primary" onClick={modifyCustomField}>
                                Done
                            </Button>
                        ]} onCancel={cancelFieldModification}>
                            <Paragraph type="secondary">Use only alphanumeric characters (letters A-Z, numbers 0-9) and
                                underscores. Do not use
                                reserved field name</Paragraph>

                            <Title level={5}>Name</Title>
                            <Input value={customFields.name}
                                   onChange={(e) => setCustomFields({...customFields, name: e.target.value})}
                                   placeholder="Text Only"/>
                            <Radio.Group style={{marginTop: 16}}
                                         onChange={(e) => setCustomFields({
                                             ...customFields,
                                             radioValue: e.target.value
                                         })}
                                         value={customFields.radioValue}>
                                <Radio value={'Text'}>Text</Radio>
                                <Radio value={'Number'}>Number</Radio>
                            </Radio.Group>
                        </Modal>
                        <Table rowSelection={{...customFieldRowSelection}} dataSource={customFieldsDS} columns={columns}
                               bordered/>
                    </div>
                </div>
                <div className="pageLayout">
                    <div className="firstNav">
                        <div className="leftPlacement">
                            <Title level={4}>Reserved Fields</Title>
                        </div>
                    </div>
                    <div className="thirdNav cardSpacing" style={{height: 'calc(100vh - 228px)'}}>
                        <Card>
                            <div className="reservedBox">
                                <div className="label">
                                    <Title level={5}>First Name</Title>
                                    <Title level={5}>Last Name</Title>
                                    <Title level={5}>Email</Title>
                                    <Title level={5}>Alternate Email</Title>
                                    <Title level={5}>Address Line 1</Title>
                                </div>
                                <div className="value">
                                    <Paragraph type="secondary">Text</Paragraph>
                                    <Paragraph type="secondary">Text</Paragraph>
                                    <Paragraph type="secondary">Text</Paragraph>
                                    <Paragraph type="secondary">Text</Paragraph>
                                    <Paragraph type="secondary">Text</Paragraph>
                                    <Paragraph type="secondary">Text</Paragraph>
                                </div>
                            </div>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}