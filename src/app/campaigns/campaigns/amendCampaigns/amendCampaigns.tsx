import React, {useEffect, useRef, useState} from "react";
import {Button, DatePicker, Form, Input, message, Radio, Select, Space, Steps, Switch} from 'antd';
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
import {editObjectById, getAllServerCall, getObjectById} from "../../../../service/serverCalls/mockServerRest";
import {DropDown} from "../../../../utils/Interfaces";
import moment from "moment";

export const AmendCampaignsPage: any = (propsObj: any) => {
    const [campaignForm] = Form.useForm();
    const [pageEditRights, setPageEditRights] = useState(propsObj.amendObj.openType === 'edit');

    useEffect(() => {
        campaignForm.setFieldsValue(currentFormValues.current);
        if (propsObj && propsObj.amendObj) {
            getObjectById(propsObj.amendObj.key, 'campaignsForm').then(async campaignFormAsync => {
                let campaignFormData = await campaignFormAsync.json();
                if (campaignFormData && campaignFormData.campaignData) {
                    let currentCampaignData = campaignFormData.campaignData;
                    let serverRangePicker = currentCampaignData.step4.rangePicker;
                    if (serverRangePicker) {
                        campaignFormData.campaignData.step4.rangePicker = [moment(serverRangePicker[0]), moment(serverRangePicker[1])];
                    }
                    currentFormValues.current = currentCampaignData;
                    campaignForm.setFieldsValue(currentCampaignData);
                    if (currentCampaignData.step2.segment === 'existingSegment') {
                        setStep2Segments(true);
                    }
                }
            }).catch(reason => {
                message.error(reason).then(() => {
                });
            });
        }

        getAllServerCall('segments').then(async segmentsRes => {
            let allSegments = await segmentsRes.json();
            let tempData: DropDown[] = [];
            if (allSegments && Array.isArray(allSegments)) {
                allSegments.forEach((itr: any) => {
                    tempData.push({
                        value: itr.id,
                        label: itr.name,
                        children: null
                    });
                });
            }
            setAllSegments(tempData);
        });
    }, [campaignForm, propsObj]);

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
    const [allSegments, setAllSegments] = useState<DropDown[]>([]);
    const [step2ShowSegment, setStep2Segments] = useState(false);
    const currentFormValues = useRef({
        step1: {
            name: (propsObj.amendObj && propsObj.amendObj.name) ? propsObj.amendObj.name : undefined,
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
            rangePicker: undefined,
            timeZone: (propsObj.step4 && propsObj.step4.timeZone) ? propsObj.step4.timeZone : undefined,
        },
        step5: {
            msgPerEP: (propsObj.step5 && propsObj.step5.msgPerEP) ? propsObj.step5.msgPerEP : undefined,
            overrideMsgPerEPSet: (propsObj.step5 && propsObj.step5.overrideMsgPerEPSet) ? propsObj.step5.overrideMsgPerEPSet : undefined,
            msgPerDayPerEP: (propsObj.step5 && propsObj.step5.msgPerDayPerEP) ? propsObj.step5.msgPerDayPerEP : undefined,
            overrideMsgPerDayPerEPSet: (propsObj.step5 && propsObj.step5.overrideMsgPerDayPerEPSet) ? propsObj.step5.overrideMsgPerDayPerEPSet : undefined,
            campRunTime: (propsObj.step5 && propsObj.step5.campRunTime) ? propsObj.step5.campRunTime : undefined,
            overrideCampRunTimeSet: (propsObj.step5 && propsObj.step5.overrideCampRunTimeSet) ? propsObj.step5.overrideCampRunTimeSet : undefined,
        }
    });

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
        currentFormValues.current = {
            step5: values.step5 ? values.step5 : currentFormValues.current.step5,
            step4: values.step4 ? values.step4 : currentFormValues.current.step4,
            step3: values.step3 ? values.step3 : currentFormValues.current.step3,
            step2: values.step2 ? values.step2 : currentFormValues.current.step2,
            step1: values.step1 ? values.step1 : currentFormValues.current.step1
        };
        message.success("Campaign Data cached, please click Done button at Step 5 to save your changes", 0.7).then(() => {
        });
    };

    const createYourMessageRadio = (radioValue: any) => {
        setStep2Segments(false);
        if (radioValue.target && radioValue.target.value === 'newSegment') {
            history.push("/audience/segments");
        } else {
            setStep2Segments(true);
        }
    };

    const step5RadioValueChanges = (checked: boolean, overrideType: string) => {
        if (overrideType === 'overrideMsgPerEPSet') {
            currentFormValues.current.step5.overrideMsgPerEPSet = checked;
        } else if (overrideType === 'overrideMsgPerDayPerEPSet') {
            currentFormValues.current.step5.overrideMsgPerDayPerEPSet = checked
        } else {
            currentFormValues.current.step5.overrideCampRunTimeSet = checked
        }
    };

    const switchForm = () => {
        switch (current) {
            case 0: {
                return <>
                    <Form.Item label="Campaign Name" name={['step1', 'name']}
                               tooltip="This is a required field">
                        <Input style={{width: '50%'}} disabled={true} placeholder="Eg: Sales Campaign"/>
                    </Form.Item>
                    <Form.Item label="Campaign Type" name={['step1', 'campaignType']}>
                        <Radio.Group disabled={!pageEditRights}>
                            <Radio style={radioStyle} value='emailCampaign'>Email
                                Campaign</Radio>
                            <Radio style={radioStyle} value='testingCampaign'>A/B Testing
                                Campaign</Radio>
                        </Radio.Group>
                    </Form.Item>
                    <Form.Item label="Select Sender" name={['step1', 'sender']}>
                        <Select disabled={!pageEditRights} style={{width: '50%'}} showSearch placeholder="Select Sender"
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
                        <Radio.Group disabled={!pageEditRights} onChange={createYourMessageRadio}>
                            <Radio value='existingSegment'>Use Existing segment</Radio>
                            <Radio.Button value='newSegment'>Create New Segment</Radio.Button>
                        </Radio.Group>
                    </Form.Item>
                    {step2ShowSegment ?
                        <Form.Item label="Select Segment" name={['step2', 'segmentType']}>
                            <Select disabled={!pageEditRights} style={{width: '50%'}} showSearch
                                    placeholder="Select Segment"
                                    optionFilterProp="children"
                                    filterOption={(input, option) => filterCountryOption(input, option)}>
                                {allSegments.map(itr => {
                                    return <Option value={itr.value}>{itr.label}</Option>
                                })}
                            </Select>
                        </Form.Item> : null
                    }
                    <Form.Item label="Segment hold-out (Optional)" name={['step2', 'segmentHoldOut']}
                               tooltip="Percentage of customers in the segment that won't receive emails">
                        <Input disabled={!pageEditRights} type={'number'} style={{width: '50%'}}
                               placeholder="Percentage"/>
                    </Form.Item>
                </>
            }
            case 2: {
                return <>
                    <Form.Item label="Campaign Type" name={['step3', 'segmentType']}>
                        <Radio.Group disabled={!pageEditRights} onChange={createYourMessageRadio}>
                            <Radio value='emailCampaign'>Use Existing template</Radio>
                            <Radio.Button value='testingCampaign'>Create New Template</Radio.Button>
                        </Radio.Group>
                    </Form.Item>
                    <Form.Item label="Select Templates" name={['step3', 'emailTemplate']}>
                        <Select disabled={!pageEditRights} style={{width: '50%'}} showSearch
                                placeholder="Welcome Email Template"
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
                        <Radio.Group disabled={!pageEditRights}>
                            <Radio value='specificTime'>At a specific time</Radio>
                            <Radio value='eventTrigger'>At event trigger</Radio>
                        </Radio.Group>
                    </Form.Item>
                    <Form.Item label="Campaign Frequency" name={['step4', 'campaignFrequency']}>
                        <Select disabled={!pageEditRights} style={{width: '50%'}} showSearch
                                placeholder="Select Frequency"
                                optionFilterProp="children"
                                filterOption={(input, option) => filterCountryOption(input, option)}>
                            <Option value="weekly">Weekly</Option>
                            <Option value="monthly">Monthly</Option>
                            <Option value="yearly">Yearly</Option>
                        </Select>
                    </Form.Item>
                    <Form.Item label="Time Range" name={['step4', 'rangePicker']}>
                        <RangePicker disabled={!pageEditRights} allowClear bordered format="MMMM Do YYYY, h:mm:ss a"/>
                    </Form.Item>
                    <Form.Item label="Time Zone" name={['step4', 'timeZone']}>
                        <Select disabled={!pageEditRights} style={{width: '50%'}} showSearch
                                placeholder="Select Time Zone"
                                optionFilterProp="children"
                                filterOption={(input, option) => filterCountryOption(input, option)}>
                            <Option value="ist">India-IST</Option>
                            <Option value="gmt">Greenwich-GMT</Option>
                            <Option value="sgt">Singapore-SGT</Option>
                        </Select>
                    </Form.Item>
                </>
            }
            case 4: {
                return <>
                    <Space key={'step5-1'} size={24} style={{display: 'flex', marginBottom: 8}} align="baseline">
                        <Form.Item label="Max. Messages per End-Point" name={['step5', 'msgPerEP']}>
                            <Select disabled={!pageEditRights} style={{width: '24vw'}}
                                    placeholder="Select Max Messages">
                                <Option value="1000">1000</Option>
                                <Option value="2000">2000</Option>
                                <Option value="5000">5000</Option>
                            </Select>
                        </Form.Item>
                        <Form.Item label="Over-ride global Settings">
                            <Switch disabled={!pageEditRights}
                                    defaultChecked={currentFormValues.current.step5.overrideMsgPerEPSet}
                                    onChange={(checked) => step5RadioValueChanges(checked, 'overrideMsgPerEPSet')}/>
                        </Form.Item>
                    </Space>
                    <Space key={'step5-2'} size={24} style={{display: 'flex', marginBottom: 8}} align="baseline">
                        <Form.Item label="Max. Messages per Day per End-Point" name={['step5', 'msgPerDayPerEP']}>
                            <Select disabled={!pageEditRights} style={{width: '24vw'}}
                                    placeholder="Select Max Messages">
                                <Option value="1000">1000</Option>
                                <Option value="2000">2000</Option>
                                <Option value="5000">5000</Option>
                            </Select>
                        </Form.Item>
                        <Form.Item label="Over-ride global Settings">
                            <Switch disabled={!pageEditRights}
                                    defaultChecked={currentFormValues.current.step5.overrideMsgPerDayPerEPSet}
                                    onChange={(checked) => step5RadioValueChanges(checked, 'overrideMsgPerDayPerEPSet')}/>
                        </Form.Item>
                    </Space>
                    <Space key={'step5-3'} size={24} style={{display: 'flex', marginBottom: 8}} align="baseline">
                        <Form.Item label="Max. Campaign Run time (minutes)" name={['step5', 'campRunTime']}>
                            <Select disabled={!pageEditRights} style={{width: '24vw'}}
                                    placeholder="Select Max Messages">
                                <Option value="1000">1000</Option>
                                <Option value="2000">2000</Option>
                                <Option value="5000">5000</Option>
                            </Select>
                        </Form.Item>
                        <Form.Item label="Over-ride global Settings">
                            <Switch disabled={!pageEditRights}
                                    defaultChecked={currentFormValues.current.step5.overrideCampRunTimeSet}
                                    onChange={(checked) => step5RadioValueChanges(checked, 'overrideCampRunTimeSet')}/>
                        </Form.Item>
                    </Space>
                </>
            }
        }
    };

    const submitCampaignData = () => {
        editObjectById({
            campaignData: currentFormValues.current,
            id: propsObj.amendObj.key
        }, 'campaignsForm').then(async editCampaignAsync => {
            let editCampaignRes = editCampaignAsync.json();
            if (editCampaignRes) {
                message.success("Campaign Data successfully saved", 0.6);
            }
        });
    };

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
                            {pageEditRights && current === steps.length - 1 && (
                                <Button type="primary" className={'submitBtn'} icon={<CheckOutlined/>}
                                        onClick={submitCampaignData}>
                                    Submit
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
                            {pageEditRights ? <Form.Item>
                                <Button type="primary" htmlType={'submit'}>Save</Button>
                            </Form.Item> : null}
                        </Form>
                    </div>
                </div>
            </div>
        </div>
    );
}