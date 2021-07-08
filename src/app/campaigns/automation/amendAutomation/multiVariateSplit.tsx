import React from "react";
import {Button, Divider, Form, Input, Select, Space} from "antd";
import {CheckOutlined, MinusCircleOutlined, PlusOutlined} from "@ant-design/icons";
import Title from "antd/es/typography/Title";
import Paragraph from "antd/es/typography/Paragraph";
import {DropDown} from "../../../../utils/Interfaces";
import './amendAutomation.scss';

export const MultiVariateSplit = (props: any) => {

    const [multiVariateSplitForm] = Form.useForm();
    const {Option} = Select;

    const saveMultiVariateSplitForm = (values: any) => {
        props.createCard(
            <div style={{display: "flex", justifyContent: 'center', flexDirection: 'column'}}>
                <Title level={5}>Evaluate Immediately</Title>
                <Divider/>
                {values.multiVariateSplitFormObj.branch.map((itr: any) => {
                    return <Paragraph><span className="dot"/>{itr}</Paragraph>
                })}
            </div>, 'multiVariateSplit', 'Multivariate Split');
    };

    const conditionEvalSelect: DropDown[] = [
        {value: 'evalIm', label: 'Evaluate Immediately', children: null},
        {value: 'evalPr', label: 'Evaluate Periodically', children: null},
        {value: 'evalMn', label: 'Evaluate Monthly', children: null}
    ]
    return <Form className={'multiVariateSplit'} name="multiVariateSplitForm" form={multiVariateSplitForm}
                 layout={'vertical'}
                 onFinish={saveMultiVariateSplitForm} autoComplete={'off'}>
        <Form.List name={['multiVariateSplitFormObj', 'branch']}>
            {(fields, {add, remove}) => (
                <>
                    {fields.map(({key, name, fieldKey, ...restField}) => (
                        <Space key={key} style={{display: 'flex'}} align="center">
                            <Form.Item label={null}
                                       {...restField}
                                       name={[name, 'name']}
                                       fieldKey={[fieldKey, 'name']}
                                       rules={[{required: true, message: 'Missing Branch Name'}]}>
                                <Input placeholder={'Input branch name'}/>
                            </Form.Item>
                            <div className={'multiCloseIcon'}>
                                <MinusCircleOutlined onClick={() => remove(name)}/>
                            </div>
                        </Space>
                    ))}
                    <Form.Item className='conBtn'>
                        <Button type="link" onClick={() => add()} block icon={<PlusOutlined/>}>
                            Add Another Branch
                        </Button>
                    </Form.Item>
                </>
            )}
        </Form.List>
        <Divider/>
        <Form.Item
            label={<div className='colFlex'><strong>Condition evaluation</strong>
                <span>The amount of time that Amazon Pinpoint waits before it evaluated the conditions</span>
            </div>}>
            <Form.Item name={['multiVariateSplitFormObj', 'evaluation']} noStyle>
                <Select showSearch placeholder="Select condition type" allowClear={true}>
                    {conditionEvalSelect.map(value => {
                        return <Option value={value.label} key={value.value}>{value.label}</Option>
                    })}
                </Select>
            </Form.Item>
        </Form.Item>
        <Form.Item label={<strong>Description - optional</strong>}>
            <Form.Item name={['multiVariateSplitFormObj', 'description']} noStyle>
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
