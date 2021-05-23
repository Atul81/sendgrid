import React, {useEffect, useState} from "react";
import {Modal, Space, Table, Tag, Typography} from "antd";
import {useDispatch} from "react-redux";
import {getAllServerCall} from "../../../service/serverCalls/mockServerRest";
import {getTimeFromUnix} from "../../../utils/common";
import {updateBreadcrumb} from "../../../store/actions/root";
import Search from "antd/es/input/Search";
import {DeliveryTestingInterface} from "../templatesInterface";
import {BeeTemplatePage} from "./beePlugin/beeTemplatePage";
import {EyeOutlined} from "@ant-design/icons";

export const DeliveryTestingPage = () => {
    const {Title} = Typography;
    const dispatch = useDispatch();

    useEffect(() => {
        getAllServerCall('deliveryTesting').then(async response => {
            let tempObj: DeliveryTestingInterface[] = [];
            let res = await response.json();
            res.forEach((itr: any) => {
                tempObj.push({...itr, dateTime: getTimeFromUnix(itr.dateTime), key: itr.id});
            });
            setDeliveryTesting(tempObj);
            setDeliveryTestingOps(tempObj);
        });
    }, []);


    const [deliveryTesting, setDeliveryTesting] = useState<DeliveryTestingInterface[]>([]);
    const [deliveryTestingOps, setDeliveryTestingOps] = useState<DeliveryTestingInterface[]>([]);
    const columns = [
        {
            title: 'Test Name',
            dataIndex: 'testName',
            key: 'testName',
            render: (text: string, record: any) => <span style={{cursor: "pointer", color: "#1890FF"}}
                                                         onClick={() => openBeePlugin(record)}>{text}</span>,
        },
        {
            title: 'Date & Time',
            dataIndex: 'dateTime',
            key: 'dateTime',
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: ((text: string, record: any) => {
                return (
                    <Tag key={record.key} color={text === 'Done' ? 'green' : 'geekblue'}>{text}</Tag>
                );
            }),
        },
        {
            dataIndex: '',
            key: 'action',
            width: '75px',
            render: ((text: string, record: any) => {
                return record.status === 'Done' ? <Space size="small">
                    <p className={"actionColumn"} onClick={() => openBeePlugin(record)}><EyeOutlined/></p>
                </Space> : null
            })
        }
    ];

    const [deliveryObj, setDeliveryObj] = useState({});
    const [openIeFrame, setOpenIeFrame] = useState(false);
    const openBeePlugin = (record: any) => {
        setDeliveryObj(record);
        setOpenIeFrame(true);
    };
    const navigateToLandingPage = () => {
        dispatch(updateBreadcrumb(['templates', 'delivery-testing']));
        setDeliveryObj({});
        setOpenIeFrame(false);
    };
    const onSearchImports = (searchParam: string) => {
        setDeliveryTesting(deliveryTestingOps.filter(value => {
            return value.testName.includes(searchParam);
        }));
    };
    return !openIeFrame ? (
        <div className="pageLayout">
            <div className="secondNav">
                <Title level={4}>All Tests</Title>
            </div>
            <div className="firstNav">
                <div className="leftPlacement">
                    <div className="searchInput">
                        <Search placeholder="input search text" onSearch={onSearchImports} enterButton/>
                    </div>
                </div>
            </div>
            <div className="thirdNav">
                <Table columns={columns} dataSource={deliveryTesting} bordered/>
            </div>
        </div>
    ) : <Modal className={'fullScreenModal'} title={'Delivery Report'} visible={true} width={'100%'} footer={null}
               onCancel={navigateToLandingPage}>
        <div style={{width: '100%', height: 'calc(100vh - 104px)'}}>
            <BeeTemplatePage existingTemplate={deliveryObj} requestType={'view'}/>
        </div>
    </Modal>
}
