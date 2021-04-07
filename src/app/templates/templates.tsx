import React, {useEffect, useState} from "react";
import {useSelector} from "react-redux";
import {Button, Card, Popover, Skeleton} from "antd";
import {EllipsisOutlined, PlusOutlined} from "@ant-design/icons";
import {templateTest} from '../../utils/templateTest'
import Meta from "antd/es/card/Meta";
import './templates.scss';

export const TemplatesPage: any = () => {

    const activeMenu = useSelector((state: any) => state.root.activeContent);
    const [ieFrameType, setIeFrameType] = useState('');
    const [openIeFrame, setOpenIeFrame] = useState(false);
    const [templateObj, setTemplateObj] = useState({});
    useEffect(() => {
        setIeFrameType(activeMenu);
        setOpenIeFrame(false);
        if (activeMenu !== 'templates') {
            setOpenIeFrame(true);
        }
    }, [activeMenu]);

    const addNewSegment = () => {
        setIeFrameType('newTemplate');
        setOpenIeFrame(true);
    };

    const getIeFrameSource = () => {
        switch (ieFrameType) {
            case 'newTemplate' :
                return 'https://www.google.com';
            case 'template-editor' :
                return 'https://ant.design/';
            case 'delivery-testing' :
                return 'https://pro.ant.design/';
        }
    };

    const templateContent = (
        <div className={'contentListing'}>
            <p onClick={() => console.log(templateObj)}>Edit</p>
            <p>Duplicate</p>
        </div>
    );

    return !openIeFrame ? (
        <div className="templates pageLayout">
            <div className="firstNav">
                <div className="leftPlacement">
                    <Button type={'primary'} className="addBtn" onClick={addNewSegment} icon={<PlusOutlined/>}>Add
                        New</Button>
                </div>
            </div>
            <div className="cardContainer">
                <div className="cardDiv">
                    {templateTest.map(value => {
                        return <Card style={{marginTop: 16}}
                                     cover={
                                         <img
                                             alt="example"
                                             src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
                                         />}>
                            <Skeleton loading={false} avatar active>
                                <Meta title={<div className={'flexEqualSpacing'}>
                                    <div className={'textOverflow'}>{value.title}</div>
                                    <div>
                                        <Popover placement="leftBottom" content={templateContent} trigger="click">
                                            <EllipsisOutlined onClick={() => setTemplateObj(value)}/>
                                        </Popover></div>
                                </div>}
                                />
                            </Skeleton>
                        </Card>
                    })}
                </div>
            </div>
        </div>
    ) : <iframe title={"Analytics Dashboard"}
                style={{margin: -24, height: 'calc(100vh - 128px)', width: 'calc(100vw - 232px)'}}
                src={getIeFrameSource()}/>;
}