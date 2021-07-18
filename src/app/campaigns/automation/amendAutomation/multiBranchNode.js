import React, {memo} from 'react';

import {Handle} from 'react-flow-renderer';
import {CloseOutlined} from "@ant-design/icons";
import './amendAutomation.scss';
import {Card, message} from "antd";

export default memo(({data}) => {

    const getLeftLocation = () => {
        switch (data.branchCount) {
            case 1:
                return 100;
            case 2:
                return 50;
            case 3:
                return 33;
            case 4:
                return 25;
            case 5:
                return 20;
            default:
                message.error('Branch strategy not found', 0.7).then(_ => {
                });
                throw new Error('No Implementation found');
        }
    }

    const deleteNodeClick = (e, id, title) => {
        // use redux
    }
    return (
        <div key={data.id}>
            <Handle
                type="target"
                position="top"
                style={{background: '#555'}}
                id='actToTar'
                onConnect={(params) => console.log('handle onConnect', params)}
            />
            <div style={{borderStyle: 'solid', borderWidth: 1}}>
                <Card title={<div className='titleContent'>
                    <img style={{width: 20}} src={data.nodeSvg} alt="icon"/><span>{data.nodeTitle}</span></div>}
                      extra={<CloseOutlined onClick={(e) => deleteNodeClick(e, data.id, data.nodeTitle)}/>}>
                    {data.nodeContent}
                </Card>
            </div>
            <div style={{width: 338}}>
                {data.branchCount > 0 ? <Handle
                    type="source"
                    position="bottom"
                    id={`srcToAct0`}
                    style={{left: getLeftLocation(), background: '#555'}}
                /> : null}
                {data.branchCount > 1 ? <Handle
                    type="source"
                    position="bottom"
                    id={`srcToAct1`}
                    style={{left: getLeftLocation() * 3, background: '#555'}}
                /> : null}
                {data.branchCount > 2 ? <Handle
                    type="source"
                    position="bottom"
                    id={`srcToAct2`}
                    style={{left: getLeftLocation() * 5, background: '#555'}}
                /> : null}
                {data.branchCount > 3 ? <Handle
                    type="source"
                    position="bottom"
                    id={`srcToAct3`}
                    style={{left: getLeftLocation() * 7, background: '#555'}}
                /> : null}
                {data.branchCount > 4 ? <Handle
                    type="source"
                    position="bottom"
                    id={`srcToAct4`}
                    style={{left: getLeftLocation() * 9, background: '#555'}}
                /> : null}
            </div>
        </div>
    );
});
