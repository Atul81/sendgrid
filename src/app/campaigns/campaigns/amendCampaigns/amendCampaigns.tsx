import React, {useEffect, useRef, useState} from "react";
import {Alert, Button, DatePicker, Form, Input, message, Radio, Select, Space, Steps, Switch, Tabs, Tag} from 'antd';
import './amendCampaigns.scss';
import {
    CheckOutlined,
    CompassOutlined,
    DeleteFilled,
    HighlightOutlined,
    HistoryOutlined,
    LeftOutlined,
    MailOutlined,
    PlusCircleFilled,
    PlusOutlined,
    RightOutlined,
    StepBackwardOutlined,
    TeamOutlined
} from "@ant-design/icons";
import Title from "antd/es/typography/Title";
import {editObjectById, getAllServerCall, getObjectById} from "../../../../service/serverCalls/mockServerRest";
import {DropDown} from "../../../../utils/Interfaces";
import moment from "moment";
import Paragraph from "antd/es/typography/Paragraph";
import {GET_SERVER_ERROR, PUT_SERVER_ERROR} from "../../../../utils/common";
import {useHistory} from "react-router-dom";

export const AmendCampaignsPage: any = (propsObj: any) => {
    const [campaignForm] = Form.useForm();

    const {Step} = Steps;

    const history = useHistory();

    const {RangePicker} = DatePicker;

    const [pageEditRights, setPageEditRights] = useState(propsObj.amendObj.openType === 'edit');

    const [showAlertIcon, setShowAlertIcon] = useState(false);

    const getRangeAsMoment = (rangePickerData: any) => {
        let serverRangePicker = rangePickerData;
        if (serverRangePicker) {
            return [moment(serverRangePicker[0]), moment(serverRangePicker[1])];
        }
    };

    const populateStep4Tabs = (campaignFormData: any) => {
        let rangeData = getRangeAsMoment(campaignFormData.rangePicker);
        if (rangeData) {
            campaignFormData.rangePicker = rangeData;
        }
    };

    const populateEmptyObj = (campaignFormData: any, tabCount: string) => {
        campaignFormData[tabCount] = currentFormValues.current.step4[tabCount];
        campaignFormData[tabCount].campaignTime = 'specificTime';
    }

    useEffect(() => {
        campaignForm.setFieldsValue(currentFormValues.current);
        if (propsObj && propsObj.amendObj) {
            getObjectById(propsObj.amendObj.key, 'campaignsForm').then(async campaignFormAsync => {
                let campaignFormData = await campaignFormAsync.json();
                if (campaignFormData && campaignFormData.campaignData) {
                    let currentCampaignData = campaignFormData.campaignData;
                    if (currentCampaignData.step4) {
                        currentCampaignData.step4.tabOne ? populateStep4Tabs(currentCampaignData.step4.tabOne) : populateEmptyObj(currentCampaignData.step4, 'tabOne');
                        currentCampaignData.step4.tabTwo ? populateStep4Tabs(currentCampaignData.step4.tabTwo) : populateEmptyObj(currentCampaignData.step4, 'tabTwo');
                        currentCampaignData.step4.tabThree ? populateStep4Tabs(currentCampaignData.step4.tabThree) : populateEmptyObj(currentCampaignData.step4, 'tabThree');
                        currentCampaignData.step4.tabFour ? populateStep4Tabs(currentCampaignData.step4.tabFour) : populateEmptyObj(currentCampaignData.step4, 'tabFour');
                        currentCampaignData.step4.tabFive ? populateStep4Tabs(currentCampaignData.step4.tabFive) : populateEmptyObj(currentCampaignData.step4, 'tabFive');
                    }
                    if (currentCampaignData.step1.campaignType === 'testingCampaign' && currentCampaignData.step2.treatments) {
                        setTreatmentCount(Object.keys(currentCampaignData.step2.treatments).length);
                    } else {
                        setTreatmentCount(1);
                    }
                    currentFormValues.current = currentCampaignData;
                    campaignForm.setFieldsValue(currentCampaignData);
                    setCampaignType(currentCampaignData.step1.campaignType);
                }
            }).catch(reason => {
                console.log(reason);
                message.error(GET_SERVER_ERROR, 0.8).then(() => {
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
        }).catch(reason => {
            console.log(reason);
            message.error('Unable to fetch segments data', 0.8).then(() => {
            });
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
        }).catch(reason => {
            console.log(reason);
            message.error('Unable to fetch events data', 0.8).then(() => {
            });
        });

        getAllServerCall('templates').then(async getAllTemplatesAsync => {
            let allExistingTemplates = await getAllTemplatesAsync.json();
            let tempData: DropDown[] = [];
            if (allExistingTemplates && Array.isArray(allExistingTemplates)) {
                allExistingTemplates.forEach((itr: any) => {
                    tempData.push({
                        value: itr.id,
                        label: itr.title,
                        children: null
                    });
                });
            }
            setExistingTemplates(tempData);
        }).catch(reason => {
            console.log(reason);
            message.error('Unable to fetch templates data', 0.8).then(() => {
            });
        });
    }, []);

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

    const currentFormValues = useRef({
        step1: {
            name: (propsObj.amendObj && propsObj.amendObj.name) ? propsObj.amendObj.name : undefined,
            campaignType: undefined,
            sender: undefined
        },
        step2: {
            segment: undefined,
            segmentType: undefined,
            segmentHoldOut: undefined,
            treatments: undefined
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
            },
            tabFour: {
                segmentType: undefined,
                emailTemplate: undefined,
            },
            tabFive: {
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
            },
            tabFour: {
                campaignTime: undefined,
                campaignFrequency: undefined,
                rangePicker: undefined,
                timeZone: undefined,
                campaignEventTrigger: undefined
            },
            tabFive: {
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
            } else {
                tempObj.tabOne = undefined
            }
            if (currentValue.tabTwo) {
                tempObj.tabTwo = currentValue.tabTwo;
            } else if (treatmentCount < 2) {
                tempObj.tabTwo = undefined
            }
            if (currentValue.tabThree) {
                tempObj.tabThree = currentValue.tabThree;
            } else if (treatmentCount < 3) {
                tempObj.tabThree = undefined
            }
            if (currentValue.tabFour) {
                tempObj.tabFour = currentValue.tabFour;
            } else if (treatmentCount < 4) {
                tempObj.tabFour = undefined
            }
            if (currentValue.tabFive) {
                tempObj.tabFive = currentValue.tabFive;
            } else if (treatmentCount < 5) {
                tempObj.tabFive = undefined
            }
        }
        return tempObj;
    }

    const saveCampaignForm = (values: any) => {
        let step4Data = populateNestedStep(values.step4, currentFormValues.current.step4);
        let step3Data = populateNestedStep(values.step3, currentFormValues.current.step3);
        let step2Data = (values.step2 ? values.step2 : currentFormValues.current.step2)
        if (values.step2 && campaignType === 'testingCampaign') {
            let treatmentValueSum: number = 0;
            let treatmentObj = {};
            Object.keys(treatmentValues).forEach((value, index) => {
                if (index < treatmentCount) {
                    treatmentValueSum += parseInt(treatmentValues[value], 10);
                    treatmentObj = {...treatmentObj, [value]: treatmentValues[value]}
                }
            });
            if (treatmentValueSum !== 100) {
                message.error("Total template sum count should not exceed 100").then(() => {
                });
            } else {
                step2Data = {...step2Data, treatments: treatmentObj};
                setShowAlertIcon(true);
                nextState();
            }
        } else {
            setShowAlertIcon(true);
            nextState();
        }
        currentFormValues.current = {
            step5: values.step5 ? values.step5 : currentFormValues.current.step5,
            step4: step4Data,
            step3: step3Data,
            step2: step2Data,
            step1: values.step1 ? values.step1 : currentFormValues.current.step1
        };
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
    const [customEvents, setCustomEvents] = useState<DropDown[]>([]);
    const [existingTemplates, setExistingTemplates] = useState<DropDown[]>([]);

    const step3TreatmentMap = {
        1: <div key={1} className='abFirstNav'>
            <div className='existingOptions'>
                <Form.Item label={<strong>Select Templates</strong>} name={['step3', 'tabOne', 'templateType']}>
                    <Select disabled={!pageEditRights} className='formItemWidth' showSearch
                            placeholder="Welcome Email Template"
                            optionFilterProp="children"
                            filterOption={(input, option) => filterCountryOption(input, option)}>
                        {existingTemplates.map(itr => {
                            return <Option key={itr.value} value={itr.label}>{itr.label}</Option>
                        })}
                    </Select>
                </Form.Item>
            </div>
            <div className='orContent'>
                <Paragraph>(or)</Paragraph>
            </div>
            <div className='createNew'>
                <Button disabled={!pageEditRights} type={'dashed'} icon={<PlusOutlined/>}
                        onClick={() => history.push('/templates/templates')} key={'newSeg'}>Create New
                    Template</Button>
            </div>
        </div>,

        2: <div key={2} className='abFirstNav'>
            <div className='existingOptions'>
                <Form.Item label={<strong>Select Templates</strong>} name={['step3', 'tabTwo', 'templateType']}>
                    <Select disabled={!pageEditRights} className='formItemWidth' showSearch
                            placeholder="Welcome Email Template"
                            optionFilterProp="children"
                            filterOption={(input, option) => filterCountryOption(input, option)}>
                        {existingTemplates.map(itr => {
                            return <Option key={itr.value} value={itr.label}>{itr.label}</Option>
                        })}
                    </Select>
                </Form.Item>
            </div>
            <div className='orContent'>
                <Paragraph>(or)</Paragraph>
            </div>
            <div className='createNew'>
                <Button disabled={!pageEditRights} type={'dashed'} icon={<PlusOutlined/>}
                        onClick={() => history.push('/templates/templates')} key={'newSeg'}>Create New
                    Template</Button>
            </div>
        </div>,
        3: <div key={3} className='abFirstNav'>
            <div className='existingOptions'>
                <Form.Item label={<strong>Select Templates</strong>} name={['step3', 'tabThree', 'templateType']}>
                    <Select disabled={!pageEditRights} className='formItemWidth' showSearch
                            placeholder="Welcome Email Template"
                            optionFilterProp="children"
                            filterOption={(input, option) => filterCountryOption(input, option)}>
                        {existingTemplates.map(itr => {
                            return <Option key={itr.value} value={itr.label}>{itr.label}</Option>
                        })}
                    </Select>
                </Form.Item>
            </div>
            <div className='orContent'>
                <Paragraph>(or)</Paragraph>
            </div>
            <div className='createNew'>
                <Button disabled={!pageEditRights} type={'dashed'} icon={<PlusOutlined/>}
                        onClick={() => history.push('/templates/templates')} key={'newSeg'}>Create New
                    Template</Button>
            </div>
        </div>,
        4: <div key={4} className='abFirstNav'>
            <div className='existingOptions'>
                <Form.Item label={<strong>Select Templates</strong>} name={['step3', 'tabFour', 'templateType']}>
                    <Select disabled={!pageEditRights} className='formItemWidth' showSearch
                            placeholder="Welcome Email Template"
                            optionFilterProp="children"
                            filterOption={(input, option) => filterCountryOption(input, option)}>
                        {existingTemplates.map(itr => {
                            return <Option key={itr.value} value={itr.label}>{itr.label}</Option>
                        })}
                    </Select>
                </Form.Item>
            </div>
            <div className='orContent'>
                <Paragraph>(or)</Paragraph>
            </div>
            <div className='createNew'>
                <Button disabled={!pageEditRights} type={'dashed'} icon={<PlusOutlined/>}
                        onClick={() => history.push('/templates/templates')} key={'newSeg'}>Create New
                    Template</Button>
            </div>
        </div>,
        5: <div key={5} className='abFirstNav'>
            <div className='existingOptions'>
                <Form.Item label={<strong>Select Templates</strong>} name={['step3', 'tabFive', 'templateType']}>
                    <Select disabled={!pageEditRights} className='formItemWidth' showSearch
                            placeholder="Welcome Email Template"
                            optionFilterProp="children"
                            filterOption={(input, option) => filterCountryOption(input, option)}>
                        {existingTemplates.map(itr => {
                            return <Option key={itr.value} value={itr.label}>{itr.label}</Option>
                        })}
                    </Select>
                </Form.Item>
            </div>
            <div className='orContent'>
                <Paragraph>(or)</Paragraph>
            </div>
            <div className='createNew'>
                <Button disabled={!pageEditRights} type={'dashed'} icon={<PlusOutlined/>}
                        onClick={() => history.push('/templates/templates')} key={'newSeg'}>Create New
                    Template</Button>
            </div>
        </div>
    }
    const [treatmentCount, setTreatmentCount] = useState(1);

    const [campaignTime, setCampaignTime] = useState(undefined);
    const [step4Tab, setStep4Tab] = useState(1)
    const changeCampaign = (e: any, tabCall: string) => {
        setCampaignTime(e.target.value);
        currentFormValues.current.step4[tabCall].campaignTime = e.target.value;
    };

    useEffect(() => {
        setCampaignTime(undefined);
    }, [campaignTime, currentFormValues.current.step4, step4Tab]);

    const changeStep4Tab = (param: any) => {
        setStep4Tab(param);
    };

    const step4TreatmentMap = {
        1: <div key={1}>
            <Form.Item label={<strong>Campaign Time</strong>} name={['step4', 'tabOne', 'campaignTime']}
                       tooltip="When to send the campaign">
                <Radio.Group disabled={!pageEditRights} onChange={(e) => changeCampaign(e, 'tabOne')}>
                    <Radio value='specificTime'>At a specific time</Radio>
                    <Radio value='eventTrigger'>At event trigger</Radio>
                </Radio.Group>
            </Form.Item>
            {currentFormValues.current.step4.tabOne.campaignTime === 'specificTime' ? <>
                    <Form.Item label={<strong>Campaign Frequency</strong>} name={['step4', 'tabOne', 'campaignFrequency']}>
                        <Select disabled={!pageEditRights} className='formItemWidth' showSearch
                                placeholder="Select Frequency"
                                optionFilterProp="children"
                                filterOption={(input, option) => filterCountryOption(input, option)}>
                            <Option value="weekly">Weekly</Option>
                            <Option value="monthly">Monthly</Option>
                            <Option value="yearly">Yearly</Option>
                        </Select>
                    </Form.Item>
                    <Form.Item label={<strong>Time Range</strong>} name={['step4', 'tabOne', 'rangePicker']}>
                        <RangePicker disabled={!pageEditRights} allowClear bordered format="MMMM Do YYYY, h:mm:ss a"/>
                    </Form.Item>
                    <Form.Item label={<strong>Time Zone</strong>} name={['step4', 'tabOne', 'timeZone']}>
                        <Select disabled={!pageEditRights} className='formItemWidth' showSearch
                                placeholder="Select Time Zone"
                                optionFilterProp="children"
                                filterOption={(input, option) => filterCountryOption(input, option)}>
                            <Option value="ist">India-IST</Option>
                            <Option value="gmt">Greenwich-GMT</Option>
                            <Option value="sgt">Singapore-SGT</Option>
                        </Select>
                    </Form.Item>
                </> :
                <Form.Item label={<strong>Campaign Event</strong>} name={['step4', 'tabOne', 'campaignEventTrigger']}>
                    <Select disabled={!pageEditRights} className='formItemWidth' showSearch
                            placeholder="Select Event"
                            optionFilterProp="children"
                            filterOption={(input, option) => filterCountryOption(input, option)}>
                        {customEvents.map((value) => <Option key={value.value}
                                                             value={value.label}>{value.label}</Option>)}
                    </Select>
                </Form.Item>}
        </div>,

        2: treatmentCount >= 2 ? <div key={2}>
            <Form.Item label={<strong>Campaign Time</strong>} name={['step4', 'tabTwo', 'campaignTime']}
                       tooltip="When to send the campaign">
                <Radio.Group disabled={!pageEditRights} onChange={(e) => changeCampaign(e, 'tabTwo')}>
                    <Radio value='specificTime'>At a specific time</Radio>
                    <Radio value='eventTrigger'>At event trigger</Radio>
                </Radio.Group>
            </Form.Item>
            {currentFormValues.current.step4.tabTwo.campaignTime === 'specificTime' ? <>
                    <Form.Item label={<strong>Campaign Frequency</strong>} name={['step4', 'tabTwo', 'campaignFrequency']}>
                        <Select disabled={!pageEditRights} className='formItemWidth' showSearch
                                placeholder="Select Frequency"
                                optionFilterProp="children"
                                filterOption={(input, option) => filterCountryOption(input, option)}>
                            <Option value="weekly">Weekly</Option>
                            <Option value="monthly">Monthly</Option>
                            <Option value="yearly">Yearly</Option>
                        </Select>
                    </Form.Item>
                    <Form.Item label={<strong>Time Range</strong>} name={['step4', 'tabTwo', 'rangePicker']}>
                        <RangePicker disabled={!pageEditRights} allowClear bordered format="MMMM Do YYYY, h:mm:ss a"/>
                    </Form.Item>
                    <Form.Item label={<strong>Time Zone</strong>} name={['step4', 'tabTwo', 'timeZone']}>
                        <Select disabled={!pageEditRights} className='formItemWidth' showSearch
                                placeholder="Select Time Zone"
                                optionFilterProp="children"
                                filterOption={(input, option) => filterCountryOption(input, option)}>
                            <Option value="ist">India-IST</Option>
                            <Option value="gmt">Greenwich-GMT</Option>
                            <Option value="sgt">Singapore-SGT</Option>
                        </Select>
                    </Form.Item>
                </> :
                <Form.Item label={<strong>Campaign Event</strong>} name={['step4', 'tabTwo', 'campaignEventTrigger']}>
                    <Select disabled={!pageEditRights} className='formItemWidth' showSearch
                            placeholder="Select Event"
                            optionFilterProp="children"
                            filterOption={(input, option) => filterCountryOption(input, option)}>
                        {customEvents.map((value) => <Option key={value.value}
                                                             value={value.label}>{value.label}</Option>)}
                    </Select>
                </Form.Item>}
        </div> : null,
        3: treatmentCount >= 3 ? <div key={3}>
            <Form.Item label={<strong>Campaign Time</strong>} name={['step4', 'tabThree', 'campaignTime']}
                       tooltip="When to send the campaign">
                <Radio.Group disabled={!pageEditRights} onChange={(e) => changeCampaign(e, 'tabThree')}>
                    <Radio value='specificTime'>At a specific time</Radio>
                    <Radio value='eventTrigger'>At event trigger</Radio>
                </Radio.Group>
            </Form.Item>
            {currentFormValues.current.step4.tabThree.campaignTime === 'specificTime' ? <>
                    <Form.Item label={<strong>Campaign Frequency</strong>}
                               name={['step4', 'tabThree', 'campaignFrequency']}>
                        <Select disabled={!pageEditRights} className='formItemWidth' showSearch
                                placeholder="Select Frequency"
                                optionFilterProp="children"
                                filterOption={(input, option) => filterCountryOption(input, option)}>
                            <Option value="weekly">Weekly</Option>
                            <Option value="monthly">Monthly</Option>
                            <Option value="yearly">Yearly</Option>
                        </Select>
                    </Form.Item>
                    <Form.Item label={<strong>Time Range</strong>} name={['step4', 'tabThree', 'rangePicker']}>
                        <RangePicker disabled={!pageEditRights} allowClear bordered format="MMMM Do YYYY, h:mm:ss a"/>
                    </Form.Item>
                    <Form.Item label={<strong>Time Zone</strong>} name={['step4', 'tabThree', 'timeZone']}>
                        <Select disabled={!pageEditRights} className='formItemWidth' showSearch
                                placeholder="Select Time Zone"
                                optionFilterProp="children"
                                filterOption={(input, option) => filterCountryOption(input, option)}>
                            <Option value="ist">India-IST</Option>
                            <Option value="gmt">Greenwich-GMT</Option>
                            <Option value="sgt">Singapore-SGT</Option>
                        </Select>
                    </Form.Item>
                </> :
                <Form.Item label={<strong>Campaign Event</strong>} name={['step4', 'tabThree', 'campaignEventTrigger']}>
                    <Select disabled={!pageEditRights} className='formItemWidth' showSearch
                            placeholder="Select Event"
                            optionFilterProp="children"
                            filterOption={(input, option) => filterCountryOption(input, option)}>
                        {customEvents.map((value) => <Option key={value.value}
                                                             value={value.label}>{value.label}</Option>)}
                    </Select>
                </Form.Item>}
        </div> : null,
        4: treatmentCount >= 4 ? <div key={4}>
            <Form.Item label={<strong>Campaign Time</strong>} name={['step4', 'tabFour', 'campaignTime']}
                       tooltip="When to send the campaign">
                <Radio.Group disabled={!pageEditRights} onChange={(e) => changeCampaign(e, 'tabFour')}>
                    <Radio value='specificTime'>At a specific time</Radio>
                    <Radio value='eventTrigger'>At event trigger</Radio>
                </Radio.Group>
            </Form.Item>
            {currentFormValues.current.step4.tabFour.campaignTime === 'specificTime' ? <>
                    <Form.Item label={<strong>Campaign Frequency</strong>} name={['step4', 'tabFour', 'campaignFrequency']}>
                        <Select disabled={!pageEditRights} className='formItemWidth' showSearch
                                placeholder="Select Frequency"
                                optionFilterProp="children"
                                filterOption={(input, option) => filterCountryOption(input, option)}>
                            <Option value="weekly">Weekly</Option>
                            <Option value="monthly">Monthly</Option>
                            <Option value="yearly">Yearly</Option>
                        </Select>
                    </Form.Item>
                    <Form.Item label={<strong>Time Range</strong>} name={['step4', 'tabFour', 'rangePicker']}>
                        <RangePicker disabled={!pageEditRights} allowClear bordered format="MMMM Do YYYY, h:mm:ss a"/>
                    </Form.Item>
                    <Form.Item label={<strong>Time Zone</strong>} name={['step4', 'tabFour', 'timeZone']}>
                        <Select disabled={!pageEditRights} className='formItemWidth' showSearch
                                placeholder="Select Time Zone"
                                optionFilterProp="children"
                                filterOption={(input, option) => filterCountryOption(input, option)}>
                            <Option value="ist">India-IST</Option>
                            <Option value="gmt">Greenwich-GMT</Option>
                            <Option value="sgt">Singapore-SGT</Option>
                        </Select>
                    </Form.Item>
                </> :
                <Form.Item label={<strong>Campaign Event</strong>} name={['step4', 'tabFour', 'campaignEventTrigger']}>
                    <Select disabled={!pageEditRights} className='formItemWidth' showSearch
                            placeholder="Select Event"
                            optionFilterProp="children"
                            filterOption={(input, option) => filterCountryOption(input, option)}>
                        {customEvents.map((value) => <Option key={value.value}
                                                             value={value.label}>{value.label}</Option>)}
                    </Select>
                </Form.Item>}
        </div> : null,
        5: treatmentCount === 5 ? <div key={5}>
            <Form.Item label={<strong>Campaign Time</strong>} name={['step4', 'tabFive', 'campaignTime']}
                       tooltip="When to send the campaign">
                <Radio.Group disabled={!pageEditRights} onChange={(e) => changeCampaign(e, 'tabFive')}>
                    <Radio value='specificTime'>At a specific time</Radio>
                    <Radio value='eventTrigger'>At event trigger</Radio>
                </Radio.Group>
            </Form.Item>
            {currentFormValues.current.step4.tabFive.campaignTime === 'specificTime' ? <>
                    <Form.Item label={<strong>Campaign Frequency</strong>} name={['step4', 'tabFive', 'campaignFrequency']}>
                        <Select disabled={!pageEditRights} className='formItemWidth' showSearch
                                placeholder="Select Frequency"
                                optionFilterProp="children"
                                filterOption={(input, option) => filterCountryOption(input, option)}>
                            <Option value="weekly">Weekly</Option>
                            <Option value="monthly">Monthly</Option>
                            <Option value="yearly">Yearly</Option>
                        </Select>
                    </Form.Item>
                    <Form.Item label={<strong>Time Range</strong>} name={['step4', 'tabFive', 'rangePicker']}>
                        <RangePicker disabled={!pageEditRights} allowClear bordered format="MMMM Do YYYY, h:mm:ss a"/>
                    </Form.Item>
                    <Form.Item label={<strong>Time Zone</strong>} name={['step4', 'tabFive', 'timeZone']}>
                        <Select disabled={!pageEditRights} className='formItemWidth' showSearch
                                placeholder="Select Time Zone"
                                optionFilterProp="children"
                                filterOption={(input, option) => filterCountryOption(input, option)}>
                            <Option value="ist">India-IST</Option>
                            <Option value="gmt">Greenwich-GMT</Option>
                            <Option value="sgt">Singapore-SGT</Option>
                        </Select>
                    </Form.Item>
                </> :
                <Form.Item label={<strong>Campaign Event</strong>} name={['step4', 'tabFive', 'campaignEventTrigger']}>
                    <Select disabled={!pageEditRights} className='formItemWidth' showSearch
                            placeholder="Select Event"
                            optionFilterProp="children"
                            filterOption={(input, option) => filterCountryOption(input, option)}>
                        {customEvents.map((value) => <Option key={value.value}
                                                             value={value.label}>{value.label}</Option>)}
                    </Select>
                </Form.Item>}
        </div> : null
    }
    const [treatmentValues, setTreatmentValues] = useState({
        treatmentA: '100',
        treatmentB: '0',
        treatmentC: '0',
        treatmentD: '0',
        treatmentE: '0'
    });

    const treatmentMap = {
        1: 'Treatment A',
        2: 'Treatment B',
        3: 'Treatment C',
        4: 'Treatment D',
        5: 'Treatment E'
    }

    useEffect(() => {
        switch (treatmentCount) {
            case 1: {
                setTreatmentValues({
                    treatmentA: '100',
                    treatmentB: '0',
                    treatmentC: '0',
                    treatmentD: '0',
                    treatmentE: '0'
                });
                break;
            }
            case 2: {
                setTreatmentValues({
                    treatmentA: '50',
                    treatmentB: '50',
                    treatmentC: '0',
                    treatmentD: '0',
                    treatmentE: '0'
                });
                break;
            }
            case 3: {
                setTreatmentValues({
                    treatmentA: '33',
                    treatmentB: '33',
                    treatmentC: '34',
                    treatmentD: '0',
                    treatmentE: '0'
                });
                break;
            }
            case 4: {
                setTreatmentValues({
                    treatmentA: '25',
                    treatmentB: '25',
                    treatmentC: '25',
                    treatmentD: '25',
                    treatmentE: '0'
                });
                break;
            }
            case 5: {
                setTreatmentValues({
                    treatmentA: '20',
                    treatmentB: '20',
                    treatmentC: '20',
                    treatmentD: '20',
                    treatmentE: '20'
                });
                break;
            }
            default:
                throw Error("Case not valid");
        }
    }, [treatmentCount]);
    const addTreatment = () => {
        if (treatmentCount < 5) {
            setTreatmentCount(treatmentCount + 1);
        } else {
            message.warn("Maximum 5 treatments allowed").then(() => {
            });
        }
    };

    const removeTreatment = () => {
        if (treatmentCount > 0) {
            setTreatmentCount(treatmentCount - 1);
        } else {
            message.warn("Maximum 5 treatments allowed").then(() => {
            });
        }
    };
    const switchForm = () => {
        switch (current) {
            case 0: {
                return <>
                    <Form.Item label={<strong>Campaign Name</strong>} name={['step1', 'name']}
                               tooltip="This is a required field">
                        <Input className='formItemWidth' disabled={!pageEditRights} placeholder="Eg: Sales Campaign"/>
                    </Form.Item>
                    <Form.Item label={<strong>Campaign Type</strong>} name={['step1', 'campaignType']}>
                        <Radio.Group disabled={!pageEditRights} onChange={(e) => setCampaignType(e.target.value)}>
                            <Radio style={radioStyle} value='emailCampaign'>Email
                                Campaign</Radio>
                            <Radio style={radioStyle} value='testingCampaign'>A/B Testing
                                Campaign</Radio>
                        </Radio.Group>
                    </Form.Item>
                    <Form.Item label={<strong>Select Sender</strong>} name={['step1', 'sender']}>
                        <Select disabled={!pageEditRights} className='formItemWidth' showSearch
                                placeholder="Select Sender"
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
                    <div className='abFirstNav'>
                        <div className='existingOptions'>
                            <Form.Item label={<strong>Select Segment</strong>} name={['step2', 'segmentType']}>
                                <Select className='formItemWidth' showSearch disabled={!pageEditRights}
                                        placeholder="Select Segment" optionFilterProp="children"
                                        filterOption={(input, option) => filterCountryOption(input, option)}>
                                    {allSegments.map(itr => {
                                        return <Option value={itr.value}>{itr.label}</Option>
                                    })}
                                </Select>
                            </Form.Item>
                        </div>
                        <div className='orContent'>
                            <Paragraph>(or)</Paragraph>
                        </div>
                        <div className='createNew'>
                            <Button disabled={!pageEditRights} type={'dashed'} icon={<PlusOutlined/>}
                                    onClick={() => history.push('/audience/segments')} key={'newSeg'}>Create New
                                Segment</Button>
                        </div>
                    </div>
                    <Form.Item label={<strong>Segment hold-out (Optional)</strong>}
                               name={['step2', 'segmentHoldOut']}
                               tooltip="Percentage of customers in the segment that won't receive emails">
                        <Input disabled={!pageEditRights} type={'number'} className='formItemWidth'
                               placeholder="Percentage"/>
                    </Form.Item>
                    {campaignType === 'testingCampaign' ?
                        <div className='treatmentSection'>
                            <Title level={5}>A/B Test Treatments</Title>
                            <Paragraph>Add up to five treatments for this message, and then specify the percentage of
                                endpoint to add to each treatment</Paragraph>
                            {treatmentCount > 0 ?
                                <div className='treatmentInp' style={{borderColor: 'orange'}}>
                                    <div className='content'>
                                        <Tag color="orange"><Title level={5}>Treatment A</Title> </Tag>
                                        <Input type={'number'} placeholder="Treatment A" disabled={!pageEditRights}
                                               onChange={(e) => setTreatmentValues({
                                                   ...treatmentValues,
                                                   treatmentA: e.target.value
                                               })} value={treatmentValues.treatmentA}/>
                                        {pageEditRights ? <div className='desc'>
                                            <span><strong>%</strong></span>
                                            {treatmentCount > 1 ? <DeleteFilled onClick={removeTreatment}/> : null}
                                            {treatmentCount === 1 ? <PlusCircleFilled onClick={addTreatment}/> : null}
                                        </div> : null}
                                    </div>
                                </div>
                                : null}
                            {treatmentCount > 1 ?
                                <div className='treatmentInp' style={{borderColor: 'blue'}}>
                                    <div className='content'>
                                        <Tag color="blue"><Title level={5}>Treatment B</Title> </Tag>
                                        <Input type={'number'} placeholder="Treatment B" disabled={!pageEditRights}
                                               onChange={(e) => setTreatmentValues({
                                                   ...treatmentValues,
                                                   treatmentB: e.target.value
                                               })} value={treatmentValues.treatmentB}/>
                                        {pageEditRights ? <div className='desc'>
                                            <span><strong>%</strong></span>
                                            {treatmentCount > 1 ? <DeleteFilled onClick={removeTreatment}/> : null}
                                            {treatmentCount === 2 ? <PlusCircleFilled onClick={addTreatment}/> : null}
                                        </div> : null}
                                    </div>
                                </div> : null}
                            {treatmentCount > 2 ?
                                <div className='treatmentInp' style={{borderColor: 'green'}}>
                                    <div className='content'>
                                        <Tag color="green"><Title level={5}>Treatment C</Title> </Tag>
                                        <Input type={'number'} placeholder="Treatment C" disabled={!pageEditRights}
                                               onChange={(e) => setTreatmentValues({
                                                   ...treatmentValues,
                                                   treatmentC: e.target.value
                                               })} value={treatmentValues.treatmentC}/>
                                        {pageEditRights ? <div className='desc'>
                                            <span><strong>%</strong></span>
                                            {treatmentCount > 1 ? <DeleteFilled onClick={removeTreatment}/> : null}
                                            {treatmentCount === 3 ? <PlusCircleFilled onClick={addTreatment}/> : null}
                                        </div> : null}
                                    </div>
                                </div> : null}
                            {treatmentCount > 3 ?
                                <div className='treatmentInp' style={{borderColor: 'burlywood'}}>
                                    <div className='content'>
                                        <Tag color="burlywood"><Title level={5}>Treatment D</Title> </Tag>
                                        <Input type={'number'} placeholder="Treatment D" disabled={!pageEditRights}
                                               onChange={(e) => setTreatmentValues({
                                                   ...treatmentValues,
                                                   treatmentD: e.target.value
                                               })} value={treatmentValues.treatmentD}/>
                                        {pageEditRights ? <div className='desc'>
                                            <span><strong>%</strong></span>
                                            {treatmentCount > 1 ? <DeleteFilled onClick={removeTreatment}/> : null}
                                            {treatmentCount === 4 ? <PlusCircleFilled onClick={addTreatment}/> : null}
                                        </div> : null}
                                    </div>
                                </div> : null}
                            {treatmentCount > 4 ?
                                <div className='treatmentInp' style={{borderColor: 'yellow'}}>
                                    <div className='content'>
                                        <Tag color="yellow"><Title level={5}>Treatment E</Title> </Tag>
                                        <Input type={'number'} placeholder="Treatment E" disabled={!pageEditRights}
                                               onChange={(e) => setTreatmentValues({
                                                   ...treatmentValues,
                                                   treatmentE: e.target.value
                                               })} value={treatmentValues.treatmentE}/>
                                        {pageEditRights ? <div className='desc'>
                                            <span><strong>%</strong></span>
                                            {treatmentCount > 1 ? <DeleteFilled onClick={removeTreatment}/> : null}
                                        </div> : null}
                                    </div>
                                </div> : null}
                        </div> : null}
                </>
            }
            case 2: {
                return <>
                    {campaignType === 'testingCampaign' ?
                        <Tabs key={'step2'} defaultActiveKey="1">
                            {Array.from(Array(treatmentCount + 1).fill(0).map((value, index) => {
                                return <TabPane tab={treatmentMap[index]} key={index}>
                                    {step3TreatmentMap[index]}
                                </TabPane>
                            }))}
                        </Tabs>
                        : step3TreatmentMap[1]}
                </>
            }
            case 3: {
                return <>
                    {campaignType === 'testingCampaign' ?
                        <Tabs key={'step3'} defaultActiveKey="1" onChange={changeStep4Tab}>
                            {Array.from(Array(treatmentCount + 1).fill(0).map((value, index) => {
                                return <TabPane tab={treatmentMap[index]} key={index}>
                                    {step4TreatmentMap[index]}
                                </TabPane>
                            }))}
                        </Tabs> : step4TreatmentMap["1"]}
                </>
            }
            case 4: {
                return <>
                    <Space key={'step5-1'} size={24} style={{display: 'flex', marginBottom: 8}} align="baseline">
                        <Form.Item label={<strong>Max. Messages per End-Point</strong>} name={['step5', 'msgPerEP']}>
                            <Select disabled={!pageEditRights} style={{width: '24vw'}}
                                    placeholder="Select Max Messages">
                                <Option value="1000">1000</Option>
                                <Option value="2000">2000</Option>
                                <Option value="5000">5000</Option>
                            </Select>
                        </Form.Item>
                        <Form.Item label={<strong>Over-ride global Settings</strong>}>
                            <Switch disabled={!pageEditRights}
                                    defaultChecked={currentFormValues.current.step5.overrideMsgPerEPSet}
                                    onChange={(checked) => step5RadioValueChanges(checked, 'overrideMsgPerEPSet')}/>
                        </Form.Item>
                    </Space>
                    <Space key={'step5-2'} size={24} style={{display: 'flex', marginBottom: 8}} align="baseline">
                        <Form.Item label={<strong>Max. Messages per Day per End-Point</strong>}
                                   name={['step5', 'msgPerDayPerEP']}>
                            <Select disabled={!pageEditRights} style={{width: '24vw'}}
                                    placeholder="Select Max Messages">
                                <Option value="1000">1000</Option>
                                <Option value="2000">2000</Option>
                                <Option value="5000">5000</Option>
                            </Select>
                        </Form.Item>
                        <Form.Item label={<strong>Over-ride global Settings</strong>}>
                            <Switch disabled={!pageEditRights}
                                    defaultChecked={currentFormValues.current.step5.overrideMsgPerDayPerEPSet}
                                    onChange={(checked) => step5RadioValueChanges(checked, 'overrideMsgPerDayPerEPSet')}/>
                        </Form.Item>
                    </Space>
                    <Space key={'step5-3'} size={24} style={{display: 'flex', marginBottom: 8}} align="baseline">
                        <Form.Item label={<strong>Max. Campaign Run time (minutes)</strong>}
                                   name={['step5', 'campRunTime']}>
                            <Select disabled={!pageEditRights} style={{width: '24vw'}}
                                    placeholder="Select Max Messages">
                                <Option value="1000">1000</Option>
                                <Option value="2000">2000</Option>
                                <Option value="5000">5000</Option>
                            </Select>
                        </Form.Item>
                        <Form.Item label={<strong>Over-ride global Settings</strong>}>
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
            let editCampaignRes = await editCampaignAsync.json();
            if (editCampaignRes) {
                message.success("Campaign Data successfully saved", 0.6);
            }
        }).catch(reason => {
            console.log(reason);
            message.error(PUT_SERVER_ERROR, 0.8).then(() => {
            });
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
            }).catch(reason => {
                console.log(reason);
                message.error(PUT_SERVER_ERROR, 0.8).then(() => {
                });
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
                    <Steps current={current} direction={"vertical"} onChange={onStepChange}>
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
