import {Button, Card, Input, message, Modal, Radio, Select, Typography} from "antd";
import React, {useCallback, useEffect, useRef, useState} from "react";
import ReactFlow, {
    addEdge,
    Background,
    Controls,
    MiniMap,
    ReactFlowProvider,
    removeElements
} from 'react-flow-renderer';
import './amendAutomation.scss';
import {StepBackwardOutlined} from "@ant-design/icons";
import {addNewObject, editObjectById, getObjectById} from "../../../../service/serverCalls/mockServerRest";
import {updateBreadcrumb} from "../../../../store/actions/root";
import {useDispatch, useSelector} from "react-redux";
import {NodeSideBar} from "./nodeSideBar";
import customNode from "./customNode";
import customNodeTwo from "./customNodeTwo";

export const AmendAutomationPage = (props) => {
    const [reactFlowInstance, setReactFlowInstance] = useState(null);
    const [elements, setElements] = useState([]);
    const dispatch = useDispatch();
    const nodeTypeRedux = useSelector((state) => state.root.nodeType);
    const openType = (props.amendObj && (props.amendObj.viewType === 'edit' || props.amendObj.viewType === 'create'));
    useEffect(() => {
        dispatch(updateBreadcrumb(['Campaigns', 'Automation', 'amend-automation']));
        if (props.amendObj.viewType !== 'create' && props.amendObj.key) {
            getObjectById(props.amendObj.key, 'workFlow').then(async response => {
                let elementsJson = await response.json();
                if (elementsJson) {
                    let tempObj = [];
                    let elementsData = elementsJson.data;
                    elementsData.forEach((itr) => {
                        if (itr.data && itr.data.label && itr.data.label.props) {
                            tempObj.push({
                                ...itr, data: {
                                    label:
                                        <Card size={"small"} title={itr.data.label.props.title} bordered={false}>
                                            Card content
                                        </Card>
                                }
                            });
                            setId(itr.id);
                        } else {
                            tempObj.push(itr);
                        }
                    });
                    setElements(tempObj);
                }
            });
        } else {
            addNewObject({data: elements, id: props.amendObj.id}, 'workFlow').then(async newWorkflowAsync => {
                let newWorkflowRes = await newWorkflowAsync.json();
                if (newWorkflowRes) {
                    message.success(`Workflow data for automation ${props.amendObj.name} has been successfully created`, 0.7);
                }
            })
        }
    }, []);

    const {Text} = Typography;
    const {Option} = Select;
    const deleteConfirm = Modal.confirm;
    const [id, setId] = useState('0');
    const [nodeDrawer, setNodeDrawer] = useState(false);
    const [nodeTitle, setNodeTitle] = useState("");
    const [edgeTitle, setEdgeTitle] = useState("");
    const [elementSelected, setElementSelected] = useState({});
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isEdgeModalVisible, setIsEdgeModalVisible] = useState(false);
    const [nodeType, setNodeType] = useState("default");

    const nodeStrokeColor = (n) => {
        if (n.style?.background) {
            return n.style.background;
        }
        if (n.type === 'input') {
            return '#0041d0';
        }
        if (n.type === 'output') {
            return '#ff0072';
        }
        if (n.type === 'default') {
            return '#1a192b';
        }

        return '#eee';
    };

    const nodeColor = (n) => {
        if (n.style?.background) {
            return n.style.background;
        }

        return '#fff';
    };

    const onElementsRemove = (elementsToRemove) => {
        if (elementsToRemove[0]) {
            deleteConfirm({
                title: 'Are you sure delete following node/relation?',
                content: elementsToRemove[0].data ?
                    elementsToRemove[0].data.label.props ? elementsToRemove[0].data.label.props.title :
                        elementsToRemove[0].data.label : 'Relation',
                okText: 'Yes',
                okType: 'danger',
                cancelText: 'No',
                onOk() {
                    setElements((els) => removeElements(elementsToRemove, els));
                },
                onCancel() {
                    console.log('Node deletion cancelled');
                },
            });
        }
    };
    const onConnect = (params) => setElements((els) => addEdge(params, els));

    const createNewNode = (event) => {
        if (nodeTitle.length <= 0) {
            message.error("Node Title Required", 0.5).then(() => {
            });
        } else {
            event.preventDefault();
            const position = reactFlowInstance.project({
                x: Math.random() * window.innerWidth - 100,
                y: Math.random() * window.innerHeight - 100
            });
            const newNode = {
                id: getId(),
                position,
                type: nodeType,
                data: {
                    label:
                        <Card size={"small"} title={nodeTitle} bordered={false}>
                            Card content
                        </Card>
                }
            };
            setElements((es) => es.concat(newNode));
            setNodeDrawer(false);
            setNodeTitle("");
        }
        setNodeType("default");
    };

    const getId = () => {
        let newNodeId = String(parseInt(id, 10) + 1);
        setId(newNodeId);
        return `${newNodeId}`;
    };


    const onElementClick = (event, element) => {
        if (element.data && element.data.label) {
            setNodeTitle(element.data.label.props ? element.data.label.props.title : element.data.label);
            setIsModalVisible(true);
        } else {
            setNodeTitle("");
            setIsEdgeModalVisible(true);
        }
        setElementSelected(element);
    };

    const handleOk = () => {
        setIsModalVisible(false);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    const radioValueChange = (event) => {
        console.log('radio checked', event.target.value);
    };

    const updateEdgeName = () => {
        let itemElements = [...elements].map(elementItr => {
            if (elementItr.id === elementSelected.id) {
                elementItr = {...elementItr, label: edgeTitle};
            }
            return elementItr;
        })
        setElements(itemElements);
        setIsEdgeModalVisible(false);
    };

    const onTypeChange = (value) => {
        setNodeType(value);
    };

    const saveJson = () => {
        editObjectById({
            data: elements,
            id: props.amendObj.key ? props.amendObj.key : props.amendObj.id
        }, 'workFlow').then(async editElementsRes => {
            let elementsJson = await editElementsRes.json();
            if (elementsJson && elementsJson.id) {
                message.success(`Workflow data for automation ${props.amendObj.name} has been successfully updated`, 0.7);
            }
        });
    };

    const radioStyle = {
        display: 'block',
        height: '30px',
        lineHeight: '30px',
    };

    const onNodeDragStop = (event, node) => {
        let oldElements = [...elements];
        for (let i = 0; i < elements.length; i++) {
            if (elements[i].id === node.id) {
                oldElements[i] = node;
                break;
            }
        }
        setElements(oldElements);
    };
    const reactFlowWrapper = useRef(null);

    const onLoad = useCallback(
        (rfi) => {
            if (!reactFlowInstance) {
                setReactFlowInstance(rfi);
            }
        }, [reactFlowInstance]
    );

    const [dragEvent, setDragEvent] = useState(null);

    const onDrop = (event) => {
        event.preventDefault();
        setNewDraggedNode(true);
        setDragEvent(event);
    };

    const [newDraggedNode, setNewDraggedNode] = useState(false);

    const onDragOver = (event) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
    };

    const eventAfterDrag = () => {
        if (nodeTitle !== '') {
            const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
            const position = reactFlowInstance.project({
                x: dragEvent.clientX - reactFlowBounds.left,
                y: dragEvent.clientY - reactFlowBounds.top,
            });
            const newNode = {
                id: getId(),
                position,
                type: nodeTypeRedux,
                data: {
                    label:
                        <Card size={"small"} title={nodeTitle} bordered={false}>
                            Card content
                        </Card>,
                    title: nodeTitle
                }
            };
            setNewDraggedNode(false);
            setElements((es) => es.concat(newNode));
            setDragEvent(null);
        } else {
            message.error("Node Title required").then(() => {
            });
        }
    };

    useEffect(() => {
        if (reactFlowInstance && elements.length > 0) {
            reactFlowInstance.fitView();
        }
    }, [reactFlowInstance, elements.length]);

    const nodeTypes = {
        customNode: customNode,
        customNodeTwo: customNodeTwo
    };
    return (
        <div className='amendAutomation pageLayout'>
            {openType ? (
                    <div style={{paddingBottom: 16}} className='firstNav'>
                        {!nodeDrawer ?
                            <div className='leftPlacement' style={{width: '39%'}}>
                                <div>
                                    <Button type={"primary"} onClick={() => setNodeDrawer(true)}>Add Node</Button>
                                </div>
                                <div>
                                    <Button className='leftMargin' icon={<StepBackwardOutlined/>}
                                            onClick={props.routeToOverview}>Cancel</Button>
                                    <Button className='greenLeftMargin' type={"primary"}
                                            onClick={saveJson}>Save</Button>
                                </div>
                            </div> :
                            <div className='flexWrap'>
                                <div className='flexSpaceBw'>
                                    <Input placeholder="New Node Name"
                                           onChange={(inpEvent) => setNodeTitle(inpEvent.target.value)}/>
                                    <Select defaultValue="default" style={{width: 120, paddingLeft: 16}}
                                            onChange={onTypeChange}>
                                        <Option value="input">Input</Option>
                                        <Option value="default">Default</Option>
                                        <Option value="output">Output</Option>
                                    </Select>
                                </div>
                                <div className='leftMargin'>
                                    <Button type={"primary"} onClick={(event) => createNewNode(event)}>Add</Button>
                                    <Button className='leftMargin' type={"default"}
                                            onClick={() => setNodeDrawer(false)}>Return</Button>
                                </div>
                            </div>
                        }
                        <div className='rightPlacement'>
                            <Text type="warning">Click once on a node to edit it. Double click a node and press "Delete" key
                                on your keyboard to delete it.</Text>
                        </div>
                    </div>)
                : <div className={'reverseFlex'}>
                    <Button className='leftMargin' icon={<StepBackwardOutlined/>}
                            onClick={props.routeToOverview}>Cancel</Button>
                </div>
            }
            <Modal title="Label Edge" centered visible={isEdgeModalVisible} onOk={updateEdgeName} destroyOnClose={true}
                   onCancel={() => setIsEdgeModalVisible(false)} width={300}>
                <Input placeholder="New Edge Title"
                       onChange={(inpEvent) => setEdgeTitle(inpEvent.target.value)}/>
            </Modal>
            <Modal title={nodeTitle} visible={isModalVisible} onCancel={handleCancel} destroyOnClose={true} footer={
                <>
                    <Button key="back" onClick={handleCancel}>
                        Cancel
                    </Button>
                    <Button key="submit" type="primary" onClick={handleOk}>
                        Save
                    </Button>
                </>}>
                <div className='flexCol'>
                    <div>Choose how to start the journey<br/>
                        <Radio.Group onChange={() => radioValueChange}>
                            <Radio style={radioStyle} value={1}>Add participants when they perform an activity</Radio>
                            <Radio style={radioStyle} value={2}>Add participants from a segment</Radio>
                            <br/>
                        </Radio.Group>
                    </div>
                    <p>Some contents...</p>
                    <p>Some contents...</p>
                </div>
            </Modal>
            <Modal title="Enter Node Title" centered visible={newDraggedNode}
                   onOk={eventAfterDrag} destroyOnClose={true}
                   onCancel={() => setNewDraggedNode(false)} width={300}>
                <Input placeholder="New Automation Name"
                       onChange={(inpEvent) => setNodeTitle(inpEvent.target.value)}/>
            </Modal>
            <div className={openType ? 'gridDisplay editMode' : 'gridDisplay'}>
                <ReactFlowProvider>
                    {openType ? <NodeSideBar/> : null}
                    <div className="reactflow-wrapper" ref={reactFlowWrapper}>
                        <ReactFlow onElementClick={openType ? onElementClick : undefined} elements={elements}
                                   nodeTypes={nodeTypes} nodesDraggable={openType} nodesConnectable={openType}
                                   ref={reactFlowInstance} paneMoveable={openType}
                                   onNodeDragStop={openType ? onNodeDragStop : undefined}
                                   onDrop={openType ? onDrop : undefined} onDragOver={openType ? onDragOver : undefined}
                                   onElementsRemove={openType ? onElementsRemove : undefined}
                                   onConnect={openType ? onConnect : undefined} onLoad={onLoad}
                                   deleteKeyCode={46}>
                            <MiniMap nodeStrokeColor={nodeStrokeColor} nodeColor={nodeColor} nodeBorderRadius={2}/>
                            <Controls/>
                            <Background color="#aaa" gap={16}/>
                        </ReactFlow>
                    </div>
                </ReactFlowProvider>
            </div>
        </div>
    );
}
