import React, {useRef, useState} from "react";
import {Button, DatePicker, Form, Input, message, Radio, Select, Steps} from 'antd';
import './amendCampaigns.scss';
import {
    CheckOutlined,
    CompassOutlined,
    HighlightOutlined,
    HistoryOutlined,
    LeftOutlined,
    MailOutlined,
    RightOutlined,
    StepBackwardOutlined,
    TeamOutlined
} from "@ant-design/icons";
import Title from "antd/es/typography/Title";
import {useHistory} from "react-router-dom";

export const AmendCampaignsPage: any = (propsObj: any) => {

    const {Step} = Steps;
    const {RangePicker} = DatePicker;
    const history = useHistory();
    const steps = [
        {
            key: 1,
            title: 'Step 1',
            content: 'Create a campaign',
            icon: <MailOutlined/>
        },
        {
            key: 2,
            title: 'Step 2',
            content: 'Choose a segment',
            icon: <TeamOutlined/>
        },
        {
            key: 3,
            title: 'Step 3',
            content: 'Create your message',
            icon: <HighlightOutlined/>
        },
        {
            key: 4,
            title: 'Step 4',
            content: 'Schedule Campaign',
            icon: <HistoryOutlined/>
        },
        {
            key: 5,
            title: 'Step 5',
            content: 'Review and launch',
            icon: <CompassOutlined/>
        }
    ];
    const [current, setCurrent] = useState(0);
    const currentFormValues = useRef({
        step1: {
            name: (propsObj.step1 && propsObj.step1.name) ? propsObj.step1.name : undefined,
            campaignType: (propsObj.step1 && propsObj.step1.campaignType) ? propsObj.step1.campaignType : undefined,
            sender: (propsObj.step1 && propsObj.step1.sender) ? propsObj.step1.sender : undefined
        },
        step2: {
            segment: (propsObj.step2 && propsObj.step2.segment) ? propsObj.step2.segment : undefined,
            segmentType: (propsObj.step2 && propsObj.step2.segmentType) ? propsObj.step2.segmentType : undefined,
            segmentHoldOut: (propsObj.step2 && propsObj.step2.segmentHoldOut) ? propsObj.step2.segmentHoldOut : undefined
        },
        step3: {
            segmentType: (propsObj.step3 && propsObj.step3.segmentType) ? propsObj.step3.segmentType : undefined,
            emailTemplate: (propsObj.step3 && propsObj.step3.emailTemplate) ? propsObj.step3.emailTemplate : undefined,
        },
        step4: {
            campaignTime: (propsObj.step4 && propsObj.step4.campaignTime) ? propsObj.step4.campaignTime : undefined,
            campaignFrequency: (propsObj.step4 && propsObj.step4.campaignFrequency) ? propsObj.step4.campaignFrequency : undefined,
            startTime: (propsObj.step4 && propsObj.step4.startTime) ? propsObj.step4.startTime : undefined,
            endTime: (propsObj.step4 && propsObj.step4.endTime) ? propsObj.step4.endTime : undefined,
            rangePicker: undefined,
            timeZone: (propsObj.step4 && propsObj.step4.timeZone) ? propsObj.step4.timeZone : undefined,
        }
    });
    const [campaignForm] = Form.useForm();
    campaignForm.setFieldsValue(currentFormValues);

    const nextState = () => {
        setCurrent(current + 1);
    };

    const prevState = () => {
        setCurrent(current - 1);
    };
    const onStepChange = (current: number) => {
        setCurrent(current);
    };
    const radioStyle = {
        display: 'block',
        height: '30px',
        lineHeight: '30px',
    };
    const {Option} = Select;
    const filterCountryOption = (input: string, option: any) => {
        return option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
    };
    const saveCampaignForm = (values: any) => {
        if (values.step4 && Array.isArray(values.step4.rangePicker)) {
            values.step4.startTime = values.step4.rangePicker[0]._d;
            values.step4.endTime = values.step4.rangePicker[1]._d.getTime();
        }
        currentFormValues.current = {
            step4: values.step4 ? values.step4 : currentFormValues.current.step4,
            step3: values.step3 ? values.step3 : currentFormValues.current.step3,
            step2: values.step2 ? values.step2 : currentFormValues.current.step2,
            step1: values.step1 ? values.step1 : currentFormValues.current.step1
        };
        console.log(currentFormValues);
    };

    const createYourMessageRadio = (radioValue: any) => {
        if (radioValue.target && radioValue.target.value === 'newSegment') {
            history.push("/audience/segments")
        }
    };
    const switchForm = () => {
        switch (current) {
            case 0: {
                return <>
                    <Form.Item label="Campaign Name" name={['step1', 'name']}
                               tooltip="This is a required field">
                        <Input style={{width: '50%'}} placeholder="Eg: Sales Campaign"/>
                    </Form.Item>
                    <Form.Item label="Campaign Type" name={['step1', 'campaignType']}>
                        <Radio.Group>
                            <Radio style={radioStyle} value='emailCampaign'>Email Campaign</Radio>
                            <Radio style={radioStyle} value='testingCampaign'>A/B Testing Campaign</Radio>
                        </Radio.Group>
                    </Form.Item>
                    <Form.Item label="Select Sender" name={['step1', 'sender']}>
                        <Select style={{width: '50%'}} showSearch placeholder="Select Sender"
                                optionFilterProp="children"
                                filterOption={(input, option) => filterCountryOption(input, option)}>
                            <Option value="ind">India</Option>
                            <Option value="usa">United States</Option>
                            <Option value="uk">United Kingdom</Option>
                        </Select>
                    </Form.Item>
                </>
            }
            case 1: {
                return <>
                    <Form.Item label="Segment" name={['step2', 'segment']}>
                        <Radio.Group onChange={createYourMessageRadio}>
                            <Radio value='existingSegment'>Use Existing segment</Radio>
                            <Radio.Button value='newSegment'>Create New Segment</Radio.Button>
                        </Radio.Group>
                    </Form.Item>
                    <Form.Item label="Select Sender" name={['step2', 'segmentType']}>
                        <Select style={{width: '50%'}} showSearch placeholder="Select Sender"
                                optionFilterProp="children"
                                filterOption={(input, option) => filterCountryOption(input, option)}>
                            <Option value="ind">India</Option>
                            <Option value="usa">United States</Option>
                            <Option value="uk">United Kingdom</Option>
                        </Select>
                    </Form.Item>
                    <Form.Item label="Segment hold-out (Optional)" name={['step2', 'segmentHoldOut']}
                               tooltip="Percentage of customers in the segment that won't receive emails">
                        <Input type={'number'} style={{width: '50%'}} placeholder="Percentage"/>
                    </Form.Item>
                </>
            }
            case 2: {
                return <>
                    <Form.Item label="Campaign Type" name={['step3', 'segmentType']}>
                        <Radio.Group onChange={createYourMessageRadio}>
                            <Radio value='emailCampaign'>Use Existing template</Radio>
                            <Radio.Button value='testingCampaign'>Create New Template</Radio.Button>
                        </Radio.Group>
                    </Form.Item>
                    <Form.Item label="Select Template" name={['step3', 'emailTemplate']}>
                        <Select style={{width: '50%'}} showSearch placeholder="Welcome Email Template"
                                optionFilterProp="children"
                                filterOption={(input, option) => filterCountryOption(input, option)}>
                            <Option value="ind">India</Option>
                            <Option value="usa">United States</Option>
                            <Option value="uk">United Kingdom</Option>
                        </Select>
                    </Form.Item>
                </>
            }
            case 3: {
                return <>
                    <Form.Item label="Campaign Time" name={['step4', 'campaignTime']}
                               tooltip="When to send the campaign">
                        <Radio.Group>
                            <Radio value='specificTime'>At a specific time</Radio>
                            <Radio value='eventTrigger'>At event trigger</Radio>
                        </Radio.Group>
                    </Form.Item>
                    <Form.Item label="Campaign Frequency" name={['step4', 'campaignFrequency']}>
                        <Select style={{width: '50%'}} showSearch placeholder="Select Frequency"
                                optionFilterProp="children"
                                filterOption={(input, option) => filterCountryOption(input, option)}>
                            <Option value="weekly">Weekly</Option>
                            <Option value="monthly">Monthly</Option>
                            <Option value="yearly">Yearly</Option>
                        </Select>
                    </Form.Item>
                    <Form.Item label="Time Range" name={['step4', 'rangePicker']}>
                        <RangePicker allowClear bordered format="YYYY-MM-DD hh:mm:ss a"/>
                    </Form.Item>
                    <Form.Item label="Time Zone" name={['step4', 'timeZone']}>
                        <Select style={{width: '50%'}} showSearch placeholder="Select Time Zone"
                                optionFilterProp="children"
                                filterOption={(input, option) => filterCountryOption(input, option)}>
                            <Option value="ist">India-IST</Option>
                            <Option value="gmt">Greenwich-GMT</Option>
                            <Option value="sgt">Singapore-SGT</Option>
                        </Select>
                    </Form.Item>
                </>
            }
        }
    }
    return (
        <div className='amendCampaign pageLayout'>
            <div className='cancelNav'>
                <Button className="deleteBtn" icon={<StepBackwardOutlined/>}
                        onClick={propsObj.routeToOverview}>Cancel</Button>
            </div>
            <div className='screenBifurcation'>
                <Steps current={current} direction={"vertical"} onChange={onStepChange}>
                    {steps.map(item => (
                        <Step icon={item.icon} key={item.key} title={item.title}
                              description={item.content}/>
                    ))}
                </Steps>
                <div className='contentDisplay'>
                    <div className="firstNav">
                        <div className="leftPlacement">
                            <Title level={4}>{steps[current].content}</Title>
                        </div>
                        <div className="rightPlacement">
                            {current > 0 && (
                                <Button className={'prevBtn'} icon={<LeftOutlined/>} style={{margin: '0 8px'}}
                                        onClick={() => prevState()}>
                                    Previous
                                </Button>
                            )}
                            {current === steps.length - 1 && (
                                <Button type="primary" className={'doneBtn'} icon={<CheckOutlined/>}
                                        onClick={() => message.success(currentFormValues.current)}>
                                    Done
                                </Button>
                            )}
                            {current < steps.length - 1 && (
                                <Button className={'nextBtn'} type="primary" icon={<RightOutlined/>}
                                        onClick={() => nextState()}>
                                    Next
                                </Button>
                            )}
                        </div>
                    </div>
                    <div className='formContainer'>
                        <Form onFinish={saveCampaignForm}
                              form={campaignForm}
                              layout="vertical"
                              requiredMark={true}>
                            {switchForm()}
                            <Form.Item>
                                <Button type="primary" htmlType={'submit'}>Save</Button>
                            </Form.Item>
                        </Form>
                    </div>
                </div>
            </div>
        </div>
    );
}