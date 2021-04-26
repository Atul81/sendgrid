import React, {useEffect, useState} from "react";
import {Button, Form, Input, Select} from "antd";
import {CheckOutlined} from "@ant-design/icons";
import Title from "antd/lib/typography/Title";
import {filterSelectOptions} from "../../../utils/common";
import {DropDown} from "../../../utils/Interfaces";
import './domain.scss';
import {DnsRecordsPage} from "./dnsRecords/DnsRecordsLoadable";
import {ContactsInterface} from "../../audience/contactInterface";
import {DnsRecordsInterface} from "../settingsInterface";

export const DomainSettingsPage: any = () => {

    const [domainForm] = Form.useForm();
    const {Option} = Select;

    const [allDnsHost, setAllDnsHost] = useState<DropDown[]>([{label: 'One', value: '1', children: null}]);
    const [formProceed, setFormProceed] = useState(false);

    const proceedDomainSettings = (values: any) => {
        console.log(values);
        setFormProceed(true);
    };

    return !formProceed ? (<div className={'domain'}>
        <Form className={'maxWidth'} form={domainForm} layout={'vertical'} onFinish={proceedDomainSettings}>
            <div className="pageLayout">
                <div className="firstNav">
                    <div className="leftPlacement">
                        <Title level={4}>Domain Settings</Title>
                    </div>
                    <div className="rightPlacement">
                        <Button style={{width: 88}} type={'primary'} htmlType={"submit"}
                                icon={<CheckOutlined/>}>Proceed</Button>
                    </div>
                </div>
                <div className="thirdNav" style={{height: 'calc(100vh - 238px)'}}>
                    <Form.Item label="DNS (Domain Name Server) Host">
                        <Form.Item name={['formObj', 'dnsHost']}
                                   noStyle rules={[{required: true, message: 'DNS Host required'}]}>
                            <Select showSearch allowClear
                                    placeholder="Select Segments"
                                    optionFilterProp="children"
                                    filterOption={(input, option) => filterSelectOptions(input, option)}>
                                {allDnsHost.map(value => {
                                    return <Option key={value.value} value={value.label}>{value.label}</Option>
                                })}
                            </Select>
                        </Form.Item>
                    </Form.Item>
                    <Form.Item label="Sender Domain Name">
                        <Form.Item name={['formObj', 'dnsName']} noStyle
                                   rules={[{required: true, message: 'Domain Name required'}]}>
                            <Input placeholder="Form Domain" type={'text'}/>
                        </Form.Item>
                    </Form.Item>
                </div>
            </div>
        </Form>
    </div>) : <DnsRecordsPage exitToLandingPage={() => setFormProceed(false)}/>
}