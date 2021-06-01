import React, {useEffect, useRef, useState} from "react";
import {Alert, Button, DatePicker, Form, Input, message, Radio, Select, Space, Steps, Switch, Tabs} from 'antd';
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
    const [showAlertIcon, setShowAlertIcon] = useState(false);

    const getRangeAsMoment = (rangePickerData: any) => {
        let serverRangePicker = rangePickerData;
        if (serverRangePicker) {
            return [moment(serverRangePicker[0]), moment(serverRangePicker[1])];
        }
    }

    useEffect(() => {
        campaignForm.setFieldsValue(currentFormValues.current);
        if (propsObj && propsObj.amendObj) {
            getObjectById(propsObj.amendObj.key, 'campaignsForm').then(async campaignFormAsync => {
                let campaignFormData = await campaignFormAsync.json();
                if (campaignFormData && campaignFormData.campaignData) {
                    let currentCampaignData = campaignFormData.campaignData;
                    if (currentCampaignData.step4) {
                        if (currentCampaignData.step4.tabOne) {
                            let rangeData = getRangeAsMoment(currentCampaignData.step4.tabOne.rangePicker);
                            if (rangeData) {
                                campaignFormData.campaignData.step4.tabOne.rangePicker = rangeData;
                            }
                            setCampaignTime(currentCampaignData.step4.tabOne.campaignTime)
                        }
                        if (currentCampaignData.step4.tabTwo) {
                            let rangeData = getRangeAsMoment(currentCampaignData.step4.tabTwo.rangePicker);
                            if (rangeData) {
                                campaignFormData.campaignData.step4.tabTwo.rangePicker = rangeData;
                            }
                        }
                        if (currentCampaignData.step4.tabThree) {
                            let rangeData = getRangeAsMoment(currentCampaignData.step4.tabThree.rangePicker);
                            if (rangeData) {
                                campaignFormData.campaignData.step4.tabThree.rangePicker = rangeData;
                            }
                        }
                    }
                    currentFormValues.current = currentCampaignData;
                    campaignForm.setFieldsValue(currentCampaignData);
                    if (currentCampaignData.step2.segment === 'existingSegment') {
                        setStep2Segments(true);
                    }
                    setCampaignType(currentCampaignData.step1.campaignType);
                }
            }).catch(reason => {
                message.error(reason).then(() => {
                });
            });
        }
        if (propsObj.amendObj && propsObj.amendObj.openType === 'create') {
            setPageEditRights(true);
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

        getAllServerCall('customEvents').then(async getAllSegmentsAsync => {
            let allCustomEvents = await getAllSegmentsAsync.json();
            let tempData: DropDown[] = [];
            if (allCustomEvents && Array.isArray(allCustomEvents)) {
                allCustomEvents.forEach((itr: any) => {
                    tempData.push({
                        value: itr.id,
                        label: itr.name,
                        children: null
                    });
                });
            }
            setCustomEvents(tempData);
        });
    }, [campaignForm, propsObj]);

    const {Step} = Steps;
    const {RangePicker} = DatePicker;
    const history = useHistory();
    const steps = [
        {
            key: 0,
            title: 'Step 1',
            content: 'Create a campaign',
            icon: <MailOutlined/>
        },
        {
            key: 1,
            title: 'Step 2',
            content: 'Choose a segment',
            icon: <TeamOutlined/>
        },
        {
            key: 2,
            title: 'Step 3',
            content: 'Create your message',
            icon: <HighlightOutlined/>
        },
        {
            key: 3,
            title: 'Step 4',
            content: 'Schedule Campaign',
            icon: <HistoryOutlined/>
        },
        {
            key: 4,
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
            campaignType: undefined,
            sender: undefined
        },
        step2: {
            segment: undefined,
            segmentType: undefined,
            segmentHoldOut: undefined
        },
        step3: {
            tabOne: {
                segmentType: undefined,
                emailTemplate: undefined,
            },
            tabTwo: {
                segmentType: undefined,
                emailTemplate: undefined,
            },
            tabThree: {
                segmentType: undefined,
                emailTemplate: undefined,
            }
        },
        step4: {
            tabOne: {
                campaignTime: undefined,
                campaignFrequency: undefined,
                rangePicker: undefined,
                timeZone: undefined,
                campaignEventTrigger: undefined
            },
            tabTwo: {
                campaignTime: undefined,
                campaignFrequency: undefined,
                rangePicker: undefined,
                timeZone: undefined,
                campaignEventTrigger: undefined
            },
            tabThree: {
                campaignTime: undefined,
                campaignFrequency: undefined,
                rangePicker: undefined,
                timeZone: undefined,
                campaignEventTrigger: undefined
            }
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

    const populateNestedStep = (currentValue: any, oldValue: any) => {
        let tempObj = oldValue;
        if (currentValue) {
            if (currentValue.tabOne) {
                tempObj.tabOne = currentValue.tabOne;
            }
            if (currentValue.tabTwo) {
                tempObj.tabTwo = currentValue.tabTwo;
            }
            if (currentValue.tabThree) {
                tempObj.tabThree = currentValue.tabThree;
            }
        }
        return tempObj;
    }

    const saveCampaignForm = (values: any) => {
        let step4Data = populateNestedStep(values.step4, currentFormValues.current.step4);
        let step3Data = populateNestedStep(values.step3, currentFormValues.current.step3);
        currentFormValues.current = {
            step5: values.step5 ? values.step5 : currentFormValues.current.step5,
            step4: step4Data,
            step3: step3Data,
            step2: values.step2 ? values.step2 : currentFormValues.current.step2,
            step1: values.step1 ? values.step1 : currentFormValues.current.step1
        };
        setShowAlertIcon(true);
        nextState();
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

    const {TabPane} = Tabs;
    const [campaignType, setCampaignType] = useState('emailCampaign');
    const [campaignTime, setCampaignTime] = useState('specificTime');
    const [customEvents, setCustomEvents] = useState<DropDown[]>([]);
    const onCampaignTimeChange = (e: any) => {
        setCampaignTime(e.target.value);
    };
    const step3TabOne =
        <>
            <Form.Item label="Campaign Type" name={['step3', 'tabOne', 'campaignType']}>
                <Radio.Group disabled={!pageEditRights} onChange={createYourMessageRadio}>
                    <Radio value='existingTemplate'>Use Existing template</Radio>
                    <Radio.Button value='newTemplate'>Create New Template</Radio.Button>
                </Radio.Group>
            </Form.Item>
            <Form.Item label="Select Templates" name={['step3', 'tabOne', 'templateType']}>
                <Select disabled={!pageEditRights} style={{width: '50%'}} showSearch
                        placeholder="Welcome Email Template"
                        optionFilterProp="children"
                        filterOption={(input, option) => filterCountryOption(input, option)}>
                    <Option value="ind">India</Option>
                    <Option value="usa">United States</Option>
                    <Option value="uk">United Kingdom</Option>
                </Select>
            </Form.Item>
        </>;

    const step3TabTwo =
        <>
            <Form.Item label="Campaign Type" name={['step3', 'tabTwo', 'campaignType']}>
                <Radio.Group disabled={!pageEditRights} onChange={createYourMessageRadio}>
                    <Radio value='existingTemplate'>Use Existing template</Radio>
                    <Radio.Button value='newTemplate'>Create New Template</Radio.Button>
                </Radio.Group>
            </Form.Item>
            <Form.Item label="Select Templates" name={['step3', 'tabTwo', 'templateType']}>
                <Select disabled={!pageEditRights} style={{width: '50%'}} showSearch
                        placeholder="Welcome Email Template"
                        optionFilterProp="children"
                        filterOption={(input, option) => filterCountryOption(input, option)}>
                    <Option value="ind">India</Option>
                    <Option value="usa">United States</Option>
                    <Option value="uk">United Kingdom</Option>
                </Select>
            </Form.Item>
        </>;

    const step3TabThree =
        <>
            <Form.Item label="Campaign Type" name={['step3', 'tabThree', 'campaignType']}>
                <Radio.Group disabled={!pageEditRights} onChange={createYourMessageRadio}>
                    <Radio value='existingTemplate'>Use Existing template</Radio>
                    <Radio.Button value='newTemplate'>Create New Template</Radio.Button>
                </Radio.Group>
            </Form.Item>
            <Form.Item label="Select Templates" name={['step3', 'tabThree', 'templateType']}>
                <Select disabled={!pageEditRights} style={{width: '50%'}} showSearch
                        placeholder="Welcome Email Template"
                        optionFilterProp="children"
                        filterOption={(input, option) => filterCountryOption(input, option)}>
                    <Option value="ind">India</Option>
                    <Option value="usa">United States</Option>
                    <Option value="uk">United Kingdom</Option>
                </Select>
            </Form.Item>
        </>;

    const step4TabOne = <>
        <Form.Item label="Campaign Time" name={['step4', 'tabOne', 'campaignTime']}
                   tooltip="When to send the campaign">
            <Radio.Group disabled={!pageEditRights} onChange={onCampaignTimeChange}>
                <Radio value='specificTime'>At a specific time</Radio>
                <Radio value='eventTrigger'>At event trigger</Radio>
            </Radio.Group>
        </Form.Item>
        {campaignTime === 'specificTime' ? <>
                <Form.Item label="Campaign Frequency" name={['step4', 'tabOne', 'campaignFrequency']}>
                    <Select disabled={!pageEditRights} style={{width: '50%'}} showSearch
                            placeholder="Select Frequency"
                            optionFilterProp="children"
                            filterOption={(input, option) => filterCountryOption(input, option)}>
                        <Option value="weekly">Weekly</Option>
                        <Option value="monthly">Monthly</Option>
                        <Option value="yearly">Yearly</Option>
                    </Select>
                </Form.Item>
                <Form.Item label="Time Range" name={['step4', 'tabOne', 'rangePicker']}>
                    <RangePicker disabled={!pageEditRights} allowClear bordered format="MMMM Do YYYY, h:mm:ss a"/>
                </Form.Item>
                <Form.Item label="Time Zone" name={['step4', 'tabOne', 'timeZone']}>
                    <Select disabled={!pageEditRights} style={{width: '50%'}} showSearch
                            placeholder="Select Time Zone"
                            optionFilterProp="children"
                            filterOption={(input, option) => filterCountryOption(input, option)}>
                        <Option value="ist">India-IST</Option>
                        <Option value="gmt">Greenwich-GMT</Option>
                        <Option value="sgt">Singapore-SGT</Option>
                    </Select>
                </Form.Item>
            </> :
            <Form.Item label="Custom Event" name={['step4', 'tabOne', 'campaignEventTrigger']}>
                <Select disabled={!pageEditRights} style={{width: '50%'}} showSearch
                        placeholder="Select Event"
                        optionFilterProp="children"
                        filterOption={(input, option) => filterCountryOption(input, option)}>
                    {customEvents.map((value) => <Option key={value.value} value={value.label}>{value.label}</Option>)}
                </Select>
            </Form.Item>}

    </>;

    const step4TabTwo = <>
        <Form.Item label="Campaign Time" name={['step4', 'tabTwo', 'campaignTime']}
                   tooltip="When to send the campaign">
            <Radio.Group disabled={!pageEditRights}>
                <Radio value='specificTime'>At a specific time</Radio>
                <Radio value='eventTrigger'>At event trigger</Radio>
            </Radio.Group>
        </Form.Item>
        <Form.Item label="Campaign Frequency" name={['step4', 'tabTwo', 'campaignFrequency']}>
            <Select disabled={!pageEditRights} style={{width: '50%'}} showSearch
                    placeholder="Select Frequency"
                    optionFilterProp="children"
                    filterOption={(input, option) => filterCountryOption(input, option)}>
                <Option value="weekly">Weekly</Option>
                <Option value="monthly">Monthly</Option>
                <Option value="yearly">Yearly</Option>
            </Select>
        </Form.Item>
        <Form.Item label="Time Range" name={['step4', 'tabTwo', 'rangePicker']}>
            <RangePicker disabled={!pageEditRights} allowClear bordered format="MMMM Do YYYY, h:mm:ss a"/>
        </Form.Item>
        <Form.Item label="Time Zone" name={['step4', 'tabTwo', 'timeZone']}>
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
    const step4TabThree = <>
        <Form.Item label="Campaign Time" name={['step4', 'tabThree', 'campaignTime']}
                   tooltip="When to send the campaign">
            <Radio.Group disabled={!pageEditRights}>
                <Radio value='specificTime'>At a specific time</Radio>
                <Radio value='eventTrigger'>At event trigger</Radio>
            </Radio.Group>
        </Form.Item>
        <Form.Item label="Campaign Frequency" name={['step4', 'tabThree', 'campaignFrequency']}>
            <Select disabled={!pageEditRights} style={{width: '50%'}} showSearch
                    placeholder="Select Frequency"
                    optionFilterProp="children"
                    filterOption={(input, option) => filterCountryOption(input, option)}>
                <Option value="weekly">Weekly</Option>
                <Option value="monthly">Monthly</Option>
                <Option value="yearly">Yearly</Option>
            </Select>
        </Form.Item>
        <Form.Item label="Time Range" name={['step4', 'tabThree', 'rangePicker']}>
            <RangePicker disabled={!pageEditRights} allowClear bordered format="MMMM Do YYYY, h:mm:ss a"/>
        </Form.Item>
        <Form.Item label="Time Zone" name={['step4', 'tabThree', 'timeZone']}>
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


    const switchForm = () => {
        switch (current) {
            case 0: {
                return <>
                    <Form.Item label="Campaign Name" name={['step1', 'name']}
                               tooltip="This is a required field">
                        <Input style={{width: '50%'}} disabled={!pageEditRights} placeholder="Eg: Sales Campaign"/>
                    </Form.Item>
                    <Form.Item label="Campaign Type" name={['step1', 'campaignType']}>
                        <Radio.Group disabled={!pageEditRights} onChange={(e) => setCampaignType(e.target.value)}>
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
                    <Tabs key={'step2'} defaultActiveKey="1">
                        <TabPane tab="Variant 1 Options" key="s2TabOne">
                            {step3TabOne}
                        </TabPane>
                        {campaignType === 'testingCampaign' ?
                            <>
                                <TabPane tab="Variant 2 Options" key="s2TabTwo">
                                    {step3TabTwo}
                                </TabPane>
                                <TabPane tab="Variant 3 Options" key="s2TabThree">
                                    {step3TabThree}
                                </TabPane>
                            </> : null}
                    </Tabs>
                </>
            }
            case 3: {
                return <>
                    <Tabs key={'step3'} defaultActiveKey="1">
                        <TabPane tab="Variant 1 Options" key="s3TabOne">
                            {step4TabOne}
                        </TabPane>
                        {campaignType === 'testingCampaign' ?
                            <>
                                <TabPane tab="Variant 2 Options" key="s3TabTwo">
                                    {step4TabTwo}
                                </TabPane>
                                <TabPane tab="Variant 3 Options" key="s3TabThree">
                                    {step4TabThree}
                                </TabPane>
                            </> : null}
                    </Tabs>
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
        console.log(currentFormValues.current);
        editObjectById({
            campaignData: currentFormValues.current,
            id: propsObj.amendObj.key
        }, 'campaignsForm').then(async editCampaignAsync => {
            let editCampaignRes = editCampaignAsync.json();
            if (editCampaignRes) {
                message.success("Campaign Data successfully saved", 0.6);
            }
        });
        if (currentFormValues.current.step1 && currentFormValues.current.step1.name !== propsObj.amendObj.name) {
            editObjectById({
                status: propsObj.amendObj.status,
                id: propsObj.amendObj.id,
                name: currentFormValues.current.step1.name
            }, 'campaigns').then(async editCampaignAsync => {
                let editCampaignRes = await editCampaignAsync.json();
                if (editCampaignRes) {
                    console.log('Campaign name has been updated');
                }
            });
        }
    };

    return (
        <div className='amendCampaign pageLayout'>
            {showAlertIcon && pageEditRights ? <Alert closeText="Close Now" style={{marginBottom: 6}}
                                                      message="Campaign Data cached, please click Done button at Step 5 to save your changes"
                                                      banner={true}
                                                      closable afterClose={() => setShowAlertIcon(false)}
            /> : null}
            <div className='cancelNav'>
                <Button className="deleteBtn" icon={<StepBackwardOutlined/>}
                        onClick={propsObj.routeToOverview}>Cancel</Button>
            </div>
            <div className='screenBifurcation'>
                <div className="antSteps">
                    <Steps current={current} direction={"vertical"} onChange={onStepChange} >
                        {steps.map(item => (
                            <Step icon={item.icon} key={item.key} title={item.title}
                                  description={item.content}/>
                        ))}
                    </Steps>
                </div>
                <div className='contentDisplay'>
                    <Form onFinish={saveCampaignForm}
                          form={campaignForm}
                          layout="vertical"
                          requiredMark={true}>
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
                                            htmlType={'submit'}>
                                        Next
                                    </Button>
                                )}
                            </div>
                        </div>
                        <div className='formContainer'>
                            {switchForm()}
                            {pageEditRights ? <Form.Item/> : null}
                        </div>
                    </Form>
                </div>
            </div>
        </div>
    );
}
