import {Button, Form, Input, message, Select} from "antd";
import React, {useEffect, useState} from "react";
import {DropDown} from "../../../utils/Interfaces";
import {getAllServerCall} from "../../../service/serverCalls/mockServerRest";
import Paragraph from "antd/es/typography/Paragraph";
import {validateEmail} from "../../../utils/common";

export const FormEditPage: any = (props: any) => {
    const {Option} = Select;

    const filterCountryOption = (input: string, option: any) => {
        return option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
    };
    const modifyContactService = (values: any) => {
        props.saveFormValues(values);
    };
    const [allTags, setAllTags] = useState<DropDown[]>([]);
    const [allSegments, setAllSegments] = useState<DropDown[]>([]);

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
            }).catch(reason => {
                console.log(reason);
                message.error('Unable to fetch tags data', 0.8).then(() => {
                });
            });

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
                message.error('Unable to fetch segments data', 0.8).then(() => {
                });
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
                <Form.Item label={props.type !== 'senders' ? <strong>Email</strong> : <strong>From Email</strong>}
                           required>
                    <Form.Item name={['formObj', 'email']} noStyle
                               rules={[() => ({
                                   validator(_, value) {
                                       if (value) {
                                           if (validateEmail(value)) {
                                               return Promise.resolve();
                                           } else {
                                               return Promise.reject(new Error('Email Address not valid!'));
                                           }
                                       } else {
                                           return Promise.reject(new Error('Email Address required'));
                                       }
                                   }
                               })]}>
                        <Input disabled={(props.type === 'senders' && props.emailEditable)}
                               placeholder="tony@testing.com" type={"email"}/>
                    </Form.Item>
                </Form.Item>
                <div style={{
                    display: "grid",
                    gridTemplateColumns: "49% auto",
                    gridColumnGap: '24px',
                }}>
                    <Form.Item label={props.type !== 'senders' ? <strong>First Name</strong> :
                        <strong>From First Name</strong>}>
                        <Form.Item name={['formObj', 'firstName']}
                                   noStyle rules={[{required: true, message: 'First Name required'}]}>
                            <Input placeholder="Enter first name"/>
                        </Form.Item>
                    </Form.Item>
                    <Form.Item
                        label={props.type !== 'senders' ? <strong>Last Name</strong> : <strong>From Last Name</strong>}>
                        <Form.Item name={['formObj', 'lastName']}
                                   noStyle rules={[{required: true, message: 'Last Name required'}]}>
                            <Input placeholder="Enter Last Name"/>
                        </Form.Item>
                    </Form.Item>
                    {props.type !== 'senders' ?
                        <>
                            <Form.Item label={<strong>City</strong>} name={['formObj', 'city']}>
                                <Input placeholder="input placeholder"/>
                            </Form.Item>

                            <Form.Item label={<strong>Tags</strong>} name={['formObj', 'tags']}
                                       rules={[{required: true, message: 'Atleast one tag required'}]}>
                                <Select mode={'multiple'} showSearch placeholder="Tags" optionFilterProp="children"
                                        allowClear={true}
                                        filterOption={(input, option) => filterCountryOption(input, option)}>
                                    {allTags.map(value => {
                                        return <Option value={value.label} key={value.value}>{value.label}</Option>
                                    })}
                                </Select>
                            </Form.Item>
                            <Form.Item label={<strong>Segments</strong>} name={['formObj', 'segments']}
                                       rules={[{required: true, message: 'Atleast one segment required'}]}>
                                <Select mode={'multiple'} showSearch placeholder="Segments" optionFilterProp="children"
                                        allowClear={true}
                                        filterOption={(input, option) => filterCountryOption(input, option)}>
                                    {allSegments.map(value => {
                                        return <Option value={value.label} key={value.value}>{value.label}</Option>
                                    })}
                                </Select>
                            </Form.Item>
                        </> :
                        <Form.Item label={<strong>Reply To</strong>} name={['formObj', 'replyTo']}>
                            <Input placeholder="input placeholder"/>
                        </Form.Item>
                    }
                    <Form.Item
                        label={props.type !== 'senders' ? <strong>Address</strong> : <strong>From Address</strong>}
                        name={['formObj', 'address']}>
                        <Input placeholder="input placeholder"/>
                    </Form.Item>
                    <Form.Item label={<strong>Postal</strong>} name={['formObj', 'postalCode']}>
                        <Input type={'number'} placeholder="input placeholder"/>
                    </Form.Item>
                    <Form.Item label={<strong>Country</strong>} name={['formObj', 'country']}>
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
