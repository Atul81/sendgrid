import React, {useEffect, useState} from "react";
import {Button, Form, Input} from "antd";
import {CheckOutlined, StepBackwardOutlined} from "@ant-design/icons";
import Title from "antd/lib/typography/Title";
import './domain.scss';
import {DnsRecordsPage} from "./dnsRecords/DnsRecordsLoadable";
import {addNewObject} from "../../../service/serverCalls/mockServerRest";
import {useDispatch} from "react-redux";
import {updateActiveContent, updateBreadcrumb} from "../../../store/actions/root";
import {urlRegexValidation} from "../../../utils/common";
import {DomainModalPage} from "./modal/domainModal";

export const DomainSettingsPage: any = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(updateBreadcrumb(['Settings', 'domain']));
        dispatch(updateActiveContent('domain'));
    }, [dispatch]);

    const [domainForm] = Form.useForm();

    const [newDomainSettings, setNewDomainSettings] = useState(false);
    const [domainId, setDomainId] = useState(12);
    const [domainObj, setDomainObj] = useState({});
    const proceedDomainSettings = (values: any) => {
        let newDomainObj = values.formObj;
        addNewObject({
            id: domainId,
            domain: newDomainObj.domainName,
            dkimSettings: newDomainObj.dkimSettings,
            status: 'Processed'
        }, 'domain').then(async newDomainObjAsync => {
            let newDnsRecordRes = await newDomainObjAsync.json();
            if (newDnsRecordRes) {
                setDomainId(domainId + 1);

                setDomainModal(true);
                setDomainObj(newDnsRecordRes);
            }
        });
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

    const [openDomainModal, setDomainModal] = useState(false);

    return newDomainSettings ? (<div className={'domain'}>
        <Form form={domainForm} layout={'vertical'} onFinish={proceedDomainSettings}>
            <div className="pageLayout">
                <div className="firstNav">
                    <div className="leftPlacement">
                        <Title level={4}>Add Domain</Title>
                    </div>
                    <div className="rightPlacement">
                        <Button style={{width: 76}} onClick={cancelNewDomain}
                                icon={<StepBackwardOutlined/>}>Cancel</Button>
                        <Button style={{width: 144, marginLeft: 8}} type={'primary'} htmlType={"submit"}
                                icon={<CheckOutlined/>}>Verify This Domain</Button>
                    </div>
                </div>
                <div className="thirdNav" style={{height: 'calc(100vh - 238px)'}}>
                    <Form.Item label={<strong>Domain</strong>}>
                        <Form.Item name={['formObj', 'domainName']}
                                   noStyle
                                   rules={[{required: true, message: 'Domain Name required'}, urlRegexValidation]}>
                            <Input className={'maxWidth'} placeholder="Form Domain" type={'text'}/>
                        </Form.Item>
                    </Form.Item>
                </div>
            </div>
        </Form>
        {openDomainModal ? <DomainModalPage visibility={openDomainModal} domainObj={domainObj} openType={'create'}
                                            closeDomainPage={() => setDomainModal(false)}/> : null}
    </div>) : <DnsRecordsPage exitToLandingPage={exitToDataView}/>
}
