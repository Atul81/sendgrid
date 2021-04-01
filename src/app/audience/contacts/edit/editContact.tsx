import React, {useEffect} from "react";
import './editContact.scss';
import {updateBreadcrumb} from "../../../../store/actions/root";
import {useDispatch} from "react-redux";
import './../contacts.scss';
import {Button, Form, Input, Select, Tabs} from "antd";
import Title from "antd/lib/typography/Title";

export const EditContactPage: any = (props: any) => {
    const dispatch = useDispatch();
    const {TabPane} = Tabs;
    const [generalForm] = Form.useForm();

    useEffect(() => {
        dispatch(updateBreadcrumb(['Audience', 'Contacts', 'Edit Contact']));
    }, [dispatch]);
    const {Option} = Select;

    const onCountryChange = (value: string) => {
        console.log(`selected ${value}`);
    }

    const filterCountryOption = (input: string, option: any) => {
        return option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
    }

    return (
        <div className="editContact contacts">
            <div className="firstNav">
                <div className="leftPlacement">
                    <Title level={4}>{[props.contactObj.firstName, ' ', props.contactObj.lastName]}</Title>
                </div>
                <div className="rightPlacement">
                    <Button className="deleteBtn" onClick={props.routeToOverview}>Cancel</Button>
                    <Button className="deleteBtn" type="primary">Save</Button>
                </div>
            </div>
            <div className="tabsNav">
                <Tabs defaultActiveKey="1">
                    <TabPane tab="General" key="1">
                        <Form form={generalForm} layout={'vertical'}>
                            <Form.Item label="Email" required>
                                <Input placeholder="tony@testing.com" type={"email"}/>
                            </Form.Item>
                            <div style={{
                                display: "grid",
                                gridTemplateColumns: "49% auto",
                                gridColumnGap: '24px',
                            }}>
                                <Form.Item label="First Name">
                                    <Input placeholder="input placeholder"/>
                                </Form.Item>
                                <Form.Item label="Last Name">
                                    <Input placeholder="input placeholder"/>
                                </Form.Item>
                                <Form.Item label="Address">
                                    <Input placeholder="input placeholder"/>
                                </Form.Item>
                                <Form.Item label="City">
                                    <Input placeholder="input placeholder"/>
                                </Form.Item>
                                <Form.Item label="Postal">
                                    <Input placeholder="input placeholder"/>
                                </Form.Item>
                                <Form.Item label="Country">
                                    <Select
                                        showSearch
                                        placeholder="Country"
                                        optionFilterProp="children"
                                        onChange={onCountryChange}
                                        filterOption={(input, option) => filterCountryOption(input, option)}>
                                        <Option value="ind">India</Option>
                                        <Option value="usa">United States</Option>
                                        <Option value="uk">United Kingdom</Option>
                                    </Select>
                                </Form.Item>
                            </div>
                            <Form.Item>
                                <Button type="primary">Submit</Button>
                            </Form.Item>
                        </Form>
                    </TabPane>
                    <TabPane tab="Custom Fields" key="2">
                        Content of Tab Pane 2
                    </TabPane>
                    <TabPane tab="Segment" key="3">
                        Content of Tab Pane 3
                    </TabPane>
                </Tabs>
            </div>
        </div>
    );
}