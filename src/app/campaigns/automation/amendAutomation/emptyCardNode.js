import React, {memo} from 'react';

import {Handle} from 'react-flow-renderer';
import {FullscreenExitOutlined} from "@ant-design/icons";
import './amendAutomation.scss';
import {Card} from "antd";

export default memo(({data}) => {
    return (
        <div key={data.id}>
            <Handle
                type="target"
                position="top"
                style={{background: '#555'}}
                id='emptyCardVoid'
                onConnect={(params) => console.log('handle onConnect', params)}
            />
            <div style={{borderStyle: 'solid', borderWidth: 1}}>
                <Card title={<div className='titleContent'>
                    <FullscreenExitOutlined/><span>Exit</span></div>}>
                    When participants arrive on this step, their journey is over
                </Card>
            </div>
        </div>
    );
});
