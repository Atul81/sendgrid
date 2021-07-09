import React, {useEffect, useState} from "react";
import {useSelector} from "react-redux";
import {Button, Card, message, Modal, Pagination, Popover, Skeleton} from "antd";
import {EllipsisOutlined, PlusOutlined} from "@ant-design/icons";
import Meta from "antd/es/card/Meta";
import './templates.scss';
import {getAllServerCall} from "../../../service/serverCalls/mockServerRest";
import Title from "antd/es/typography/Title";
import Search from "antd/es/input/Search";
import {BeeTemplatePage} from "../deliveryTesting/beePlugin/beeTemplatePage";
import {TemplatesInterface} from "../templatesInterface";
import {GET_SERVER_ERROR} from "../../../utils/common";

export const TemplatesPage: any = () => {

    const activeMenu = useSelector((state: any) => state.root.activeContent);
    const [openIeFrame, setOpenIeFrame] = useState(false);
    const [templateObj, setTemplateObj] = useState({});
    const [templatesDS, setTemplateDS] = useState<TemplatesInterface[]>([]);
    const [templatesDSOps, setTemplateDSOps] = useState<TemplatesInterface[]>([]);
    const [beeOpenType, setBeeOpenType] = useState('newTemplate');

    useEffect(() => {
        getAllTemplates('templates');
    }, [activeMenu]);

    const addNewSegment = () => {
        setOpenIeFrame(true);
    };

    const openEllipsisFrame = (ellipsisType: string) => {
        setOpenIeFrame(true);
        setBeeOpenType(ellipsisType);
    };

    const templateContent = (
        <div className={'contentListing'}>
            <p onClick={() => openEllipsisFrame('edit')}>Edit</p>
            <p onClick={() => openEllipsisFrame('duplicate')}>Duplicate</p>
        </div>
    );

    const exitTemplate = () => {
        setOpenIeFrame(false);
    };

    const getAllTemplates = (url: string) => {
        getAllServerCall(url).then(async allTemplatesAsync => {
            let allTemplatesRes = await allTemplatesAsync.json();
            if (allTemplatesRes) {
                setTemplateDS(allTemplatesRes);
                setTemplateDSOps(allTemplatesRes);
            }
        }).catch(reason => {
            console.log(reason);
            message.error(GET_SERVER_ERROR, 0.8).then(() => {
            });
        });
    };

    const onSearchTemplates = (searchParam: string) => {
        setTemplateDS(templatesDSOps.filter(value => {
            return value.title.includes(searchParam);
        }));
    };

    const handlePagination = () => {
        getAllTemplates('templatesP');
    }
    return !openIeFrame ? (
        <div className="templates pageLayout">
            <div className="secondNav">
                <Title level={4}>All Templates</Title>
            </div>
            <div className="firstNav">
                <div className="leftPlacement">
                    <div className="searchInput">
                        <Search placeholder="input search text" onSearch={onSearchTemplates} enterButton/>
                    </div>
                </div>
                <div className="rightPlacement">
                    <Button type={'primary'} style={{width: 102}} onClick={addNewSegment} icon={<PlusOutlined/>}>Add
                        New</Button>
                </div>
            </div>
            <div className="cardContainer">
                <div className="cardDiv">
                    {templatesDS && templatesDS.length > 0 && templatesDS.slice(0, 8).map(value => {
                        return (
                            <Card key={value.id} style={{marginTop: 16}}
                                  cover={<img alt="example"
                                              src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"/>}>
                                <Skeleton loading={false} avatar active>
                                    <Meta title={
                                        <div className={'flexEqualSpacing'}>
                                            <div className={'textOverflow'}>{value.title}</div>
                                            <div>
                                                <Popover placement="leftBottom" content={templateContent}
                                                         trigger="click">
                                                    <EllipsisOutlined onClick={() => setTemplateObj(value)}/>
                                                </Popover>
                                            </div>
                                        </div>}
                                    />
                                </Skeleton>
                            </Card>
                        )
                    })}
                </div>
                <div className='reverseFlex'>
                    <Pagination defaultPageSize={8} defaultCurrent={1} total={templatesDS.length * 2} onChange={handlePagination}
                                showTotal={(total, range) => `${range[0]}-${range[1]} of ${total} items`}/>
                </div>
            </div>
        </div>
    ) : <Modal className={'fullScreenModal'} title={'Add/Edit Template'} visible={true} width={'100%'} footer={null}
               onCancel={exitTemplate}>
        <div style={{width: '100%', height: 'calc(100vh - 104px)'}}>
            <BeeTemplatePage existingTemplate={templateObj} requestType={beeOpenType}/>
        </div>
    </Modal>
}
