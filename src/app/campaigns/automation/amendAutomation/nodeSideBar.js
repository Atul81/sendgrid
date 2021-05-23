import React from 'react';
import './amendAutomation.scss';
import {useDispatch} from "react-redux";
import {updateNodeType} from "../../../../store/actions/root";

export const NodeSideBar = () => {

    const dispatch = useDispatch();

    const onDragStart = (event, nodeType) => {
        event.dataTransfer.effectAllowed = 'move';
        dispatch(updateNodeType(nodeType));
    };

    return (
        <aside className='sidebar'>
            <div className="description">You can drag these nodes to the pane on the right.</div>
            <div className="nodeBox input" onDragStart={(event) => onDragStart(event, 'input')} draggable>
                Input Node
            </div>
            <div className="nodeBox" onDragStart={(event) => onDragStart(event, 'default')} draggable>
                Default Node
            </div>
            <div className="nodeBox custom" onDragStart={(event) => onDragStart(event, 'customNode')} draggable>
                Custom Node
            </div>
            <div className="nodeBox customNodeTwo" onDragStart={(event) => onDragStart(event, 'customNodeTwo')} draggable>
                Custom Node Two
            </div>
            <div className="nodeBox output" onDragStart={(event) => onDragStart(event, 'output')} draggable>
                Output Node
            </div>
        </aside>
    );
};
