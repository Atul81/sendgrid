import React, {useEffect, useState} from "react";
import {Button, message, Popconfirm, Space, Table, Tag} from "antd";
import {DedicatedIpsInterface} from "../settingsInterface";
import {DeleteOutlined, PlusOutlined} from "@ant-design/icons";
import Title from "antd/lib/typography/Title";
import {deleteObjectById, getAllServerCall} from "../../../service/serverCalls/mockServerRest";
import Search from "antd/es/input/Search";

export const DedicatedIpsPage: any = () => {

    const [dedicatedIpsDS, setDedicatedIpsDS] = useState<DedicatedIpsInterface[]>([]);
    const [dedicatedIpsDSOps, setDedicatedIpsDSOps] = useState<DedicatedIpsInterface[]>([]);

    useEffect(() => {
        populateTableData();
    }, []);

    const populateTableData = () => {
        getAllServerCall('dedicatedIps').then(async allDomainAsync => {
            let allDomainRes = await allDomainAsync.json();
            let data: DedicatedIpsInterface[] = [];
            if (allDomainRes) {
                allDomainRes.forEach((itr: any) => {
                    data.push({...itr, key: itr.id, purchaseDate: new Date(itr.purchaseDate).toDateString()});
                });
            }
            setDedicatedIpsDS(data);
            setDedicatedIpsDSOps(data);
        });
    };

    const deleteDedicatedIps = (record: any) => {
        deleteObjectById(record.key, 'dedicatedIps').then(async delDedicatedIpAsync => {
            let delDedicatedIpRes = await delDedicatedIpAsync.json();
            if (delDedicatedIpRes) {
                message.success(`Dedicated Ip ${record.ipAddress} has been successfully deleted`);
                populateTableData();
            }
        });
    };

    const columns = [
        {
            title: 'IP Address',
            dataIndex: 'ipAddress',
            key: 'ipAddress',
            width: '65%'
        },
        {
            title: 'Purchase Date',
            dataIndex: 'purchaseDate',
            key: 'purchaseDate'
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: ((text: string, record: any) => {
                return (
                    <Tag key={record.key} color={text === 'Active' ? 'green' : 'red'}>{text}</Tag>
                );
            }),
            width: '10%'
        },
        {
            title: 'Action',
            dataIndex: '',
            key: 'action',
            width: '75px',
            render: ((text: string, record: any) => {
                return <Space size="small">
                    <Popconfirm overlayClassName="ant-popover-audience" placement="left"
                                title={<p><Title level={5}>Are you sure you want to delete?</Title>
                                    This will permanently delete these records and all associated data from your
                                    account. Deleting and re-adding records can alter your monthly contact limits. <a>Learn
                                        More</a></p>}
                                okText="Delete" cancelText="Cancel"
                                onConfirm={() => deleteDedicatedIps(record)}>
                        <p className={"actionColumn noMarginIcon"}><DeleteOutlined/></p>
                    </Popconfirm>
                </Space>
            })
        }
    ];
    const addNewDedicatedIp = () => {
        message.warn("Pending design, Work In Progress", 0.7).then(() => {
        });
    };

    const onSearchDedicatedIps = (searchParam: string) => {
        setDedicatedIpsDS(dedicatedIpsDSOps.filter(value => {
            return value.ipAddress.includes(searchParam);
        }));
    };

    return <div className="domain pageLayout">
        <div className="secondNav">
            <Title level={4}>All Dedicated Ips</Title>
        </div>
        <div className="firstNav">
            <div className="leftPlacement">
                <div className="searchInput">
                    <Search placeholder="input search text" onSearch={onSearchDedicatedIps} enterButton/>
                </div>
            </div>
            <div className="rightPlacement">
                <Button className={'addBtn'} type={'primary'} onClick={addNewDedicatedIp}
                        icon={<PlusOutlined/>}>Add New</Button>
            </div>
        </div>

        <div className="thirdNav">
            <Table dataSource={dedicatedIpsDS} columns={columns} bordered/>
        </div>
    </div>
}