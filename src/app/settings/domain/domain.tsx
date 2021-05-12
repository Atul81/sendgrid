import React, {useEffect, useState} from "react";
import {Button, Form, Input, message, Select} from "antd";
import {CheckOutlined, StepBackwardOutlined} from "@ant-design/icons";
import Title from "antd/lib/typography/Title";
import {filterSelectOptions} from "../../../utils/common";
import {DropDown} from "../../../utils/Interfaces";
import './domain.scss';
import {DnsRecordsPage} from "./dnsRecords/DnsRecordsLoadable";
import {addNewObject, getAllServerCall} from "../../../service/serverCalls/mockServerRest";
import {useDispatch} from "react-redux";
import {updateActiveContent, updateBreadcrumb} from "../../../store/actions/root";

export const DomainSettingsPage: any = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(updateBreadcrumb(['Settings', 'domain']));
        dispatch(updateActiveContent('domain'));
        getAllServerCall('utils').then(async allDnsHostsAsync => {
            let allDnsHostsRes = await allDnsHostsAsync.json();
            let tempItrObj: DropDown[] = [];
            if (allDnsHostsRes && Array.isArray(allDnsHostsRes.dnsHosts)) {
                allDnsHostsRes.dnsHosts.forEach((itr: any) => {
                    tempItrObj.push(itr)
                });
            }
            setAllDnsHost(tempItrObj);
        });
    }, [dispatch]);

    const [domainForm] = Form.useForm();
    const {Option} = Select;

    const [allDnsHost, setAllDnsHost] = useState<DropDown[]>([]);
    const [newDomainSettings, setNewDomainSettings] = useState(false);
    const [domainId, setDomainId] = useState(12);

    const proceedDomainSettings = (values: any) => {
        let newDomainObj = values.formObj;
        addNewObject({
            id: domainId,
            type: newDomainObj.dnsHost,
            dnsName: newDomainObj.dnsName,
            canonicalName: newDomainObj.dnsName
        }, 'domain').then(async newDnsRecordAsync => {
            let newDnsRecordRes = await newDnsRecordAsync.json();
            if (newDnsRecordRes) {
                setDomainId(domainId + 1);
                message.success("New DNS Record has been installed", 0.6);
            }
        });
        setNewDomainSettings(false);
        domainForm.resetFields();
    };

    const exitToDataView = () => {
        setNewDomainSettings(true);
        dispatch(updateBreadcrumb(['Settings', 'domain', 'add-domain']));
    };

    const cancelNewDomain = () => {
        setNewDomainSettings(false);
        dispatch(updateBreadcrumb(['Settings', 'domain']));
    };

    return newDomainSettings ? (<div className={'domain'}>
        <Form className={'maxWidth'} form={domainForm} layout={'vertical'} onFinish={proceedDomainSettings}>
            <div className="pageLayout">
                <div className="firstNav">
                    <div className="leftPlacement">
                        <Title level={4}>Domain Settings</Title>
                    </div>
                    <div className="rightPlacement">
                        <Button style={{width: 88}} type={'primary'} htmlType={"submit"}
                                icon={<CheckOutlined/>}>Proceed</Button>
                        <Button style={{width: 76, marginLeft: 8}} onClick={cancelNewDomain}
                                icon={<StepBackwardOutlined/>}>Cancel</Button>
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
    </div>) : <DnsRecordsPage exitToLandingPage={exitToDataView}/>
}