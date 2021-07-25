import React, {useEffect, useState} from "react";
import {Button, Divider, Form, Input, message, Select, Space} from "antd";
import Paragraph from "antd/es/typography/Paragraph";
import Title from "antd/es/typography/Title";
import {CheckOutlined, MinusCircleOutlined, PlusOutlined} from "@ant-design/icons";
import {DropDown} from "../../../../../utils/Interfaces";
import {getAllServerCall, getObjectById} from "../../../../../service/serverCalls/mockServerRest";
import {GET_SERVER_ERROR} from "../../../../../utils/common";

export const YesNoSplit = (props: any) => {

    const [yesNoSplitForm] = Form.useForm();
    const {Option} = Select;

    const conditionType: DropDown[] = [
        {value: 'event', label: 'Event', children: null},
        {value: 'segment', label: 'Segment', children: null}];

    const journeyMessage: DropDown[] = [{value: 'unConf', label: 'Unconfigured Message', children: null}];
    const [allEvents, setAllEvents] = useState<DropDown[]>([]);
    const [allSegments, setAllSegments] = useState<DropDown[]>([]);
    const [conditionTypeSelect, setConditionTypeSelect] = useState<any>(undefined);
    const conditionsSelect: DropDown[] = [
        {value: 'softBounce', label: 'Soft bounce', children: null},
        {value: 'hardBounce', label: 'Hard bounce', children: null}];

    const saveYesNoSplitForm = (values: any) => {
        let event = '';
        if (values.yesNoSplitFormObj.conditions && values.yesNoSplitFormObj.conditions.length > 0) {
            for (let i = 0; i < values.yesNoSplitFormObj.conditions.length; i++) {
                event = event.concat(values.yesNoSplitFormObj.conditions[i].attr).concat(', ');
            }
            event = event.length > 0 ? event.substr(0, event.length - 2) : '';
        }
        props.createCard(
            <div style={{display: "flex", justifyContent: 'center', flexDirection: 'column'}}>
                <Title level={5}>{values.yesNoSplitFormObj.evaluation}</Title>
                <Divider/>
                <Paragraph>{conditionTypeSelect === 'Segment' ? 'Segment' : 'Event'} {event}</Paragraph>
            </div>, 'yesNoSplit', 'Yes/No Split', '/assets/icons/icon-yes-no-split.svg', 2, props.modalData ? props.modalData.cardId : null, values.yesNoSplitFormObj);
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
        if (props.modalData) {
            getObjectById(props.modalData.workFlowId, 'cardData').then(async getYesNoDataAsync => {
                let getYesNoDataRes = await getYesNoDataAsync.json();
                if (getYesNoDataRes && getYesNoDataRes[props.modalData.cardId]) {
                    getYesNoDataRes = getYesNoDataRes[props.modalData.cardId];
                    yesNoSplitForm.setFieldsValue({
                        yesNoSplitFormObj: {
                            conditionType: getYesNoDataRes.conditionType,
                            sender: getYesNoDataRes.sender,
                            conditions: getYesNoDataRes.conditions,
                            evaluation: getYesNoDataRes.evaluation,
                            description: getYesNoDataRes.description
                        }
                    });
                    setConditionTypeSelect(getYesNoDataRes.conditionType);
                }
            }).catch(_ => {
                console.log("Unable to get yes/No data");
                message.error(GET_SERVER_ERROR, 0.8).then(() => {
                });
            });
        }
    }, []);

    return <Form className={'yesNoSplit'} name="yesNoSplitForm" form={yesNoSplitForm} layout={'vertical'}
                 onFinish={saveYesNoSplitForm} autoComplete={'off'}>
        <Form.Item label={<strong>Select a condition type </strong>}>
            <Form.Item name={['yesNoSplitFormObj', 'conditionType']} noStyle>
                <Select showSearch placeholder="Select condition type" allowClear={true}
                        onChange={(e) => setConditionTypeSelect(e)}>
                    {conditionType.map(value => {
                        return <Option value={value.label} key={value.value}>{value.label}</Option>
                    })}
                </Select>
            </Form.Item>
        </Form.Item>
        <Form.Item
            label={<strong>Choose {conditionTypeSelect}</strong>}>
            <Form.Item name={['yesNoSplitFormObj', 'sender']} noStyle>
                <Select showSearch placeholder={`select ${conditionTypeSelect}`} style={{width: 600}}
                        allowClear={true}>
                    {conditionTypeSelect === 'Segment' ? allSegments.map(value => {
                        return <Option value={value.label} key={value.value}>{value.label}</Option>
                    }) : allEvents.map(value => {
                        return <Option value={value.label} key={value.value}>{value.label}</Option>
                    })}
                </Select>
            </Form.Item>
        </Form.Item>
        <Form.List name={['yesNoSplitFormObj', 'conditions']}>
            {(fields, {add, remove}) => (
                <>
                    {fields.map(({key, name, fieldKey, ...restField}) => (
                        <Space key={key} style={{display: 'flex'}} align="center">
                            <Form.Item label={null}
                                       {...restField}
                                       name={[name, 'attr']}
                                       fieldKey={[fieldKey, 'attr']}
                                       rules={[{required: true, message: 'Missing Condition'}]}>
                                <Select style={{width: 600}} showSearch
                                        placeholder="select journey message activity and event" allowClear={true}>
                                    {conditionsSelect.map(value => {
                                        return <Option value={value.label} key={value.value}>{value.label}</Option>
                                    })}
                                </Select>
                            </Form.Item>
                            <div className={'remove'}>
                                <MinusCircleOutlined onClick={() => remove(name)}/>
                            </div>
                        </Space>
                    ))}
                    <Form.Item className='addCon'>
                        <Button type="link" onClick={() => add()} block icon={<PlusOutlined/>}>
                            Add Condition
                        </Button>
                    </Form.Item>
                </>
            )}
        </Form.List>
        <div className='colFlex' style={{marginBottom: 16}}>
            <strong>Condition evaluation</strong>
            <span>The amount of time Amazon Pinpoint waits before it evaluates the conditions.</span>
        </div>
        <Form.Item label={null}>
            <Form.Item name={['yesNoSplitFormObj', 'evaluation']} noStyle rules={[{required: true, message: 'Evaluation Type Required'}]}>
                <Select showSearch placeholder="Select Evaluation Condition" allowClear={true}>
                    {journeyMessage.map(value => {
                        return <Option value={value.label} key={value.value}>{value.label}</Option>
                    })}
                </Select>
            </Form.Item>
        </Form.Item>
        <Form.Item label={<strong>Description - optional</strong>}>
            <Form.Item name={['yesNoSplitFormObj', 'description']} noStyle>
                <Input placeholder={'Enter a description for this step'}/>
            </Form.Item>
        </Form.Item>
        <div className='reverseFlex'>
            <Form.Item>
                <Button style={{marginRight: 8}} key="save" htmlType={'submit'} type="primary"
                        icon={<CheckOutlined/>}>
                    Save
                </Button>
            </Form.Item>
        </div>
    </Form>
}
