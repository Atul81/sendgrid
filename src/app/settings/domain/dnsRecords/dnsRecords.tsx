import React, {useEffect, useState} from "react";
import {Button, message, Table} from "antd";
import Title from "antd/lib/typography/Title";
import {CheckOutlined, PlusOutlined} from "@ant-design/icons";
import {DnsRecordsInterface} from "../../settingsInterface";
import './../domain.scss';

export const DnsRecordsPage: any = (props: any) => {

    const generateCopiedMessage = (text: any) => {
        const columnVal = document.createElement('textarea');
        columnVal.value = text;
        document.body.appendChild(columnVal);
        columnVal.select();
        document.execCommand('copy');
        message.success(text.concat(' has been copied on your clipboard'), 0.7).then(() => {
        });
        document.body.removeChild(columnVal);
    }
    const columns = [
        {
            title: 'Type',
            dataIndex: 'type',
            key: 'type'
        },
        {
            title: 'DNS Name',
            dataIndex: 'dnsName',
            key: 'dnsName',
            render: ((text: string, record: any) => {
                return (
                    <div className='flexEqualSpacing' style={{paddingRight: '12%'}}>
                        <div>{record.dnsName} </div>
                        <div className={'copyText'} onClick={() => generateCopiedMessage(record.dnsName)}>Copy</div>
                    </div>
                );
            })
        },
        {
            title: 'Canonical Name',
            dataIndex: 'canonicalName',
            key: 'canonicalName',
            render: ((text: string, record: any) => {
                return (
                    <div className='flexEqualSpacing' style={{paddingRight: '12%'}}>
                        <div>{record.canonicalName} </div>
                        <div className={'copyText'} onClick={() => generateCopiedMessage(record.canonicalName)}>Copy
                        </div>
                    </div>
                );
            })
        }
    ];
    const verifyDomainSettings = () => {
        message.warn("Value has been successfully verified", 0.7);
    }

    const [dnsRecordsDS, setDnsRecordsDS] = useState<DnsRecordsInterface[]>([]);

    useEffect(() => {
        let data: DnsRecordsInterface[] = [];
        for (let i = 0; i < 100; i++) {
            data.push({
                key: i.toString(10),
                dnsName: `John`,
                canonicalName: `Doe ${i}`,
                type: 'CNAME'
            });
        }
        setDnsRecordsDS(data);
    }, []);

    return <div className="domain pageLayout">
        <div className="firstNav">
            <div className="leftPlacement">
                <Title level={4}>Install DNS Records</Title>
            </div>
            <div className="rightPlacement">
                <Button style={{width: 88, marginRight: 8}} type={'primary'} onClick={verifyDomainSettings}
                        icon={<CheckOutlined/>}>Verify</Button>
                <Button className={'addBtn'} icon={<PlusOutlined/>} onClick={props.exitToLandingPage}>Add Domain</Button>
            </div>
        </div>
        <div className="thirdNav" style={{height: 'calc(100vh - 238px)'}}>
            <Table scroll={{y: 'calc(100vh - 332px)'}} dataSource={dnsRecordsDS} columns={columns} bordered/>
        </div>
    </div>
}