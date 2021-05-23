import React, {memo} from 'react';

import {Handle} from 'react-flow-renderer';
import {Card} from "antd";

export default memo(({data}) => {
    return (
        <>
            <Handle
                type="target"
                position="left"
                style={{top: 30, background: '#555'}}
                id='aT'
                onConnect={(params) => console.log('handle onConnect', params)}
            />
            <Handle
                type="target"
                position="left"
                id='bT'
                style={{bottom: 10, top: 'auto', background: '#555'}}
                onConnect={(params) => console.log('handle onConnect', params)}
            />
            <div style={{border: '1px solid yellowgreen'}}>
                <Card size="small" title={data.title} extra={<a href="#">More</a>} style={{width: 300}}>
                    <p>Card content</p>
                    <p>Card content</p>
                    <p>Card content</p>
                </Card>
            </div>
            <Handle
                type="source"
                position="right"
                id="aS"
                style={{top: 50, background: '#555'}}
            />
            <Handle
                type="source"
                position="right"
                id="bS"
                style={{
                    position: 'absolute',
                    top: '50%', msTransform: 'translateY(-50%)',
                    transform: 'translateY(-50%)', background: '#555'
                }}
            />
            <Handle
                type="source"
                position="right"
                id="cS"
                style={{bottom: 50, top: 'auto', background: '#555'}}
            />
        </>
    );
});
