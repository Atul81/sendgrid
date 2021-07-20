import React, {useEffect, useState} from "react";
import {Button, Form, Input, message, Modal, Radio, Select, Space, Tooltip} from "antd";
import {CheckOutlined, CloseOutlined, MinusCircleOutlined, PlusOutlined, SearchOutlined} from "@ant-design/icons";
import {DropDown} from "../../../../../utils/Interfaces";
import '../amendAutomation.scss';
import {editObjectById, getAllServerCall, getObjectById} from "../../../../../service/serverCalls/mockServerRest";
import {GET_SERVER_ERROR} from "../../../../../utils/common";
import {useDispatch, useSelector} from "react-redux";
import {updateWorkFlowCardData} from "../../../../../store/actions/root";

export const JourneyEntryModal = (props: any) => {

    const [journeyForm] = Form.useForm();
    const {Option} = Select;
    const dispatch = useDispatch();
    const [workFlowData, setWorkFlowData] = useState({});
    const radioStyle = {
        display: 'block',
        height: '30px',
        lineHeight: '30px',
    };
    // @ts-ignore
    const workFlowCardData = useSelector((state) => state.root.workFlowData);
    const [allEvents, setAllEvents] = useState<DropDown[]>([]);
    const [allSegments, setAllSegments] = useState<DropDown[]>([]);
    const filterCountryOption = (input: string, option: any) => {
        return option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
    };
    const handleCancel = () => {
        props.closeModal();
    };

    useEffect(() => {
        getAllServerCall('segments').then(async response => {
            let resBody = await response.json();
            let data: DropDown[] = [];
            if (resBody && Array.isArray(resBody)) {
                resBody.forEach((itr: any) => {
                    data.push({value: itr.id, label: itr.name, children: null});
                });
            }
            setAllSegments(data);
        }).catch(reason => {
            console.log(reason);
            message.error(GET_SERVER_ERROR, 0.8).then(() => {
            });
        });
        getAllServerCall('customEvents').then(async response => {
            let resBody = await response.json();
            let data: DropDown[] = [];
            if (resBody && Array.isArray(resBody)) {
                resBody.forEach((itr: any) => {
                    data.push({value: itr.id, label: itr.name, children: null});
                });
            }
            setAllEvents(data);
        }).catch(reason => {
            console.log(reason);
            message.error(GET_SERVER_ERROR, 0.8).then(() => {
            });
        });
        getObjectById(props.data.workflowKey, 'cardData').then(async getAllWorkFlowAsync => {
            let getAllWorkflowRes = await getAllWorkFlowAsync.json();
            journeyForm.setFieldsValue({
                journeyInfo: {
                    testName: getAllWorkflowRes[props.data.id] ? getAllWorkflowRes[props.data.id].testName : undefined,
                    event: getAllWorkflowRes[props.data.id] ? getAllWorkflowRes[props.data.id].event : undefined,
                    segments: getAllWorkflowRes[props.data.id] ? getAllWorkflowRes[props.data.id].segments : undefined,
                    description: getAllWorkflowRes[props.data.id] ? getAllWorkflowRes[props.data.id].description : undefined,
                    attributes: getAllWorkflowRes[props.data.id] ? getAllWorkflowRes[props.data.id].attributes : undefined,
                    metrics: getAllWorkflowRes[props.data.id] ? getAllWorkflowRes[props.data.id].metrics : undefined
                }
            });
            setWorkFlowData(getAllWorkflowRes);
            console.error(journeyForm.getFieldsValue())
        }).catch(reason => {
            console.log(reason);
            message.error(GET_SERVER_ERROR, 0.8).then(() => {
            });
        });
    }, []);
    const saveJourneyData = (values: any) => {
        dispatch(updateWorkFlowCardData({...workFlowCardData, [props.data.id]: values.journeyInfo}));
        editObjectById({
            id: props.data.workflowKey,
            ...workFlowData,
            [props.data.id]: values.journeyInfo
        }, 'cardData').then(async journeyDataAsync => {
            let journeyDataRes = await journeyDataAsync.json();
            if (journeyDataRes) {
                message.success('Journey data has been successfully updated', 0.6).then(_ => {
                });
            }
        }).catch(reason => {
            console.log(reason);
            message.error(GET_SERVER_ERROR, 0.8).then(() => {
            });
        });
    }

    return <Modal key={props.data.id} wrapClassName='journeyModal' width={750} centered
                  title={<Tooltip title={'Info'}><span>Journey Entry</span></Tooltip>}
                  visible={props.openModal}
                  onCancel={handleCancel} destroyOnClose={true} footer={null}>
        <Form name="journeyEntryForm" form={journeyForm} layout={'vertical'} onFinish={saveJourneyData}
              autoComplete={'off'}>
            <Form.Item label={<strong>Choose how to start the journey:</strong>}>
                <Form.Item name={['journeyInfo', 'testName']} noStyle>
                    <Radio.Group>
                        <Radio style={radioStyle} value={1}>Add participants when they perform an activity</Radio>
                        <Radio style={radioStyle} value={2}>Add participants from a segment</Radio>
                        <br/>
                    </Radio.Group>
                </Form.Item>
            </Form.Item>
            <Form.Item label={<strong>Events</strong>}>
                <Form.Item name={['journeyInfo', 'event']} noStyle>
                    <Select showSearch placeholder="Select Event" suffixIcon={<SearchOutlined/>}
                            optionFilterProp="children" allowClear={true}
                            filterOption={(input, option) => filterCountryOption(input, option)}>
                        {allEvents.map(value => {
                            return <Option value={value.label}
                                           key={value.value}>{value.label}</Option>
                        })}
                    </Select>
                </Form.Item>
            </Form.Item>
            <div className={'formListHeader'}>
                <strong>Event Attributes - optional</strong>
            </div>
            <Form.List name={['journeyInfo', 'attributes']}>
                {(fields, {add, remove}) => (
                    <>
                        {fields.map(({key, name, fieldKey, ...restField}) => (
                            <Space key={key} style={{display: 'flex'}} align="center">
                                <Form.Item label={'Attribute'}
                                           {...restField}
                                           name={[name, 'attr']}
                                           fieldKey={[fieldKey, 'attr']}
                                           rules={[{required: true, message: 'Missing Attribute Name'}]}
                                >
                                    <Input.Search placeholder="Search Attribute"/>
                                </Form.Item>
                                <Form.Item label={'Value'}
                                           {...restField}
                                           name={[name, 'value']}
                                           fieldKey={[fieldKey, 'value']}
                                           rules={[{required: true, message: 'Missing Value for attribute'}]}
                                >
                                    <Input placeholder="Last Name"/>
                                </Form.Item>
                                <div className={'closeIcon'}>
                                    <MinusCircleOutlined onClick={() => remove(name)}/>
                                </div>
                            </Space>
                        ))}
                        <Form.Item style={{width: '45%'}}>
                            <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined/>}>
                                Add New Attribute
                            </Button>
                        </Form.Item>
                    </>
                )}
            </Form.List>
            <div className={'formListHeader'}>
                <strong>Event Metrics - optional</strong>
            </div>
            <Form.List name={['journeyInfo', 'metrics']}>
                {(fields, {add, remove}) => (
                    <>
                        {fields.map(({key, name, fieldKey, ...restField}) => (
                            <Space key={key} style={{display: 'flex'}} align="center">
                                <Form.Item label={'Metric'}
                                           {...restField}
                                           name={[name, 'attr']}
                                           fieldKey={[fieldKey, 'attr']}
                                           rules={[{required: true, message: 'Missing Attribute from metrics'}]}
                                >
                                    <Input.Search placeholder="Search Metric"/>
                                </Form.Item>
                                <Form.Item label={'Operator'}
                                           {...restField}
                                           name={[name, 'operator']}
                                           fieldKey={[fieldKey, 'operator']}
                                           rules={[{required: true, message: 'Missing operator from metrics'}]}
                                >
                                    <Input placeholder="Last Name"/>
                                </Form.Item>
                                <Form.Item label={'Value'}
                                           {...restField}
                                           name={[name, 'value']}
                                           fieldKey={[fieldKey, 'value']}
                                           rules={[{required: true, message: 'Missing Value from metrics'}]}
                                >
                                    <Input placeholder="Last Name"/>
                                </Form.Item>
                                <div className={'closeIcon'}>
                                    <MinusCircleOutlined onClick={() => remove(name)}/>
                                </div>
                            </Space>
                        ))}
                        <Form.Item style={{width: '45%'}}>
                            <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined/>}>
                                Add New Metrics
                            </Button>
                        </Form.Item>
                    </>
                )}
            </Form.List>
            <Form.Item label={<strong>Segments - optional</strong>}>
                <Form.Item name={['journeyInfo', 'segments']} noStyle>
                    <Select showSearch placeholder="Select Segments" suffixIcon={<SearchOutlined/>}
                            optionFilterProp="children" allowClear={true}
                            filterOption={(input, option) => filterCountryOption(input, option)}>
                        {allSegments.map(value => {
                            return <Option value={value.label} key={value.value}>{value.label}</Option>
                        })}
                    </Select>
                </Form.Item>
            </Form.Item>
            <div className={'formListHeader'}>
                <span>The list only includes the most recently modified segments for the current project</span>
            </div>
            <Form.Item label={<strong>Description - optional</strong>}>
                <Form.Item name={['journeyInfo', 'description']} noStyle>
                    <Input placeholder={'Enter a description for this step'}/>
                </Form.Item>
            </Form.Item>
            <div className={'formListHeader'}>
                <strong>Total endpoints in segment: -</strong>
            </div>
            <div className='reverseFlex'>
                <Form.Item>
                    <Button key="cancel" htmlType={'reset'} onClick={handleCancel}
                            icon={<CloseOutlined/>}>
                        Cancel
                    </Button>
                </Form.Item>
                <Form.Item>
                    <Button style={{marginRight: 8}} key="save" htmlType={'submit'} type="primary"
                            icon={<CheckOutlined/>}>
                        Save
                    </Button>
                </Form.Item>
            </div>
        </Form>
    </Modal>
}
