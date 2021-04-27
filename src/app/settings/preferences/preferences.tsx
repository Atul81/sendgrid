import React from "react";
import {Button, Form, Input, Radio, TimePicker} from "antd";
import {CheckOutlined, CloseOutlined} from "@ant-design/icons";
import Title from "antd/lib/typography/Title";
import './preference.scss';

export const PreferencePage: any = () => {

    const [preferenceForm] = Form.useForm();

    const preferenceFormService = (values: any) => {
        console.log(values);
    };

    const resetPreferenceFormService = () => {
        preferenceForm.resetFields();
    };

    return <Form className={'preference'} form={preferenceForm} layout={'vertical'} onFinish={preferenceFormService}>
        <div className={'pageLayout'}>
            <div className='reverseFlex' style={{marginBottom: 8}}>
                <Form.Item>
                    <Button key="cancel" htmlType={'reset'} onClick={resetPreferenceFormService}
                            icon={<CloseOutlined/>}>
                        Cancel
                    </Button>
                </Form.Item>
                <Form.Item>
                    <Button style={{marginRight: 8}} key="quickAdd" htmlType={'submit'} type="primary"
                            icon={<CheckOutlined/>}>
                        Save
                    </Button>
                </Form.Item>
            </div>
            <div className={'topContainer borderBox'}>
                <div className="firstNav marginBtm1">
                    <Title level={5}>Campaign Default Settings</Title>
                </div>
                <div className="secondNav" style={{height: 'calc(100vh - 604px)'}}>
                    <Form.Item label="Quiet Time Hours">
                        <Form.Item name={['formObj', 'quietTimeHours']} noStyle>
                            <TimePicker.RangePicker/>
                        </Form.Item>
                    </Form.Item>
                    <Form.Item
                        label="Maximum number of messages an endpoint can receive from project during a 24-hour period">
                        <Form.Item name={['formObj', 'maxMsg24Hr']} noStyle>
                            <Input placeholder="100" type={"number"}/>
                        </Form.Item>
                    </Form.Item>
                    <Form.Item label="Maximum number of messages an endpoint can receive from each campaign">
                        <Form.Item name={['formObj', 'maxMsgCampRec']} noStyle>
                            <Input placeholder="100" type={"number"}/>
                        </Form.Item>
                    </Form.Item>
                    <Form.Item label="Maximum number of messages campaign can send per second">
                        <Form.Item name={['formObj', 'maxMsgCampSend']} noStyle>
                            <Input placeholder="50" type={"number"}/>
                        </Form.Item>
                    </Form.Item>
                    <Form.Item label="Maximum number of seconds per each campaign run">
                        <Form.Item name={['formObj', 'maxSecEachCamp']} noStyle>
                            <Input placeholder="100" type={"number"}/>
                        </Form.Item>
                    </Form.Item>

                </div>
            </div>
            <div className={'topContainer borderBox'}>
                <div className="firstNav marginBtm1">
                    <Title level={5}>Open and Click Tracking Settings</Title>
                </div>
                <div className="secondNav" style={{height: 'calc(100vh - 866px)'}}>
                    <Form.Item label="Settings to generate reports related to your campaigns">
                        <Form.Item name={['formObj', 'campaignsRelated']} noStyle>
                            <Radio.Group>
                                <Radio value={'default'}>Default</Radio>
                                <Radio value={'customDNS'}>Custom DNS</Radio>
                            </Radio.Group>
                        </Form.Item>
                    </Form.Item>
                    <div className={'trackingContainer'}>
                        <Form.Item label="Tracking Domain Type">
                            <Form.Item name={['formObj', 'trackingDomainType']} noStyle>
                                <TimePicker.RangePicker/>
                            </Form.Item>
                        </Form.Item>
                        <Form.Item label="Tacking Sub-Domain">
                            <Form.Item name={['formObj', 'trackingSubDomain']} noStyle>
                                <TimePicker.RangePicker/>
                            </Form.Item>
                        </Form.Item>
                    </div>
                </div>
            </div>
        </div>
    </Form>

}