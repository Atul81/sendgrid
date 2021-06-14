import React, {useEffect, useState} from "react";
import {Button, Form, Input, message, Modal, Select, Space, Table, Tag} from "antd";
import {CheckOutlined, CloseOutlined, EditOutlined} from "@ant-design/icons";
import {CustomEventsInterface} from "../settingsInterface";
import Title from "antd/lib/typography/Title";
import {editObjectById, getAllServerCall} from "../../../service/serverCalls/mockServerRest";
import Search from "antd/es/input/Search";
import TextArea from "antd/lib/input/TextArea";
import {GET_SERVER_ERROR, PUT_SERVER_ERROR, validateEmail} from "../../../utils/common";

export const CustomEventsPage: any = () => {

    const [editEventModal, openEditEventModal] = useState(false);
    const [customEventObj, setCustomEventObj] = useState({
        name: '',
        key: ''
    });
    const [eventForm] = Form.useForm();
    const closeEditModal = () => {
        openEditEventModal(false);
        eventForm.resetFields();
    }
    const editCustomEvent = (record: any) => {
        openEditEventModal(true);
        setCustomEventObj(record);
        eventForm.setFieldsValue({
            formObj: {...record}
        })
    };

    const editCustomEventService = (values: any) => {
        editObjectById({
            id: customEventObj.key,
            name: customEventObj.name,
            description: values.formObj.description,
            status: values.formObj.status
        }, 'customEvents').then(async editCustomEventAsync => {
            let editCustomEventRes = await editCustomEventAsync.json();
            if (editCustomEventRes) {
                message.success(`${customEventObj.name} has been successfully updated`);
            }
            populateTableData();
            openEditEventModal(false);
        }).catch(reason => {
            console.log(reason);
            message.error(PUT_SERVER_ERROR, 0.8).then(() => {
            });
        });
    }

    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            sorter: (a: any, b: any) => a.name.length - b.name.length
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: ((text: string, record: any) => {
                return (
                    <Tag key={record.key} color={text === 'Active' ? 'green' : 'red'}>{text}</Tag>
                );
            }),
            width: '10%',
            sorter: (a: any, b: any) => a.status.length - b.status.length
        },
        {
            title: 'Description',
            dataIndex: 'description',
            key: 'description',
            width: '40%',
            ellipsis: true,
            sorter: (a: any, b: any) => a.description.length - b.description.length
        },
        {
            dataIndex: '',
            key: 'action',
            width: '75px',
            render: ((text: string, record: any) => {
                return <Space size="small">
                    <p className={"actionColumn noMarginIcon"} onClick={() => editCustomEvent(record)}>
                        <EditOutlined/></p>
                </Space>
            }),
        }
    ];

    const [customEventsDS, setCustomEventsDS] = useState<CustomEventsInterface[]>([]);
    const [customEventsDSOps, setCustomEventsDSOps] = useState<CustomEventsInterface[]>([]);

    useEffect(() => {
        populateTableData();
    }, []);

    const populateTableData = () => {
        getAllServerCall('customEvents').then(async allCustomEventsAsync => {
            let allCustomEventsRes = await allCustomEventsAsync.json();
            let data: CustomEventsInterface[] = [];
            if (allCustomEventsRes) {
                allCustomEventsRes.forEach((itr: any) => {
                    data.push({...itr, key: itr.id});
                });
            }
            setCustomEventsDS(data);
            setCustomEventsDSOps(data);
        }).catch(reason => {
            console.log(reason);
            message.error(GET_SERVER_ERROR, 0.8).then(() => {
            });
        });
    };

    const onSearchImports = (searchParam: string) => {
        setCustomEventsDS(customEventsDSOps.filter(value => {
            return value.name.includes(searchParam);
        }));
    };
    const {Option} = Select;

    return (
        <div className="domain pageLayout">
            <div className="secondNav">
                <Title level={4}>Event Settings</Title>
            </div>
            <div className="firstNav">
                <div className="leftPlacement">
                    <div className="searchInput">
                        <Search placeholder="input search text" onSearch={onSearchImports} enterButton/>
                    </div>
                </div>
            </div>
            <Modal title={`Edit: ${customEventObj.name}`} centered visible={editEventModal} width={'30%'} footer={null}
                   onCancel={closeEditModal}>
                <Form form={eventForm} layout={'vertical'} onFinish={editCustomEventService}>
                    <Form.Item label={<strong>Event Name</strong>}>
                        <Form.Item name={['formObj', 'name']}
                                   noStyle rules={[{required: true, message: 'User Email Address required'},
                            () => ({
                                validator(_, value) {
                                    if (value) {
                                        if (validateEmail(value)) {
                                            return Promise.resolve();
                                        } else {
                                            return Promise.reject(new Error('Email Address not valid!'));
                                        }
                                    }
                                }
                            })]}>
                            <Input disabled={true} placeholder="Text only" type={"email"}/>
                        </Form.Item>
                    </Form.Item>
                    <Form.Item label={<strong>Event Description</strong>}>
                        <Form.Item name={['formObj', 'description']} noStyle
                                   rules={[{required: true, message: 'User Role required'}]}>
                            <TextArea placeholder="Text only"/>
                        </Form.Item>
                    </Form.Item>
                    <Form.Item label={<strong>Status</strong>}>
                        <Form.Item name={['formObj', 'status']} noStyle>
                            <Select showSearch placeholder="Tracking Domain" optionFilterProp="children"
                                    allowClear={true}>
                                <Option value={'active'} key={'active'}>Active</Option>
                                <Option value={'inactive'} key={'inactive'}>Inactive</Option>
                            </Select>
                        </Form.Item>
                    </Form.Item>
                    <div className='reverseFlex'>
                        <Form.Item>
                            <Button key="cancel" htmlType={'reset'} onClick={closeEditModal}
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
                <Table dataSource={customEventsDS} columns={columns} bordered/>
            </div>
        </div>
    )
}
