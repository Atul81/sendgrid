import {Avatar, Button, Card, Divider, Input, message, Modal, Select, Typography} from "antd";
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
import {CheckOutlined, CloseCircleOutlined, CloseOutlined, StepBackwardOutlined} from "@ant-design/icons";
import {addNewObject, editObjectById, getObjectById} from "../../../../service/serverCalls/mockServerRest";
import {updateBreadcrumb} from "../../../../store/actions/root";
import {useDispatch, useSelector} from "react-redux";
import customNode from "./customNode";
import customNodeTwo from "./customNodeTwo";
import plusNode from "./plusNode";
import Paragraph from "antd/es/typography/Paragraph";
import {GET_SERVER_ERROR, POST_SERVER_ERROR, PUT_SERVER_ERROR} from "../../../../utils/common";
import {JourneyEntryModal} from "./journeyEntry";
import {ActivityModal} from "./activityModal";

export const AmendAutomationPage = (props) => {
    const [reactFlowInstance, setReactFlowInstance] = useState(null);
    const [elements, setElements] = useState([]);
    const dispatch = useDispatch();
    const nodeTypeRedux = useSelector((state) => state.root.nodeType);
    const openType = (props.amendObj && (props.amendObj.viewType === 'edit' || props.amendObj.viewType === 'create'));

    useEffect(() => {
        dispatch(updateBreadcrumb(['Campaigns', 'Automation', `Modify Automation: ${props.amendObj.name}`]));
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
                                        <Card title={<div className='titleContent'><img style={{width: 20}} src={`https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png`} alt="icon"/><span>Journey Entry</span></div>}>
                                            <Typography className={'columnFlex'}>
                                                <strong style={{fontSize: 10}}>Evaluate every: 3 hours</strong>
                                                <Divider/>
                                                <Paragraph>Segment: all</Paragraph>
                                            </Typography>
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
            }).catch(reason => {
                console.log(reason);
                message.error(GET_SERVER_ERROR, 0.8).then(() => {
                });
            });
        } else {
            addNewObject({data: elements, id: props.amendObj.id}, 'workFlow').then(async newWorkflowAsync => {
                let newWorkflowRes = await newWorkflowAsync.json();
                if (newWorkflowRes) {
                    message.success(`Workflow data for automation ${props.amendObj.name} has been successfully created`, 0.7);
                }
            }).catch(reason => {
                console.log(reason);
                message.error(POST_SERVER_ERROR, 0.8).then(() => {
                });
            });
        }
    }, []);

    const {Text} = Typography;
    const {Option} = Select;
    const deleteConfirm = Modal.confirm;
    const [id, setId] = useState('0');
    const [nodeDrawer, setNodeDrawer] = useState(false);
    const [nodeTitle, setNodeTitle] = useState("");
    const [editNodeTitle, setEditNodeTitle] = useState("");
    const [edgeTitle, setEdgeTitle] = useState("");
    const [elementSelected, setElementSelected] = useState({});
    const [isJourneyModal, setJourneyModal] = useState(false);
    const [isActivityModal, setActivityModal] = useState(false);
    const [isEdgeModalVisible, setIsEdgeModalVisible] = useState(false);

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

    const returnCoordinates = () => {
        return Math.floor(Math.random() * (400 - 40) + 40)
    }

    const {Meta} = Card;

    const getId = () => {
        let newNodeId = String(parseInt(id, 10) + 1);
        setId(newNodeId);
        return `${newNodeId}`;
    };


    const onElementClick = (event, element) => {
        if (element.data && element.data.label) {
            let elementType = element.id.split("-")[1];
            switch (elementType) {
                case 'journeyEntry':
                    setJourneyModal(true);
                    break;
                case 'addActivity':
                    setActivityModal(true);
                    break;
            }
            setNodeTitle(element.data.label.props ? element.data.label.props.title : element.data.label);
        } else {
            setNodeTitle("");
            setIsEdgeModalVisible(true);
        }
        setElementSelected(element);
    };

    const handleOk = () => {
        let itemElements = [...elements].map(elementItr => {
            if (elementItr.id === elementSelected.id) {
                elementItr.data = {
                    label: <Card size={"small"} title={editNodeTitle} bordered={false}>
                        Card content
                    </Card>
                };
            }
            return elementItr;
        })
        setElements(itemElements);
        saveJson();
        setJourneyModal(false);
        setActivityModal(false);
    };

    const handleCancel = () => {
        setJourneyModal(false);
        setActivityModal(false);
    };

    const updateEdgeName = () => {
        let itemElements = [...elements].map(elementItr => {
            if (elementItr.id === elementSelected.id) {
                elementItr = {...elementItr, label: edgeTitle, animated: true};
            }
            return elementItr;
        })
        setElements(itemElements);
        setIsEdgeModalVisible(false);
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
        }).catch(reason => {
            console.log(reason);
            message.error(PUT_SERVER_ERROR, 0.8).then(() => {
            });
        });
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
                        <Card size={"small"} bordered={false}>
                            <Meta avatar={<Avatar
                                src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"/>}
                                  title={nodeTitle}
                                  description={<Typography className={'columnFlex'}>
                                      <strong style={{fontSize: 10}}>Evaluate every: 3 hours</strong>
                                      <Divider/>
                                      <Paragraph>Segment: all</Paragraph>
                                  </Typography>}/>
                        </Card>
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
        customNodeTwo: customNodeTwo,
        plusNode: plusNode
    };

    const createNodeFromActivity = (nodeContent, nodeType, nodeTitle) => {
        console.log(nodeContent, '====>', nodeType);
        const position = reactFlowInstance.project({
            x: returnCoordinates(),
            y: returnCoordinates()
        });
        const newNode = {
            id: getId(),
            position,
            type: 'default',
            data: {
                label:
                    <Card title={<div className='titleContent'><img style={{width: 20}} src={`/assets/images/logoCollapsed.svg`} alt="icon"/><span>{nodeTitle}</span></div>}  extra={<CloseOutlined/>}>
                        {nodeContent}
                    </Card>
            }
        };
        setElements((es) => es.concat(newNode));
        setNodeDrawer(false);
        setNodeTitle("");
    };

    return (
        <div className='amendAutomation pageLayout'>
            <div className={'firstNav'}>
                <Text type="warning">Click once on a node to edit it. Double click a node and press "Delete" key
                    on your keyboard to delete it.</Text>
                <div className={'reverseFlex'}>
                    <Button className='leftMargin' icon={<StepBackwardOutlined/>}
                            onClick={props.routeToOverview}>Cancel</Button>
                    {openType ? <Button className='leftMargin' type={'primary'} icon={<CheckOutlined/>}
                                        onClick={saveJson}>Save Json</Button> : null}
                </div>
            </div>
            <Modal title="Label Edge" centered visible={isEdgeModalVisible} onOk={updateEdgeName} destroyOnClose={true}
                   onCancel={() => setIsEdgeModalVisible(false)} width={300}>
                <Input placeholder="New Edge Title"
                       onChange={(inpEvent) => setEdgeTitle(inpEvent.target.value)}/>
            </Modal>
            <Modal title="Enter Node Title" centered visible={newDraggedNode}
                   onOk={eventAfterDrag} destroyOnClose={true}
                   onCancel={() => setNewDraggedNode(false)} width={300}>
                <Input placeholder="New Automation Name"
                       onChange={(inpEvent) => setNodeTitle(inpEvent.target.value)}/>
            </Modal>
            {isJourneyModal ? <JourneyEntryModal openModal={isJourneyModal} closeModal={handleCancel}/> : null}
            {isActivityModal ?
                <ActivityModal activitySelection={true} createNode={createNodeFromActivity} openModal={isActivityModal}
                               closeModal={handleCancel}/> : null}
            <div className='gridDisplay'>
                <ReactFlowProvider>
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
