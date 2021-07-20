import React from "react";
import {Button, Form, Input} from "antd";
import {CheckOutlined} from "@ant-design/icons";
import Title from "antd/es/typography/Title";
import '../amendAutomation.scss';

export const HoldOut = (props: any) => {

    const [holdOutForm] = Form.useForm();

    const saveHoldOutForm = (values: any) => {
        props.createCard(
            <div style={{display: "flex", justifyContent: 'center', flexDirection: 'column'}}>
                <Title level={5}>Holdout: {values.holdOutFormObj.holdOutPercentage}%</Title>
            </div>, 'holdOut', 'HoldOut', '/assets/icons/icon-holdout.svg', 2, props.modalData ? props.modalData.cardId : null);
    };

    return <Form className={'holdOut'} name="holdOutForm" form={holdOutForm}
                 layout={'vertical'}
                 onFinish={saveHoldOutForm} autoComplete={'off'}>
        <Form.Item label={<div className='colFlex'><strong>Holdout Percentage</strong>
            <span>Specify the percentage of customers who should exit the journey</span>
        </div>
        }>
            <Form.Item name={['holdOutFormObj', 'holdOutPercentage']} noStyle>
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