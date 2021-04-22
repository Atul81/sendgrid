import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {Button, Card, Popover, Skeleton} from "antd";
import {EllipsisOutlined, PlusOutlined} from "@ant-design/icons";
import {templateTest} from '../../utils/templateTest'
import Meta from "antd/es/card/Meta";
import './templates.scss';
import {TemplateIeFrame} from "./templateIeFrame";
import {useHistory} from "react-router-dom";
import {updateActiveContent} from "../../store/actions/root";

export const TemplatesPage: any = () => {

    const activeMenu = useSelector((state: any) => state.root.activeContent);
    const [ieFrameType, setIeFrameType] = useState('');
    const [openIeFrame, setOpenIeFrame] = useState(false);
    const [templateObj, setTemplateObj] = useState({});
    const history = useHistory();

    useEffect(() => {
        setIeFrameType(activeMenu);
        setOpenIeFrame(false);
        if (activeMenu === 'template-editor' || activeMenu === 'delivery-testing') {
            setOpenIeFrame(true);
        }
    }, [activeMenu]);


    const addNewSegment = () => {
        setOpenIeFrame(true);
        setIeFrameType('newTemplate');
    };

    const getIeFrameSource = () => {
        switch (ieFrameType) {
            case 'newTemplate' :
                return 'https://programmablesearchengine.google.com';
            case 'template-editor' :
                return 'https://programmablesearchengine.google.com';
            case 'delivery-testing' :
                return 'https://programmablesearchengine.google.com';
        }
    };

    const templateContent = (
        <div className={'contentListing'}>
            <p onClick={() => console.log(templateObj)}>Edit</p>
            <p>Duplicate</p>
        </div>
    );

    const exitTemplate = () => {
        setOpenIeFrame(false);
        history.push("/templates/templates");
    };

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
    ) : <TemplateIeFrame ieFrameSrc={getIeFrameSource()} exitTemplateEdit={exitTemplate}/>;
}