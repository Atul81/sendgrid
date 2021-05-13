import {Button, Form, Input, Select} from "antd";
import React, {useEffect, useState} from "react";
import {DropDown} from "../../../utils/Interfaces";
import {getAllServerCall} from "../../../service/serverCalls/mockServerRest";
import Paragraph from "antd/es/typography/Paragraph";

export const FormEditPage: any = (props: any) => {
    const {Option} = Select;

    const filterCountryOption = (input: string, option: any) => {
        return option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
    };
    const modifyContactService = (values: any) => {
        props.saveFormValues(values);
    };
    const [allTags, setAllTags] = useState<DropDown[]>([]);

    useEffect(() => {
        if (props.type !== 'senders') {
            getAllServerCall('utils').then(async response => {
                let resBody = await response.json();
                let data: DropDown[] = [];
                if (resBody && Array.isArray(resBody.tags)) {
                    resBody.tags.forEach((itr: any) => {
                        data.push(itr);
                    });
                }
                setAllTags(data);
            });
        }
    }, [props.type])
    return (
        <div className='editForm'>
            {props.type === 'senders' ? <div>
                <Paragraph>Contact information and physical mailing address are mandatory inside every promotional email
                    you send as per anti-spam laws such as CAN-SPAM and CASL</Paragraph>
            </div> : null}
            <Form form={props.generalForm} layout={'vertical'} onFinish={modifyContactService}>
                <Form.Item label={props.type !== 'senders' ? "Email" : 'From Email'} required>
                    <Form.Item name={['formObj', 'email']} noStyle
                               rules={[{required: true, message: 'Email required'}]}>
                        <Input disabled={(props.type === 'senders' && props.emailEditable)}
                               placeholder="tony@testing.com" type={"email"}/>
                    </Form.Item>
                </Form.Item>
                <div style={{
                    display: "grid",
                    gridTemplateColumns: "49% auto",
                    gridColumnGap: '24px',
                }}>
                    <Form.Item label={props.type !== 'senders' ? "First Name" : 'From First Name'}>
                        <Form.Item name={['formObj', 'firstName']}
                                   noStyle rules={[{required: true, message: 'First Name required'}]}>
                            <Input placeholder="Enter first name"/>
                        </Form.Item>
                    </Form.Item>
                    <Form.Item label={props.type !== 'senders' ? "Last Name" : 'From Last Name'}>
                        <Form.Item name={['formObj', 'lastName']}
                                   noStyle rules={[{required: true, message: 'Last Name required'}]}>
                            <Input placeholder="Enter Last Name"/>
                        </Form.Item>
                    </Form.Item>
                    {props.type !== 'senders' ?
                        <>
                            <Form.Item label="City" name={['formObj', 'city']}>
                                <Input placeholder="input placeholder"/>
                            </Form.Item>

                            <Form.Item label="Tags" name={['formObj', 'tags']}
                                       rules={[{required: true, message: 'Atleast one tag required'}]}>
                                <Select mode={'multiple'} showSearch placeholder="Tags" optionFilterProp="children"
                                        allowClear={true}
                                        filterOption={(input, option) => filterCountryOption(input, option)}>
                                    {allTags.map(value => {
                                        return <Option value={value.label} key={value.value}>{value.label}</Option>
                                    })}
                                </Select>
                            </Form.Item>
                        </> :
                        <Form.Item label="Reply To" name={['formObj', 'replyTo']}>
                            <Input placeholder="input placeholder"/>
                        </Form.Item>
                    }
                    <Form.Item label={props.type !== 'senders' ? "Address" : 'From Address'}
                               name={['formObj', 'address']}>
                        <Input placeholder="input placeholder"/>
                    </Form.Item>
                    <Form.Item label="Postal" name={['formObj', 'postalCode']}>
                        <Input type={'number'} placeholder="input placeholder"/>
                    </Form.Item>
                    <Form.Item label="Country" name={['formObj', 'country']}>
                        <Select showSearch placeholder="Country" optionFilterProp="children"
                                filterOption={(input, option) => filterCountryOption(input, option)}>
                            <Option value="ind">India</Option>
                            <Option value="usa">United States</Option>
                            <Option value="uk">United Kingdom</Option>
                        </Select>
                    </Form.Item>
                </div>
                <Form.Item>
                    <Button type="primary" htmlType={'submit'}>Save</Button>
                </Form.Item>
            </Form>
        </div>
    )
}