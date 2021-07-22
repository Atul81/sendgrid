import React, {useEffect, useState} from "react";
import {Alert, Button, Descriptions, message, Modal, Table} from "antd";
import './domainModal.scss';
import Title from "antd/es/typography/Title";
import {DomainModal} from "../../settingsInterface";
import {getAllServerCall} from "../../../../service/serverCalls/mockServerRest";
import {CopyOutlined, DownloadOutlined} from "@ant-design/icons";
import {exportCSVFile, generateCopiedMessage, GET_SERVER_ERROR} from "../../../../utils/common";

export const DomainModalPage = (props: any) => {
    useEffect(() => {
        getAllServerCall("utils").then(async getDomainDetailsAsync => {
            let domainDetailsRes = await getDomainDetailsAsync.json();
            if (domainDetailsRes && domainDetailsRes.domainSettings) {
                let domainData = domainDetailsRes.domainSettings;
                let tempObj: DomainModal[] = [];
                tempObj.push({
                    ...domainData.verificationRecord,
                    key: props.domainObj.key,
                    name: props.domainObj.domain
                });
                if (domainData.records) {
                    domainData.records.forEach((record: any) => {
                        tempObj.push({
                            ...record,
                            name: record.name.concat(props.domainObj.domain),
                            value: record.value.concat(props.domainObj.domain)
                        })
                    })
                    setDomainRecords(tempObj);
                }
            }
        }).catch(reason => {
            console.log(reason);
            message.error(GET_SERVER_ERROR, 0.8).then(() => {
            });
        });
    }, [])
    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            render: ((text: string, record: any) => {
                return (
                    <div className='flexEqualSpacing'>
                        <span style={{color: "#1890FF"}}>{text}</span>
                        <div className={'copyText'} onClick={() => generateCopiedMessage(record.name)}><CopyOutlined/>
                        </div>
                    </div>
                );
            })
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
            render: ((text: string, record: any) => {
                return (
                    <div className='flexEqualSpacing'>
                        <span style={{color: "#1890FF"}}>{text}</span>
                        <div className={'copyText'} onClick={() => generateCopiedMessage(record.value)}><CopyOutlined/>
                        </div>
                    </div>
                );
            })
        }
    ];
    const [domainRecords, setDomainRecords] = useState<DomainModal[]>([]);

    const downloadDomainInfo = () => {
        let str = 'S No.,'.concat(columns.map(itr => itr.title).join(','));
        let sNo = 0;
        domainRecords.forEach(item => {
            sNo = item.key ? parseInt(item.key, 10) : sNo;
            let currentRow = sNo + "," + item.name + "," + item.type + "," + item.value;
            str = str + "\n" + currentRow;
            sNo = sNo + 1;
        });
        exportCSVFile(str, 'Domain-'.concat(props.domainObj.domain));
    }
    return <Modal wrapClassName='modalWrapper'
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
        <Title level={5}>Domain Verification& DKIM Records</Title>
        <Table columns={columns} dataSource={domainRecords} pagination={false} bordered/>
    </Modal>
}
