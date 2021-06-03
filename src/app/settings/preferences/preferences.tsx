import React, {useEffect, useState} from "react";
import {Button, Form, Input, message, Radio, Select, TimePicker} from "antd";
import {CheckOutlined, CloseOutlined} from "@ant-design/icons";
import Title from "antd/lib/typography/Title";
import './preference.scss';
import {editObjectById, getAllServerCall, getObjectById} from "../../../service/serverCalls/mockServerRest";
import Paragraph from "antd/lib/typography/Paragraph";
import {DropDown} from "../../../utils/Interfaces";
import moment from "moment";

export const PreferencePage: any = () => {

    const [preferenceForm] = Form.useForm();
    const [allDomains, setAllDomains] = useState<DropDown[]>([]);
    const [allSubDomains, setAllSubDomains] = useState<DropDown[]>([]);
    const {Option} = Select;

    useEffect(() => {
        getObjectById("1", 'preferences').then(async getPreferenceByIdAsync => {
            let getPreferenceByIdRes = await getPreferenceByIdAsync.json();
            if (getPreferenceByIdRes) {
                preferenceForm.setFieldsValue({
                    formObj: {
                        ...getPreferenceByIdRes,
                        quietTimeHours: getPreferenceByIdRes.quietTimeHours ? [moment(getPreferenceByIdRes.quietTimeHours[0]), moment(getPreferenceByIdRes.quietTimeHours[1])] : undefined,
                    }
                });
                setDomainType(getPreferenceByIdRes.campaignsRelated);
            }
        });
        getAllServerCall("domain").then(async getAllDomainsAsync => {
            let allDomainRes = await getAllDomainsAsync.json();
            if (allDomainRes) {
                let tempAllDomains: DropDown[] = [];
                let tempAllSubDomains: DropDown[] = [];
                allDomainRes.forEach((itr: any) => {
                    tempAllDomains.push({
                        value: itr.id,
                        label: itr.domain,
                        children: null
                    });
                    tempAllSubDomains.push({
                        value: itr.id,
                        label: `dkms.ser ${itr.domain}`,
                        children: null
                    });
                });
                console.log(tempAllSubDomains)
                setAllDomains(tempAllDomains);
                setAllSubDomains(tempAllSubDomains);
            }
        });
    }, []);

    const preferenceFormService = (values: any) => {
        editObjectById({...values.formObj, id: 1}, 'preferences').then(async preferenceFormAsync => {
            let preferenceFormRes = await preferenceFormAsync.json();
            if (preferenceFormRes) {
                message.success("Preferences has been successfully saved", 0.6);
            }
        });
    };

    const resetPreferenceFormService = () => {
        preferenceForm.resetFields();
    };

    const [domainType, setDomainType] = useState('default');
    const filterCountryOption = (input: string, option: any) => {
        return option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
    };
    return (
        <Form form={preferenceForm} layout={'vertical'} onFinish={preferenceFormService}>
            <div className='reverseFlex' style={{marginBottom: 16}}>
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
            <div className={'preference'}>
                <div>
                    <div className="firstNav marginBtm1">
                        <Title level={5}>Campaign Default Settings</Title>
                    </div>
                    <div className="secondNav" style={{height: 'calc(100vh - 604px)'}}>
                        <Form.Item label={<strong>Quiet Time Hours</strong>}>
                            <Form.Item name={['formObj', 'quietTimeHours']} noStyle>
                                <TimePicker.RangePicker/>
                            </Form.Item>
                        </Form.Item>
                        <Form.Item
                            label={<strong>Maximum number of messages an endpoint can receive from project during a
                                24-hour period</strong>}>
                            <Form.Item name={['formObj', 'maxMsg24Hr']} noStyle>
                                <Input placeholder="100" type={"number"}/>
                            </Form.Item>
                        </Form.Item>
                        <Form.Item label={<strong>Maximum number of messages an endpoint can receive from each
                            campaign</strong>}>
                            <Form.Item name={['formObj', 'maxMsgCampRec']} noStyle>
                                <Input placeholder="100" type={"number"}/>
                            </Form.Item>
                        </Form.Item>
                        <Form.Item label={<strong>Maximum number of messages campaign can send per second</strong>}>
                            <Form.Item name={['formObj', 'maxMsgCampSend']} noStyle>
                                <Input placeholder="50" type={"number"}/>
                            </Form.Item>
                        </Form.Item>
                        <Form.Item label={<strong>Maximum number of seconds per each campaign run</strong>}>
                            <Form.Item name={['formObj', 'maxSecEachCamp']} noStyle>
                                <Input placeholder="100" type={"number"}/>
                            </Form.Item>
                        </Form.Item>

                    </div>
                </div>
                <div>
                    <div className="firstNav marginBtm1">
                        <Title level={5}>Open and Click Tracking Settings</Title>
                    </div>
                    <div className="secondNav" style={{height: 'calc(100vh - 866px)'}}>
                        <Form.Item label={<strong>Settings to generate reports related to your campaigns</strong>}>
                            <Form.Item name={['formObj', 'campaignsRelated']} noStyle>
                                <Radio.Group onChange={(e) => setDomainType(e.target.value)}>
                                    <Radio value={'default'}>Default</Radio>
                                    <Radio value={'customDNS'}>Custom DNS</Radio>
                                </Radio.Group>
                            </Form.Item>
                        </Form.Item>
                        <div className={'trackingContainer'}>
                            <Form.Item label={<strong>Tracking Domain Type</strong>}>
                                <Form.Item name={['formObj', 'trackingDomainType']} noStyle>
                                    {domainType === 'default' ? <Paragraph>Default Domain Name</Paragraph> :
                                        <Select showSearch placeholder="Tracking Domain" optionFilterProp="children"
                                                allowClear={true}
                                                filterOption={(input, option) => filterCountryOption(input, option)}>
                                            {allDomains.map(value => {
                                                return <Option value={value.label}
                                                               key={value.value}>{value.label}</Option>
                                            })}
                                        </Select>
                                    }
                                </Form.Item>
                            </Form.Item>
                            <Form.Item label={<strong>Tacking Sub-Domain</strong>}>
                                <Form.Item name={['formObj', 'trackingSubDomain']} noStyle>
                                    {domainType === 'default' ? <Paragraph>Default sub-domain Name</Paragraph> :
                                        <Select showSearch placeholder="Tracking Subdomain"
                                                optionFilterProp="children" allowClear={true}
                                                filterOption={(input, option) => filterCountryOption(input, option)}>
                                            {allSubDomains.map(value => {
                                                return <Option value={value.label}
                                                               key={value.value}>{value.label}</Option>
                                            })}
                                        </Select>
                                    }
                                </Form.Item>
                            </Form.Item>
                        </div>
                    </div>
                </div>
            </div>

        </Form>
    )
}
