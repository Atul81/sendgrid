import React, {useState} from "react";
import {Button, Form, Input, Modal, Radio, Select, Space, Tooltip} from "antd";
import {CheckOutlined, CloseOutlined, MinusCircleOutlined, PlusOutlined, SearchOutlined} from "@ant-design/icons";
import {DropDown} from "../../../../utils/Interfaces";
import './amendAutomation.scss';

export const JourneyEntryModal = (props: any) => {

    const [journeyForm] = Form.useForm();
    const {Option} = Select;

    const radioStyle = {
        display: 'block',
        height: '30px',
        lineHeight: '30px',
    };

    const [allEvents, setAllEvents] = useState<DropDown[]>([]);
    const [allSegments, setAllSegments] = useState<DropDown[]>([]);
    const filterCountryOption = (input: string, option: any) => {
        return option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
    };
    const handleCancel = () => {
        props.closeJourneyModal();
    };

    const saveJourneyData = (values: any) => {
        console.log(values)
    }

    return <Modal wrapClassName='journeyModal' width={750}
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
