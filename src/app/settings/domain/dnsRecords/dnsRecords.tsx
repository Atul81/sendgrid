import React, {useEffect, useState} from "react";
import {Button, message, Table} from "antd";
import Title from "antd/lib/typography/Title";
import {CheckOutlined, CopyOutlined, PlusOutlined} from "@ant-design/icons";
import {DnsRecordsInterface} from "../../settingsInterface";
import './../domain.scss';
import {getAllServerCall} from "../../../../service/serverCalls/mockServerRest";
import Search from "antd/es/input/Search";

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
    };

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
                        <div className={'copyText'} onClick={() => generateCopiedMessage(record.dnsName)}>
                            <CopyOutlined/></div>
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
                        <div className={'copyText'} onClick={() => generateCopiedMessage(record.canonicalName)}>
                            <CopyOutlined/>
                        </div>
                    </div>
                );
            })
        }
    ];
    const verifyDomainSettings = () => {
        message.warn("Value has been successfully verified", 0.7).then(() => {
        });
    }

    const [dnsRecordsDS, setDnsRecordsDS] = useState<DnsRecordsInterface[]>([]);
    const [dnsRecordsDSOps, setDnsRecordsDSOps] = useState<DnsRecordsInterface[]>([]);

    useEffect(() => {
        getAllServerCall('domain').then(async allDomainAsync => {
            let allDomainRes = await allDomainAsync.json();
            let data: DnsRecordsInterface[] = [];
            if (allDomainRes) {
                allDomainRes.forEach((itr: any) => {
                    data.push({...itr, key: itr.id});
                });
            }
            setDnsRecordsDS(data);
            setDnsRecordsDSOps(data);
        });
    }, []);

    const onSearchDnsRecords = (searchParam: string) => {
        setDnsRecordsDS(dnsRecordsDSOps.filter(value => {
            return value.dnsName.includes(searchParam);
        }));
    };

    return (
        <div className="domain pageLayout">
            <div className="secondNav">
                <Title level={4}>Install DNS Records</Title>
            </div>
            <div className="firstNav">
                <div className="leftPlacement">
                    <Search placeholder="input search text" onSearch={onSearchDnsRecords} enterButton/>
                </div>
                <div className="rightPlacement">
                    <Button style={{width: 72, marginRight: 8}} type={'primary'} onClick={verifyDomainSettings}
                            icon={<CheckOutlined/>}>Verify</Button>
                    <Button style={{width: 112}} icon={<PlusOutlined/>} onClick={props.exitToLandingPage}>Add
                        Domain</Button>
                </div>
            </div>
            <div className="thirdNav">
                <Table scroll={{y: 'calc(100vh - 326px)'}} dataSource={dnsRecordsDS} columns={columns} bordered/>
            </div>
        </div>
    )
}