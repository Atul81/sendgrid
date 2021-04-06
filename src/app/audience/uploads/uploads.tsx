import React, {useState} from "react";
import {Table, Typography} from "antd";
import {UploadInterface} from "../contactInterface";
import {RowDetailsPage} from "./details/RowDetailsLoadable";
import {updateBreadcrumb} from "../../../store/actions/root";
import {useDispatch} from "react-redux";

export const UploadsPage: any = () => {
    const {Title} = Typography;
    const dispatch = useDispatch();
    const [uploadDS, setUploadDS] = useState<UploadInterface[]>([
        {
            key: '1',
            fileName: 'Chicago_contacts.csv',
            uploadTimestamp: new Date().toLocaleTimeString('kok-IN', {
                hour12: false,
                day: '2-digit',
                month: '2-digit',
                year: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
            }),
            rowsFraction: '143/167'
        },
        {
            key: '2',
            fileName: 'omni_campaign_subscribers_list.csv',
            uploadTimestamp: new Date().toLocaleTimeString('kok-IN', {
                hour12: false,
                day: '2-digit',
                month: '2-digit',
                year: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
            }),
            rowsFraction: '2451/2839'
        }
    ]);
    const columns = [
        {
            title: 'File Name',
            dataIndex: 'fileName',
            key: 'fileName',
            render: (text: string, record: any) => <span style={{cursor: "pointer", color: "#1890FF"}}
                                                         onClick={() => openRowDetails(record)}>{text}</span>,
        },
        {
            title: 'Upload Date & Time',
            dataIndex: 'uploadTimestamp',
            key: 'uploadTimestamp',
        },
        {
            title: 'Row Imported/Total Rows',
            dataIndex: 'rowsFraction',
            key: 'rowsFraction',
        }
    ];
    const [uploadObj, setUploadObj] = useState({});
    const [rowDetailsPage, openRowDetailsPage] = useState(false);
    const openRowDetails = (record: any) => {
        setUploadObj(record);
        openRowDetailsPage(true);
    };
    const navigateToLandingPage = () => {
        dispatch(updateBreadcrumb(['Audience', 'Contacts']));
        setUploadObj({});
        openRowDetailsPage(false);
    };
    return !rowDetailsPage ? (
        <div className="pageLayout">
            <div className="secondNav">
                <Title level={4}>All Uploads</Title>
            </div>
            <div className="thirdNav" style={{height: 'calc(100vh - 228px)'}}>
                <Table columns={columns} dataSource={uploadDS} bordered/>
            </div>
        </div>
    ) : <RowDetailsPage rowObj={uploadObj} routeToOverview={navigateToLandingPage}/>
}