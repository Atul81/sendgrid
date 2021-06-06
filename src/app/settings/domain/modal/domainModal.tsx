import React, {useEffect, useState} from "react";
import {Alert, Button, Descriptions, Modal, Table} from "antd";
import './domainModal.scss';
import Title from "antd/es/typography/Title";
import {DomainModal} from "../../settingsInterface";
import Paragraph from "antd/es/typography/Paragraph";
import {getAllServerCall} from "../../../../service/serverCalls/mockServerRest";
import {DownloadOutlined, DownOutlined} from "@ant-design/icons";
import {exportCSVFile} from "../../../../utils/common";

export const DomainModalPage = (props: any) => {
    useEffect(() => {
        getAllServerCall("utils").then(async getDomainDetailsAsync => {
            let domainDetailsRes = await getDomainDetailsAsync.json();
            if (domainDetailsRes && domainDetailsRes.domainSettings) {
                let domainData = domainDetailsRes.domainSettings;
                setVerificationRecordDS([{
                    ...domainData.verificationRecord,
                    key: props.domainObj.key,
                    name: props.domainObj.domain
                }]);
                if (domainData.records) {
                    let tempObj: DomainModal[] = [];
                    domainData.records.forEach((record: any) => {
                        tempObj.push({
                            ...record,
                            name: record.name.concat(props.domainObj.domain),
                            value: record.value.concat(props.domainObj.domain)
                        })
                    })
                    setDkimRecordsDS(tempObj);
                }
            }
        });
    }, [])
    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            render: (text: string, record: any) => <span style={{color: "#1890FF"}}>{text}</span>
        },
        {
            title: 'Type',
            dataIndex: 'type',
            key: 'type',
        },
        {
            title: 'Value',
            dataIndex: 'value',
            key: 'value',
        }
    ];
    const [verificationRecordDS, setVerificationRecordDS] = useState<DomainModal[]>([]);
    const [dkimRecordsDS, setDkimRecordsDS] = useState<DomainModal[]>([]);

    const downloadDomainInfo = () => {
        let str = columns.map(itr => itr.title).join(",");
        verificationRecordDS.forEach(item => {
            let currentRow = item.key + "," + item.name + "," + item.type + "," + item.value;
            str = str + "\n" + currentRow;
        });
        exportCSVFile(str, 'Domain-'.concat(props.domainObj.domain));
        str = '';
        dkimRecordsDS.forEach(item => {
            let currentRow = item.key + "," + item.name + "," + item.type + "," + item.value;
            str = str + "\n" + currentRow;
        });
        exportCSVFile(str, 'DKIM_Records-'.concat(props.domainObj.domain));
    }
    return <Modal wrapClassName={'modalWrapper'}
                  title={props.openType === 'create' ? "Verify New Domain" : props.domainObj.domain} centered
                  visible={props.visibility} width={'50%'} footer={null} destroyOnClose={true}
                  onCancel={props.closeDomainPage}>
        {props.openType === 'create' ? <Alert type={"success"} closeText="Close Now" style={{marginBottom: 6}}
                                              message={<span>Success! <strong>{props.domainObj.domain}</strong> has been added</span>}
                                              banner={true}
                                              closable/> : null}
        <div style={{display: "flex"}}>
            <Descriptions>
                <Descriptions.Item label={<strong>Status</strong>}>{props.domainObj.status}</Descriptions.Item>
            </Descriptions>
            <Button type={"primary"} icon={<DownloadOutlined/>} onClick={downloadDomainInfo}>Download</Button>
        </div>
        <Title level={5}>Domain Verification Record</Title>
        <Table columns={columns} dataSource={verificationRecordDS} pagination={false} bordered/>
        <Paragraph>Add the following CNAME records in your domain's DNS settings for DKIM <span
            style={{color: "gray"}}>(optional)</span></Paragraph>
        <Title level={5}>DKIM Records</Title>
        <Table columns={columns} pagination={false} dataSource={dkimRecordsDS} bordered/>
    </Modal>
}
