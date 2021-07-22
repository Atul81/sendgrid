import React, {useEffect, useState} from "react";
import {Button, message, Popconfirm, Space, Table} from "antd";
import Title from "antd/lib/typography/Title";
import {DeleteOutlined, EyeOutlined, PlusOutlined} from "@ant-design/icons";
import {DnsRecordsInterface} from "../../settingsInterface";
import './../domain.scss';
import {getAllServerCall} from "../../../../service/serverCalls/mockServerRest";
import Search from "antd/es/input/Search";
import Tag from "antd/es/tag";
import {DomainModalPage} from "../modal/domainModal";
import {GET_SERVER_ERROR} from "../../../../utils/common";

export const DnsRecordsPage: any = (props: any) => {
    const columns = [
        {
            title: 'Domain',
            dataIndex: 'domain',
            key: 'domain',
            width: '70%',
            sorter: (a: any, b: any) => a.domain.length - b.domain.length
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            sorter: (a: any, b: any) => a.status.length - b.status.length,
            render: (text: any, record: any) => {
                return (
                    <Tag color={record.status === 'Active' ? 'green' : 'purple'} key={record.key}>{text}</Tag>
                );
            }
        },
        {
            dataIndex: '',
            key: 'action',
            width: '75px',
            render: ((text: string, record: any) => {
                return <Space size="small">
                    {record.status === 'Active' ?
                        <p className={"actionColumn"} onClick={() => viewDomainSettings(record)}><EyeOutlined/>
                        </p> : null}
                    <Popconfirm overlayClassName="ant-popover-audience" placement="left"
                                title={<p><Title level={5}>Are you sure you want to delete?</Title>
                                    This will permanently delete these records and all associated data from your
                                    account. Deleting and re-adding records can alter your monthly contact limits.
                                    <a href={'https://programmablesearchengine.google.com/about/'} target={'_blank'}
                                       rel={'noreferrer'}>Learn More</a></p>}
                                okText="Delete" cancelText="Cancel"
                                onConfirm={() => deleteSetting(record)}>
                        <p className={"actionColumn"}><DeleteOutlined/></p>
                    </Popconfirm>
                </Space>
            })
        }
    ];

    const [domainObj, setDomainObj] = useState({});
    const [openDomainModal, setDomainModal] = useState(false);

    const viewDomainSettings = (record: any) => {
        setDomainObj(record);
        setDomainModal(true);
    }

    const deleteSetting = (record: any) => {
        console.log(record)
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
        }).catch(reason => {
            console.log(reason);
            message.error(GET_SERVER_ERROR, 0.8).then(() => {
            });
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
                    <Button style={{width: 112}} type={'primary'} icon={<PlusOutlined/>}
                            onClick={props.exitToLandingPage}>Add
                        Domain</Button>
                </div>
            </div>
            <div className="thirdNav">
                <Table scroll={{y: 'calc(100vh - 416px)'}} dataSource={dnsRecordsDS} columns={columns} bordered/>
            </div>
            {openDomainModal ? <DomainModalPage visibility={openDomainModal} domainObj={domainObj} openType={'view'}
                                                closeDomainPage={() => setDomainModal(false)}/> : null}
        </div>
    )
}
