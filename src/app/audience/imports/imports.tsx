import React, {useEffect, useState} from "react";
import {Space, Table, Typography} from "antd";
import {ImportsInterface} from "../audienceInterface";
import {RowDetailsPage} from "./details/RowDetailsLoadable";
import {updateBreadcrumb} from "../../../store/actions/root";
import {useDispatch} from "react-redux";
import {getAllServerCall} from "../../../service/serverCalls/mockServerRest";
import {getTimeFromUnix} from "../../../utils/common";
import Search from "antd/es/input/Search";
import {DownloadOutlined} from "@ant-design/icons";

export const ImportsPage: any = () => {
    const {Title} = Typography;
    const dispatch = useDispatch();

    useEffect(() => {
        getAllServerCall('imports').then(async response => {
            let tempObj: ImportsInterface[] = [];
            let res = await response.json();
            res.forEach((itr: any) => {
                tempObj.push({...itr, importTimestamp: getTimeFromUnix(itr.importTimestamp), key: itr.id});
            });
            setImportContactDS(tempObj);
            setImportContactOps(tempObj);
        });
    }, []);


    const [importContactDS, setImportContactDS] = useState<ImportsInterface[]>([]);
    const [importContactOps, setImportContactOps] = useState<ImportsInterface[]>([]);
    const showDownloadIcon = (rowCounts: string) => {
        let rowCountsSplit = rowCounts.split("/");
        return ((Number(rowCountsSplit[1]) - Number(rowCountsSplit[0])) <= 1000);
    }
    const columns = [
        {
            title: 'File Name',
            dataIndex: 'fileName',
            key: 'fileName',
            sorter: (a: any, b: any) => a.fileName.length - b.fileName.length,
            render: (text: string, record: any) => <span style={showDownloadIcon(record.rowsFraction) ? {cursor: "pointer", color: "#1890FF"}: {cursor: "not-allowed", fontWeight: 500}}
                                                         onClick={showDownloadIcon(record.rowsFraction) ? () => openRowDetails(record) : undefined}>{text}</span>
        },
        {
            title: 'Import Date & Time',
            dataIndex: 'importTimestamp',
            key: 'importTimestamp',
            sorter: (a: any, b: any) => a.importTimestamp.length - b.importTimestamp.length,
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            sorter: (a: any, b: any) => a.status.length - b.status.length,
        },
        {
            title: 'Row Imported/Total Rows',
            dataIndex: 'rowsFraction',
            key: 'rowsFraction',
            sorter: (a: any, b: any) => a.rowsFraction.length - b.rowsFraction.length
        },
        {
            dataIndex: '',
            key: 'action',
            width: '75px',
            render: ((text: string, record: any) => {
                return (!showDownloadIcon(record.rowsFraction) ? <Space size="small">
                    <p className={"actionColumn noMarginIcon"}>
                        <DownloadOutlined/></p></Space> : null)

            }),
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
    const onSearchImports = (searchParam: string) => {
        setImportContactDS(importContactOps.filter(value => {
            return value.fileName.includes(searchParam);
        }));
    };
    return !rowDetailsPage ? (
        <div className="pageLayout">
            <div className="secondNav">
                <Title level={4}>All Imports</Title>
            </div>
            <div className="firstNav">
                <div className="leftPlacement">
                    <div className="searchInput">
                        <Search placeholder="input search text" onSearch={onSearchImports} enterButton/>
                    </div>
                </div>
            </div>
            <div className="thirdNav">
                <Table columns={columns} dataSource={importContactDS} bordered/>
            </div>
        </div>
    ) : <RowDetailsPage rowObj={uploadObj} routeToOverview={navigateToLandingPage}/>
}
