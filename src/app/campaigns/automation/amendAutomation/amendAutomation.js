import {Button, Card, Divider, Input, message, Modal, Typography} from "antd";
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
import {CheckOutlined, CloseOutlined, StepBackwardOutlined} from "@ant-design/icons";
import {addNewObject, editObjectById, getObjectById} from "../../../../service/serverCalls/mockServerRest";
import {updateBreadcrumb} from "../../../../store/actions/root";
import {useDispatch} from "react-redux";
import multiBranchNode from "./multiBranchNode";
import plusNode from "./plusNode";
import Paragraph from "antd/es/typography/Paragraph";
import {GET_SERVER_ERROR, POST_SERVER_ERROR, PUT_SERVER_ERROR} from "../../../../utils/common";
import {JourneyEntryModal} from "./activity/journeyEntry";
import {ActivityModal} from "./activityModal";

export const AmendAutomationPage = (props) => {
    const [reactFlowInstance, setReactFlowInstance] = useState(null);
    const [cardType, setCardType] = useState('');
    const [elements, setElements] = useState([]);
    const dispatch = useDispatch();
    const openType = (props.amendObj && (props.amendObj.viewType === 'edit' || props.amendObj.viewType === 'create'));
    let elementsTemp = [];
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
                            let idAndType = itr.id.split('-');
                            switch (idAndType[1]) {
                                case 'journeyEntry': {
                                    tempObj.push({
                                        ...itr, data: {
                                            label:
                                                <Card title={<div className='titleContent'>
                                                    <img style={{width: 20}}
                                                         src={`/assets/icons/icon-timer.svg`}
                                                         alt="icon"/><span>Journey Entry</span>
                                                </div>}>
                                                    <Typography className={'columnFlex'}>
                                                        <strong style={{fontSize: 10}}>Evaluate every: 3 hours</strong>
                                                        <Divider/>
                                                        <Paragraph>Segment: all</Paragraph>
                                                    </Typography>
                                                </Card>
                                        }
                                    });
                                    break;
                                }
                                case 'sendEmail': {
                                    tempObj.push({
                                        ...itr, data: {
                                            label: <Card title={<div className='titleContent'>
                                                <img style={{width: 20}}
                                                     src={`/assets/icons/icon-send-email.svg`}
                                                     alt="icon"/><span>Send an Email</span>
                                            </div>} extra={<CloseOutlined
                                                onClick={(e) => deleteNodeClick(e, itr.id)}/>}>
                                                <div style={{
                                                    display: "flex",
                                                    justifyContent: 'center',
                                                    flexDirection: 'column'
                                                }}>
                                                    <Button>Configure Message</Button>
                                                    <Paragraph>Sender
                                                        Address: {itr.data.label.props.children.props.children[1].props.children[1]}</Paragraph>
                                                </div>
                                            </Card>
                                        }
                                    });
                                    break;
                                }
                                case 'wait': {
                                    let displayData = itr.data.label.props.children.props.children.props;
                                    tempObj.push({
                                        ...itr, data: {
                                            label: <Card title={<div className='titleContent'>
                                                <img style={{width: 20}}
                                                     src={`/assets/icons/icon-wait.svg`}
                                                     alt="icon"/><span>Wait</span>
                                            </div>} extra={<CloseOutlined
                                                onClick={(e) => deleteNodeClick(e, itr.id)}/>}>
                                                <div style={{
                                                    display: "flex",
                                                    justifyContent: 'center',
                                                    flexDirection: 'column'
                                                }}>
                                                    <Paragraph>{displayData.children}</Paragraph>
                                                </div>
                                            </Card>
                                        }
                                    });
                                    break;
                                }
                                case 'addActivity': {
                                    tempObj.push(itr);
                                    break;
                                }
                                default: {
                                    message.error(`Integration for card module ${idAndType[1]} not done`, 0.4);
                                }
                            }
                            setId(idAndType[0]);
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
    const deleteConfirm = Modal.confirm;
    const [id, setId] = useState('0');
    const [nodeTitle, setNodeTitle] = useState("");
    const [edgeTitle, setEdgeTitle] = useState("");
    const [elementSelected, setElementSelected] = useState({id: ''});
    const [isJourneyModal, setJourneyModal] = useState(false);
    const [isActivityModal, setActivityModal] = useState(false);
    const [isEdgeModalVisible, setIsEdgeModalVisible] = useState(false);
    const [modalData, setModalData] = useState({
        workFlowId: props.amendObj.key,
        cardId: '',
        currentElement: {},
        nodeTitle: ''
    });
    const orphanChildIds = useRef([]);
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
                    orphanChildIds.current.forEach(itr => {
                        let orphanEls = new Array({id: itr});
                        setElements((els) => removeElements(orphanEls, els));
                    });
                    orphanChildIds.current = [];
                },
                onCancel() {
                    console.log('Node deletion cancelled');
                },
            });
        }
    };

    const onConnect = (params) => setElements((els) => addEdge(params, els));

    const getId = () => {
        let newNodeId = String(parseInt(id, 10) + 1);
        setId(id + 1);
        return `${newNodeId}`;
    };


    const onElementClick = (event, element) => {
        setElementSelected(element);
        if (element.type === 'plusNode' || (element.data && (element.data.label || element.data.branchCount))) {
            let elementType = element.id.split("-")[1];
            switch (elementType) {
                case 'journeyEntry':
                    setJourneyModal(true);
                    break;
                case 'addActivity':
                    setActivityModal(true);
                    break;
                case "sendEmail":
                    setNodeTitle('Send an Email');
                    setCardType(elementType);
                    setActivityModal(true);
                    break;
                case "wait":
                    setNodeTitle('Wait');
                    setCardType(elementType);
                    setActivityModal(true);
                    break;
                case "yesNoSplit":
                    setNodeTitle('Yes/No Split');
                    setCardType(elementType);
                    setActivityModal(true);
                    break;
                case "multiVariateSplit":
                    setNodeTitle('Multivariate Split');
                    setCardType(elementType);
                    setActivityModal(true);
                    break;
                case "randomSplit":
                    setNodeTitle('Random Split');
                    setCardType(elementType);
                    setActivityModal(true);
                    break;
                case "holdout":
                    setNodeTitle('Holdout');
                    setCardType(elementType);
                    setActivityModal(true);
                    break;
                default:
                    message.error('Not implemented Yet', 0.5).then(_ => {
                    });
            }
        } else {
            setIsEdgeModalVisible(true);
        }
    };

    useEffect(() => {
        let id = elementSelected.id.split("-")[1];
        setModalData({
            ...modalData,
            cardId: (id !== 'addActivity' && id !== 'journeyEntry') ? elementSelected.id : undefined,
            currentElement: elementSelected,
            nodeTitle: nodeTitle
        });
    }, [elementSelected, nodeTitle, cardType])

    const handleCancel = () => {
        setJourneyModal(false);
        setActivityModal(false);
        setCardType('');
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

    useEffect(() => {
        if (reactFlowInstance && elements.length > 0) {
            reactFlowInstance.fitView();
        }
        if (elementsTemp.length > 0) {
            setElements(elementsTemp);
        }
    }, [reactFlowInstance, elements.length, elementsTemp, orphanChildIds]);

    const nodeTypes = {
        multiBranchNode: multiBranchNode,
        plusNode: plusNode
    };

    const deleteNodeClick = (event, nodeId) => {
        handleCancel();
        onElementsRemove(new Array({id: nodeId}));
        orphanChildIds.current = elements.filter(value => {
            return value.source && value.source === nodeId;
        }).map(val => val.target);
        event.stopPropagation();
    };

    const createNodeFromActivity = (nodeContent, nodeType, nodeTitle, nodeSvg, branchCount, existingNodeId) => {
        const position = existingNodeId ? modalData.currentElement.position : {
            x: Math.floor(modalData.currentElement.position.x + Math.random() * 70),
            y: Math.floor(modalData.currentElement.position.y + Math.random() * 110)
        };
        let newNodeId = existingNodeId ? existingNodeId : getId().concat(`-${nodeType}`);
        const newNode = {
            id: newNodeId,
            position,
            type: nodeType === 'multiVariateSplit' ? 'multiBranchNode' : 'default',
            data: nodeType === 'multiVariateSplit' ? {
                nodeContent: nodeContent,
                nodeTitle: nodeTitle,
                nodeSvg: nodeSvg,
                branchCount: branchCount,
                id: newNodeId
            } : {
                label:
                    <Card title={<div className='titleContent'>
                        <img style={{width: 20}} src={nodeSvg} alt="icon"/><span>{nodeTitle}</span></div>}
                          extra={<CloseOutlined onClick={(e) => deleteNodeClick(e, newNodeId)}/>}>
                        {nodeContent}
                    </Card>
            }
        };
        setElements((es) => es.concat(newNode));
        elementsTemp = [...elements];
        elements.push(newNode);
        if (!existingNodeId) {
            createTargetEdgeNode(newNodeId, elementSelected.id, null);
            createSourceEdgeNode(newNodeId, nodeType, branchCount, position);
        }
        setNodeTitle("");
    };
    const createSourceEdgeNode = (sourceId, nodeType, branchCount, position) => {
        if (nodeType === 'multiVariateSplit' || nodeType === 'randomSplit' || nodeType === 'yesNoSplit') {
            let counter = 0;
            while (counter < branchCount) {
                createAddActivityNode(sourceId, `srcToAct${counter}`, position, counter);
                counter++;
            }
        } else {
            createAddActivityNode(sourceId, null, position, 0);
        }
    };

    const createAddActivityNode = (sourceId, sourceHandler, oldPosition, counter) => {
        const position = {
            x: Math.floor(oldPosition.x + Math.random() * 70),
            y: Math.floor(oldPosition.y + Math.random() * 110)
        };
        let newNodeId = String(parseInt(getId(), 10) + counter).concat(`-addActivity`);
        const activityNode = {
            id: newNodeId,
            position,
            type: 'plusNode'
        };
        setElements((es) => es.concat(activityNode));
        elementsTemp = [...elements];
        elements.push(activityNode);
        createTargetEdgeNode(newNodeId, sourceId, sourceHandler)
    }

    const createTargetEdgeNode = (targetId, sourceId, sourceHandler) => {
        let edgeNode = {
            "source": sourceId,
            "sourceHandle": sourceHandler,
            "target": targetId,
            "targetHandle": `plusToNode`,
            "id": `reactflow__edge-src${sourceId}-tr${targetId}`
        }
        setElements((es) => es.concat(edgeNode));
        elementsTemp = [...elements];
        elements.push(edgeNode);
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
            {isJourneyModal ? <JourneyEntryModal openModal={isJourneyModal} closeModal={handleCancel}/> : null}
            {isActivityModal ?
                <ActivityModal selectedCardType={cardType}
                               createNode={createNodeFromActivity} openModal={true} modalData={modalData}
                               closeModal={handleCancel}/> : null}
            <div className='gridDisplay'>
                <ReactFlowProvider>
                    <div className="reactflow-wrapper" ref={reactFlowWrapper}>
                        <ReactFlow onElementClick={openType ? onElementClick : undefined} elements={elements}
                                   nodeTypes={nodeTypes} nodesDraggable={openType} nodesConnectable={openType}
                                   ref={reactFlowInstance} paneMoveable={openType}
                                   onElementsRemove={openType ? onElementsRemove : undefined}
                                   onNodeDragStop={openType ? onNodeDragStop : undefined}
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
