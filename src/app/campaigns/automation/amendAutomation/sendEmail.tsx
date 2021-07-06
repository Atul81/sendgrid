import React, {useEffect, useState} from "react";
import {Button, Form, Input, message, Select} from "antd";
import {CheckOutlined, SearchOutlined} from "@ant-design/icons";
import './amendAutomation.scss';
import Paragraph from "antd/es/typography/Paragraph";
import {DropDown} from "../../../../utils/Interfaces";
import {getAllServerCall} from "../../../../service/serverCalls/mockServerRest";
import {GET_SERVER_ERROR} from "../../../../utils/common";

export const SendEmail = (props: any) => {

    const [sendEmailForm] = Form.useForm();
    const {Option} = Select;

    const saveSendEmailForm = (values: any) => {
        props.createCard(
            <div style={{display: "flex", justifyContent:'center', flexDirection:'column'}}>
                <Button>Configure Message</Button>
                <Paragraph>Sender Address: {values.sendEmailObj.sender}</Paragraph>
            </div>, 'sendEmail', 'Send an email');
    }

    const [allSenders, setAllSenders] = useState<DropDown[]>([]);

    const filterCountryOption = (input: string, option: any) => {
        return option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
    };
    useEffect(() => {
        getAllServerCall('senders').then(async allSendersAsync => {
            let allSendersRes = await allSendersAsync.json();
            let tempItrObj: DropDown[] = [];
            if (allSendersRes) {
                allSendersRes.forEach((itr: any) => {
                    tempItrObj.push({label: itr.email, value: itr.id, children: null});
                });
            }
            setAllSenders(tempItrObj);
        }).catch(reason => {
            console.log(reason);
            message.error(GET_SERVER_ERROR, 0.8).then(() => {
            });
        });
    }, []);

    const sendTextMsg = () => {
        console.log('Send text message');
    }

    const previewMsg = () => {
        console.log('preview message');
    }

    return <Form className={'sendEmail'} name="sendEmailForm" form={sendEmailForm} layout={'vertical'}
                 onFinish={saveSendEmailForm} autoComplete={'off'}>
        <div className='firstDiv'>
            <Paragraph>Select an email template to use for this activity</Paragraph>
            <Button type={'link'}>Create template</Button>
        </div>
        <Form.Item className='removeBtnRad'>
            <Button style={{marginRight: 8}} key="save" onClick={sendTextMsg}>
                Choose an email template
            </Button>
        </Form.Item>
        <div className='inlineFlexContent'>
            <Form.Item>
                <Button style={{marginRight: 8}} key="send" onClick={sendTextMsg}>
                    Send a text message
                </Button>
            </Form.Item>
            <Form.Item>
                <Button style={{marginRight: 8}} key="preview" onClick={previewMsg}>
                    Preview Message
                </Button>
            </Form.Item>
        </div>
        <Form.Item
            label={<div><strong>Sender email address </strong><span className={'info'}>Info</span></div>}>
            <Form.Item name={['sendEmailObj', 'sender']} noStyle>
                <Select showSearch placeholder="Select Sender's Email" suffixIcon={<SearchOutlined/>}
                        optionFilterProp="children" allowClear={true}
                        filterOption={(input, option) => filterCountryOption(input, option)}>
                    {allSenders.map(value => {
                        return <Option value={value.label} key={value.value}>{value.label}</Option>
                    })}
                </Select>
            </Form.Item>
        </Form.Item>
        <div className='colFlex' style={{marginBottom: 16}}>
            <span>Friendly sender name</span>
            <strong>No Reply</strong>
        </div>
        <Form.Item label={<strong>Description - optional</strong>}>
            <Form.Item name={['sendEmailObj', 'description']} noStyle>
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
