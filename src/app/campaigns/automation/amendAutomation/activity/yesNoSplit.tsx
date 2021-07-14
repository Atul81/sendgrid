import React from "react";
import {Button, Form, Input, Select, Space} from "antd";
import Paragraph from "antd/es/typography/Paragraph";
import Title from "antd/es/typography/Title";
import {CheckOutlined, MinusCircleOutlined, PlusOutlined} from "@ant-design/icons";
import {DropDown} from "../../../../../utils/Interfaces";

export const YesNoSplit = (props: any) => {

    const [yesNoSplitForm] = Form.useForm();
    const {Option} = Select;

    const conditionType: DropDown[] = [
        {value: 'event', label: 'Event', children: null},
        {value: 'segment', label: 'Segment', children: null}];

    const journeyMessage: DropDown[] = [{value: 'unConf', label: 'Unconfigured Message', children: null}];

    const conditionsSelect: DropDown[] = [
        {value: 'softBounce', label: 'Soft bounce', children: null},
        {value: 'hardBounce', label: 'Hard bounce', children: null}];

    const saveYesNoSplitForm = (values: any) => {
        props.createCard(
            <div style={{display: "flex", justifyContent: 'center', flexDirection: 'column'}}>
                <Title level={5}>Evaluate Immediately</Title>
                <Paragraph>Sender Address: {values.sendEmailObj.sender}</Paragraph>
            </div>, '[yesNoSplit', 'Yes/No Split');
    };

    return <Form className={'yesNoSplit'} name="yesNoSplitForm" form={yesNoSplitForm} layout={'vertical'}
                 onFinish={saveYesNoSplitForm} autoComplete={'off'}>
        <Form.Item label={<strong>Select a condition type </strong>}>
            <Form.Item name={['yesNoSplitFormObj', 'conditionType']} noStyle>
                <Select showSearch placeholder="Select condition type" allowClear={true}>
                    {conditionType.map(value => {
                        return <Option value={value.label} key={value.value}>{value.label}</Option>
                    })}
                </Select>
            </Form.Item>
        </Form.Item>
        <Form.Item
            label={<strong>Choose a journey message activity and event </strong>}>
            <Form.Item name={['yesNoSplitFormObj', 'sender']} noStyle>
                <Select showSearch placeholder="select journey message activity and event" style={{width: 600}} allowClear={true}>
                    {journeyMessage.map(value => {
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
                                <Select style={{width: 600}} showSearch placeholder="select journey message activity and event" allowClear={true}>
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
            <Form.Item name={['yesNoSplitFormObj', 'evaluation']} noStyle>
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
