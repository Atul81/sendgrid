import React, {useEffect, useState} from "react";
import {Button, Form, Input, message, Modal, Select, Space, Table, Tag, Typography} from "antd";
import {useDispatch} from "react-redux";
import {addNewObject, getAllServerCall} from "../../../service/serverCalls/mockServerRest";
import {GET_SERVER_ERROR, getTimeFromUnix, POST_SERVER_ERROR} from "../../../utils/common";
import {updateBreadcrumb} from "../../../store/actions/root";
import Search from "antd/es/input/Search";
import {DeliveryTestingInterface} from "../templatesInterface";
import {BeeTemplatePage} from "./beePlugin/beeTemplatePage";
import {CheckOutlined, CloseOutlined, EyeOutlined, PlusOutlined, StepBackwardOutlined} from "@ant-design/icons";
import {DropDown} from "../../../utils/Interfaces";

export const DeliveryTestingPage = () => {
    const {Title} = Typography;
    const dispatch = useDispatch();
    const [newTestForm] = Form.useForm();
    const [deliveryId, setDeliveryId] = useState(3);
    useEffect(() => {
        populateTableData();
        getAllServerCall('templates').then(async response => {
            let tempObj: DropDown[] = [];
            let res = await response.json();
            res.forEach((itr: any) => {
                tempObj.push({value: itr.id, label: itr.title, children: null});
            });
            setAllTemplates(tempObj);
        }).catch(reason => {
            console.log(reason);
            message.error('Unable to fetch templates data', 0.8).then(() => {
            });
        });
    }, []);

    const populateTableData = () => {
        getAllServerCall('deliveryTesting').then(async response => {
            let tempObj: DeliveryTestingInterface[] = [];
            let res = await response.json();
            res.forEach((itr: any) => {
                tempObj.push({...itr, dateTime: getTimeFromUnix(itr.dateTime), key: itr.id});
            });
            setDeliveryTesting(tempObj);
            setDeliveryTestingOps(tempObj);
        }).catch(reason => {
            console.log(reason);
            message.error(GET_SERVER_ERROR, 0.8).then(() => {
            });
        });
    }
    const [newTestModal, setNewTestModal] = useState(false);
    const [allTemplates, setAllTemplates] = useState<DropDown[]>([]);
    const [deliveryTesting, setDeliveryTesting] = useState<DeliveryTestingInterface[]>([]);
    const [deliveryTestingOps, setDeliveryTestingOps] = useState<DeliveryTestingInterface[]>([]);
    const columns = [
        {
            title: 'Test Name',
            dataIndex: 'testName',
            key: 'testName',
            render: (text: string, record: any) => {
                return record.status === 'Done' ?
                    <span style={{cursor: "pointer", color: "#1890FF"}}
                          onClick={() => openBeePlugin(record)}>{text}</span> :
                    <span>{text}</span>
            },
            sorter: (a: any, b: any) => a.testName.length - b.testName.length
        },
        {
            title: 'Date & Time',
            dataIndex: 'dateTime',
            key: 'dateTime',
            sorter: (a: any, b: any) => a.dateTime.length - b.dateTime.length
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: ((text: string, record: any) => {
                return (
                    <Tag key={record.key} color={text === 'Done' ? 'green' : 'geekblue'}>{text}</Tag>
                );
            }),
            sorter: (a: any, b: any) => a.status.length - b.status.length
        },
        {
            dataIndex: '',
            key: 'action',
            width: '75px',
            render: ((text: string, record: any) => {
                return record.status === 'Done' ? <Space size="small">
                    <p className={"actionColumn"} onClick={() => openBeePlugin(record)}><EyeOutlined/></p>
                </Space> : null
            })
        }
    ];

    const [deliveryObj, setDeliveryObj] = useState({
        testName: ''
    });
    const [openIeFrame, setOpenIeFrame] = useState(false);

    const openBeePlugin = (record: any) => {
        setDeliveryObj(record);
        setOpenIeFrame(true);
        dispatch(updateBreadcrumb(['templates', 'delivery-testing', 'delivery-report']));
    };
    const navigateToLandingPage = () => {
        dispatch(updateBreadcrumb(['templates', 'delivery-testing']));
        setDeliveryObj({testName: ''});
        setOpenIeFrame(false);
    };

    const onSearchImports = (searchParam: string) => {
        setDeliveryTesting(deliveryTestingOps.filter(value => {
            return value.testName.includes(searchParam);
        }));
    };

    const addNewTest = () => {
        setNewTestModal(true);
    };

    const closeNewTestModal = () => {
        setNewTestModal(false);
        newTestForm.resetFields();
    }

    const createNewTest = (values: any) => {
        addNewObject({
            ...values.formObj,
            id: deliveryId,
            dateTime: new Date().getTime(),
            status: 'Initiated'
        }, 'deliveryTesting').then(async addNewDeliveryAsync => {
            let addNewDeliveryRes = await addNewDeliveryAsync.json();
            if (addNewDeliveryRes) {
                message.success("New Delivery Test has been added");
                setDeliveryId(deliveryId + 1);
                populateTableData();
                closeNewTestModal();
            }
        }).catch(reason => {
            console.log(reason);
            message.error(POST_SERVER_ERROR, 0.8).then(() => {
            });
        });
    };

    const filterCountryOption = (input: string, option: any) => {
        return option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
    };
    const {Option} = Select;

    return !openIeFrame ? (
            <div className="pageLayout">
                <div className="secondNav">
                    <Title level={4}>All Tests</Title>
                </div>
                <div className="firstNav">
                    <div className="leftPlacement">
                        <div className="searchInput">
                            <Search placeholder="input search text" onSearch={onSearchImports} enterButton/>
                        </div>
                    </div>
                    <div className="rightPlacement">
                        <Button key="addTags" onClick={addNewTest}
                                icon={<PlusOutlined/>}>Add Test</Button>
                    </div>
                </div>
                <div className="thirdNav">
                    <Table columns={columns} dataSource={deliveryTesting} bordered/>
                </div>
                <Modal title='Add New test' centered={true} visible={newTestModal} onCancel={closeNewTestModal}
                       destroyOnClose={true}
                       footer={null}>
                    <Form form={newTestForm} layout={'horizontal'} onFinish={createNewTest}>
                        <Form.Item label={<strong>Test Name</strong>}>
                            <Form.Item name={['formObj', 'testName']} noStyle>
                                <Input placeholder="Enter Test name" type={"text"}/>
                            </Form.Item>
                        </Form.Item>
                        <Form.Item label={<strong>Template</strong>}>
                            <Form.Item name={['formObj', 'templateType']} noStyle>
                                <Select showSearch placeholder="Select Template"
                                        optionFilterProp="children" allowClear={true}
                                        filterOption={(input, option) => filterCountryOption(input, option)}>
                                    {allTemplates.map(value => {
                                        return <Option value={value.label}
                                                       key={value.value}>{value.label}</Option>
                                    })}
                                </Select>
                            </Form.Item>
                        </Form.Item>
                        <div className={'reverseFlex'}>
                            <Form.Item>
                                <Button key="cancel" htmlType={'reset'} onClick={closeNewTestModal}
                                        icon={<CloseOutlined/>}>
                                    Cancel
                                </Button>
                            </Form.Item>
                            <Form.Item>
                                <Button style={{marginRight: 8}} key="quickAdd" htmlType={'submit'} type="primary"
                                        icon={<CheckOutlined/>}>
                                    Save
                                </Button>
                            </Form.Item>
                        </div>
                    </Form>
                </Modal>
            </div>
        ) :
        <div className="pageLayout">
            <div className="firstNav">
                <div className="leftPlacement">
                    <Title level={4}>{deliveryObj.testName}</Title>
                </div>
                <div className='rightPlacement'>
                    <Button className="deleteBtn" icon={<StepBackwardOutlined/>}
                            onClick={navigateToLandingPage}>Cancel</Button>
                </div>
            </div>
            <div style={{width: '100%', height: 'calc(100vh - 140px)'}}>
                <BeeTemplatePage existingTemplate={deliveryObj} requestType={'view'}/>
            </div>
        </div>
}
