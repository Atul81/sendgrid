import {Button, Form, Input, Select} from "antd";
import React from "react";

export const FormEditPage: any = (props: any) => {
    const {Option} = Select;

    const onCountryChange = (value: string) => {
        console.log(`selected ${value}`);
    };

    const filterCountryOption = (input: string, option: any) => {
        return option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
    };
    const modifyContactService = (values: any) => {
        props.saveFormValues(values);
    };

    return (<div className='editForm'>
            <Form form={props.generalForm} layout={'vertical'} onFinish={modifyContactService}>
                <Form.Item label="Email" required>
                    <Form.Item name={['formObj', 'email']}
                               noStyle rules={[{required: true, message: 'Email required'}]}>
                        <Input placeholder="tony@testing.com" type={"email"}/>
                    </Form.Item>
                </Form.Item>
                <div style={{
                    display: "grid",
                    gridTemplateColumns: "49% auto",
                    gridColumnGap: '24px',
                }}>
                    <Form.Item label="First Name">
                        <Form.Item name={['formObj', 'firstName']}
                                   noStyle rules={[{required: true, message: 'First Name required'}]}>
                            <Input placeholder="Enter first name"/>
                        </Form.Item>
                    </Form.Item>
                    <Form.Item label="Last Name">
                        <Form.Item name={['formObj', 'lastName']}
                                   noStyle rules={[{required: true, message: 'Last Name required'}]}>
                            <Input placeholder="Enter Last Name"/>
                        </Form.Item>
                    </Form.Item>
                    <Form.Item label="Address" name={['formObj', 'address']}>
                        <Input placeholder="input placeholder"/>
                    </Form.Item>
                    <Form.Item label="City" name={['formObj', 'city']}>
                        <Input placeholder="input placeholder"/>
                    </Form.Item>
                    <Form.Item label="Postal" name={['formObj', 'postalCode']}>
                        <Input type={'number'} placeholder="input placeholder"/>
                    </Form.Item>
                    <Form.Item label="Country" name={['formObj', 'country']}>
                        <Select
                            showSearch
                            placeholder="Country"
                            optionFilterProp="children"
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