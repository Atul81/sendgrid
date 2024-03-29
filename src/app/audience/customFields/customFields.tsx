import React, {useEffect, useState} from "react";
import './customFields.scss';
import {Button, Card, Form, Input, message, Modal, Popconfirm, Radio, Space, Table} from "antd";
import {DeleteOutlined, EditOutlined} from "@ant-design/icons";
import Search from "antd/lib/input/Search";
import {CustomFields} from "../audienceInterface";
import Title from "antd/lib/typography/Title";
import Paragraph from "antd/lib/typography/Paragraph";
import {
    addNewObject,
    deleteObjectById,
    editObjectById,
    getAllServerCall
} from "../../../service/serverCalls/mockServerRest";
import {useSelector} from "react-redux";
import {GET_SERVER_ERROR, POST_SERVER_ERROR, PUT_SERVER_ERROR} from "../../../utils/common";

export const CustomFieldsPage: any = () => {

    useEffect(() => {
        populateAllSegments();
    }, []);

    const [amendCustomForm] = Form.useForm();

    const [editModal, setEditModal] = useState(false);
    const [customFieldsDS, setCustomFieldsDS] = useState<CustomFields[]>([]);
    const [customFieldsDSOps, setCustomFieldsDSOps] = useState<CustomFields[]>([]);
    const [selectedFieldKeys, setFieldKeys] = useState<string[]>([]);
    const [customFormId, setCustomFormId] = useState<number>(5);
    const userRole = useSelector((state: any) => state.root.userRole);

    const columnsStd = [
        {
            title: 'Field Name',
            dataIndex: 'fieldName',
            key: 'fieldName',
            sorter: (a: any, b: any) => a.fieldName.length - b.fieldName.length,
            width: '70%'
        },
        {
            title: 'Field Type',
            dataIndex: 'fieldType',
            key: 'fieldType',
            sorter: (a: any, b: any) => a.fieldType.length - b.fieldType.length
        }
    ];
    const columnsAdmin = [
        {
            title: 'Field Name',
            dataIndex: 'fieldName',
            key: 'fieldName',
            sorter: (a: any, b: any) => a.fieldName.length - b.fieldName.length,
            width: '70%'
        },
        {
            title: 'Field Type',
            dataIndex: 'fieldType',
            key: 'fieldType',
            sorter: (a: any, b: any) => a.fieldType.length - b.fieldType.length
        },
        {
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
        }
    ];

    const populateAllSegments = () => {
        getAllServerCall('customFields').then(async response => {
            let resBody = await response.json();
            let data: CustomFields[] = [];
            if (resBody && Array.isArray(resBody)) {
                resBody.forEach((itr: any) => {
                    data.push({...itr, key: itr.id});
                });
            }
            setCustomFieldsDS(data);
            setCustomFieldsDSOps(data);
        }).catch(reason => {
            console.error(reason);
            message.error(GET_SERVER_ERROR, 0.8).then(() => {
            });
        });
    };

    const openContactEdit = (record: any) => {
        setEditModal(true);
        setCustomFields({
            ...customFields,
            radioValue: record.fieldType ? record.fieldType : 'Text',
            name: record.fieldName,
            key: record.key
        });
        amendCustomForm.setFieldsValue({
            customFields: {
                name: record.fieldName,
                radioValue: record.fieldType ? record.fieldType : 'Text'
            }
        })
    };

    const deleteCustomFields = (record: any) => {
        deleteObjectById(record.key, 'customFields').then(async response => {
            let resBody = await response.json();
            if (resBody) {
                message.success(`Custom Field ${record.fieldName} has been deleted`, 0.6);
                populateAllSegments();
            }
        }).catch(reason => {
            console.error(reason);
        });
    }
    const onSearch = (searchParam: string) => {
        setCustomFieldsDS(customFieldsDSOps.filter(value => {
            return value.fieldName.includes(searchParam);
        }));
    };

    const [customFields, setCustomFields] = useState({
        name: '',
        radioValue: 'Text',
        key: ''
    });

    const cancelFieldModification = () => {
        setEditModal(false);
        amendCustomForm.resetFields();
        setCustomFields({
            name: '',
            radioValue: 'Text',
            key: ''
        })
    };

    const modifyCustomField = (values: any) => {
        if (customFields.key.length !== 0) {
            editObjectById({
                id: customFields.key,
                fieldName: values.customFields.name,
                fieldType: values.customFields.radioValue
            }, 'customFields').then(async response => {
                let resBody = await response.json();
                if (resBody) {
                    message.success("Custom Field Data successfully updated", 0.6);
                }
            }).catch(reason => {
                console.error(reason);
                message.error(PUT_SERVER_ERROR, 0.8).then(() => {
                });
            });
        } else {
            addNewObject({
                id: customFields.key,
                fieldName: values.customFields.name,
                fieldType: values.customFields.radioValue
            }, 'customFields').then(async response => {
                let resBody = await response.json();
                if (resBody) {
                    message.success("Custom Field Data successfully created", 0.6);
                }
            }).catch(reason => {
                console.error(reason);
                message.error(POST_SERVER_ERROR, 0.8).then(() => {
                });
            });
            setCustomFormId(customFormId + 1);
        }
        populateAllSegments();
        amendCustomForm.resetFields();
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
        } else {
            message.error("Buld delete not supported", 0.7).then(() => {
            });
        }
    };
    return (
        <div className="customFields">
            <div className="tableAndReserved">
                <div className="pageLayout">
                    <div className="secondNav">
                        <Title level={4}>Custom Fields</Title>
                    </div>
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
                    <div className="thirdNav">
                        <Modal key={customFields.name} className={'editModal'} title="Add/Edit Custom Field" centered
                               visible={editModal}
                               width={450} footer={null} onCancel={cancelFieldModification}>
                            <Paragraph type="secondary">Use only alphanumeric characters (letters A-Z, numbers 0-9) and
                                underscores. Do not use
                                reserved field name</Paragraph>
                            <Form layout={'vertical'} form={amendCustomForm} onFinish={modifyCustomField}>
                                <Form.Item label={<Title level={5}>Name</Title>}>
                                    <Form.Item name={['customFields', 'name']}>
                                        <Input disabled={customFields.key.length !== 0} placeholder="Text Only"/>
                                    </Form.Item>
                                </Form.Item>
                                <Form.Item name={['customFields', 'radioValue']}>
                                    <Radio.Group>
                                        <Radio value={'Text'}>Text</Radio>
                                        <Radio value={'Number'}>Number</Radio>
                                        <Radio value={'List of Strings'}>List of Strings</Radio>
                                    </Radio.Group>
                                </Form.Item>
                                <div className={'reverseFlex'}>
                                    <Form.Item>
                                        <Button key="done" htmlType={'submit'} type="primary">
                                            Done
                                        </Button>
                                    </Form.Item>
                                    <Form.Item>
                                        <Button key="cancel" htmlType={'reset'} style={{marginRight: 8}}
                                                onClick={cancelFieldModification}>
                                            Cancel
                                        </Button>
                                    </Form.Item>
                                </div>

                            </Form>
                        </Modal>
                        <Table rowSelection={{...customFieldRowSelection}} dataSource={customFieldsDS}
                               columns={userRole.roleType === 'Admin' ? columnsAdmin : columnsStd}
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
                                {customFieldsDS.map(value => {
                                    return <div key={value.key} className="boxValue">
                                        <Title level={5}>{value.fieldName}</Title>
                                        <Paragraph type={'secondary'}>{value.fieldType}</Paragraph>
                                    </div>
                                })}
                            </div>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}
