import React, {memo} from 'react';

import {Handle} from 'react-flow-renderer';
import {Card} from "antd";
import {CloseOutlined} from "@ant-design/icons";
import './amendAutomation.scss';

export default memo(({data}) => {
    return (
        <>
            <Handle
                type="target"
                position="top"
                style={{top: 30, background: '#555'}}
                id='aT'
                onConnect={(params) => console.log('handle onConnect', params)}
            />
            <Card title={<div className='titleContent'>
                <img style={{width: 20}} src={data.nodeSvg} alt="icon"/><span>{data.nodeTitle}</span></div>}
                  extra={<CloseOutlined/>}>
                {data.nodeContent}
            </Card>
            <Handle
                type="source"
                position="bottom"
                id="aS"
                style={{top: 50, background: '#555'}}
            />
            <Handle
                type="source"
                position="bottom"
                id="aS"
                style={{top: 50, background: '#555'}}
            />
            <Handle
                type="source"
                position="bottom"
                id="aS"
                style={{top: 50, background: '#555'}}
            />
            <Handle
                type="source"
                position="bottom"
                id="aS"
                style={{top: 50, background: '#555'}}
            />
            <Handle
                type="source"
                position="bottom"
                id="aS"
                style={{top: 50, background: '#555'}}
            />
        </>
    );
});
