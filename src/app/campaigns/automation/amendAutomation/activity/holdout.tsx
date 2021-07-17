import React from "react";
import {Button, Divider, Form, Input} from "antd";
import {CheckOutlined} from "@ant-design/icons";
import Title from "antd/es/typography/Title";
import Paragraph from "antd/es/typography/Paragraph";
import '../amendAutomation.scss';

export const Holdout = (props: any) => {

    const [holdOutForm] = Form.useForm();

    const saveHoldOutForm = (values: any) => {
        props.createCard(
            <div style={{display: "flex", justifyContent: 'center', flexDirection: 'column'}}>
                <Title level={5}>Evaluate Immediately</Title>
                <Divider/>
                {values.holdOut.branch.map((itr: any) => {
                    return <Paragraph><span className="dot"/>{itr}</Paragraph>
                })}
            </div>, 'holdout', 'Holdout', '/assets/icons/icon-holdout.svg', null, props.modalData ? props.modalData.cardId : null);
    };


    return <Form className={'holdOut'} name="holdOutForm" form={holdOutForm}
                 layout={'vertical'}
                 onFinish={saveHoldOutForm} autoComplete={'off'}>
        <Form.Item label={<div className='colFlex'><strong>Holdout Percentage</strong>
            <span>Specify the percentage of customers who should exit the journey</span>
        </div>}>
            <Form.Item name={['holdOutFormObj', 'evaluation']} noStyle>
                <Input placeholder={'Enter a description for this step'} type={'number'}/>
            </Form.Item>
        </Form.Item>
        <Form.Item label={<strong>Description - optional</strong>}>
            <Form.Item name={['holdOutFormObj', 'description']} noStyle>
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
