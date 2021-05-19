import React, {useEffect, useState} from "react";
import {useSelector} from "react-redux";
import {Button, Card, Modal, Popover, Skeleton} from "antd";
import {EllipsisOutlined, PlusOutlined} from "@ant-design/icons";
import Meta from "antd/es/card/Meta";
import './templates.scss';
import {useHistory} from "react-router-dom";
import {getAllServerCall} from "../../service/serverCalls/mockServerRest";
import Title from "antd/es/typography/Title";
import Search from "antd/es/input/Search";
import {BeeTemplatePage} from "./beePlugin/beeTemplatePage";

interface TemplatesInterface {
    "id": number,
    "title": string,
    "authors": string,
    "average_rating": number,
    "isbn": number,
    "language_code": string,
    "ratings_count": number,
    "price": number
}

export const TemplatesPage: any = () => {

    const activeMenu = useSelector((state: any) => state.root.activeContent);
    const [openIeFrame, setOpenIeFrame] = useState(false);
    const [templateObj, setTemplateObj] = useState({});
    const history = useHistory();
    const [templatesDS, setTemplateDS] = useState<TemplatesInterface[]>([]);
    const [templatesDSOps, setTemplateDSOps] = useState<TemplatesInterface[]>([]);
    const [beeOpenType, setBeeOpenType] = useState('newTemplate');

    useEffect(() => {
        setOpenIeFrame(false);
        if (activeMenu === 'delivery-testing') {
            setOpenIeFrame(true);
            setBeeOpenType('newTemplate');
        } else {
            getAllTemplates();
        }
    }, [activeMenu, history]);

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
        history.push("/templates/templates");
    };

    const getAllTemplates = () => {
        getAllServerCall('templates').then(async allTemplatesAsync => {
            let allTemplatesRes = await allTemplatesAsync.json();
            if (allTemplatesRes) {
                setTemplateDS(allTemplatesRes);
                setTemplateDSOps(allTemplatesRes);
            }
        });
    };

    const onSearchTemplates = (searchParam: string) => {
        setTemplateDS(templatesDSOps.filter(value => {
            return value.title.includes(searchParam);
        }));
    };

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
                    {templatesDS.map(value => {
                        return (
                            <Card key={value.id} style={{marginTop: 16}} cover={<img alt="example"
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
            </div>
        </div>
    ) : <Modal className={'fullScreenModal'} visible={true} width={'100%'} footer={null}
               onCancel={exitTemplate}>
        <div style={{width: '100%', height: 'calc(100vh - 72px)', marginTop: 24}}>
            <BeeTemplatePage existingTemplate={templateObj} requestType={beeOpenType}/>
        </div>
    </Modal>
}