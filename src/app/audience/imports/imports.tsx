import React, {useEffect, useState} from "react";
import {Table, Typography} from "antd";
import {ImportsInterface} from "../audienceInterface";
import {RowDetailsPage} from "./details/RowDetailsLoadable";
import {updateBreadcrumb} from "../../../store/actions/root";
import {useDispatch} from "react-redux";
import {getAllServerCall} from "../../../service/serverCalls/mockServerRest";
import {getTimeFromUnix} from "../../../utils/common";
import Search from "antd/es/input/Search";

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
    const columns = [
        {
            title: 'File Name',
            dataIndex: 'fileName',
            key: 'fileName',
            render: (text: string, record: any) => <span style={{cursor: "pointer", color: "#1890FF"}}
                                                         onClick={() => openRowDetails(record)}>{text}</span>,
        },
        {
            title: 'Import Date & Time',
            dataIndex: 'importTimestamp',
            key: 'importTimestamp',
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
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