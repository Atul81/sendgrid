import React, {memo} from 'react';

import {Handle} from 'react-flow-renderer';
import {PlusCircleFilled} from "@ant-design/icons";
import './amendAutomation.scss';

export default memo(({data}) => {
    return (
        <>
            <Handle type="target" position="top" style={{top: 30, background: '#555'}}
                    id='actToJourney' onConnect={(params) => console.log('handle onConnect', params)}
            />
            <div className='plusWrapper'>
                <PlusCircleFilled/>
            </div>
            <Handle type="source" position="bottom" id="journeyToAct" style={{top: 50, background: '#555'}}
                    onConnect={(params) => console.log('handle onConnect', params)}
            />
        </>
    );
});
