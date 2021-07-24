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
import {updateBreadcrumb, updateIdForDelete, updateWorkFlowCardData} from "../../../../store/actions/root";
import {useDispatch, useSelector} from "react-redux";
import multiBranchNode from "./multiBranchNode";
import plusNode from "./plusNode";
import Paragraph from "antd/es/typography/Paragraph";
import {GET_SERVER_ERROR, getBranchStyle, POST_SERVER_ERROR, PUT_SERVER_ERROR} from "../../../../utils/common";
import {JourneyEntryModal} from "./activity/journeyEntry";
import {ActivityModal} from "./activityModal";
import emptyCardNode from "./emptyCardNode";
import Title from "antd/es/typography/Title";

export const AmendAutomationPage = (props) => {
    const [reactFlowInstance, setReactFlowInstance] = useState(null);
    const [cardType, setCardType] = useState('');
    const [elements, setElements] = useState([]);
    const dispatch = useDispatch();
    const openType = (props.amendObj && (props.amendObj.viewType === 'edit' || props.amendObj.viewType === 'create'));
    const tempElements = useRef([]);
    const nodeForDelete = useSelector((state) => state.root.nodeForDelete);
    const workFlowCardDataRedux = useSelector((state) => state.root.workFlowData);
    const journeyData = useRef(null);
    useEffect(() => {
        dispatch(updateBreadcrumb(['Campaigns', 'Automation', `Modify Automation: ${props.amendObj.name}`]));
        if (props.amendObj.viewType !== 'create' && props.amendObj.key) {
            getObjectById(props.amendObj.key, 'cardData').then(async workflowCardDataAsync => {
                let workflowCardDataRes = await workflowCardDataAsync.json();
                dispatch(updateWorkFlowCardData(workflowCardDataRes));
                getObjectById(props.amendObj.key, 'workFlow').then(async workFlowAsync => {
                    let elementsJson = await workFlowAsync.json();
                    if (elementsJson) {
                        let tempObj = [];
                        let elementsData = elementsJson.data;
                        elementsData.forEach((itr) => {
                            if (itr.source) {
                                tempObj.push({...itr});
                            } else if (itr.id) {
                                let idAndType = itr.id.split('-');
                                switch (idAndType[1]) {
                                    case 'journeyEntry': {
                                        journeyData.current = itr;
                                        tempObj.push({
                                            ...itr, data: {
                                                label:
                                                    <Card title={<div className='titleContent'>
                                                        <img style={{width: 20}}
                                                             src={`/assets/icons/icon-timer.svg`}
                                                             alt="icon"/><span>Journey Entry</span>
                                                    </div>}>
                                                        <Typography className={'columnFlex'}>
                                                            <strong style={{fontSize: 10}}>Evaluate every: 3
                                                                hours</strong>
                                                            <Divider/>
                                                            <Paragraph>Segment: {workFlowCardDataRedux[itr.id] ? workFlowCardDataRedux[itr.id].segments : workflowCardDataRes[itr.id].segments}</Paragraph>
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
                                                    onClick={(e) => deleteNodeClick(e, itr.id, 'Send an Email', false)}/>}>
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
                                                    onClick={(e) => deleteNodeClick(e, itr.id, 'Wait', false)}/>}>
                                                    <div style={{
                                                        display: "flex",
                                                        justifyContent: 'center',
                                                        flexDirection: 'column'
                                                    }}>
                                                        <Paragraph>Wait
                                                            for: {displayData.children[1]} {displayData.children[3]}</Paragraph>
                                                    </div>
                                                </Card>
                                            }
                                        });
                                        break;
                                    }
                                    case 'holdOut': {
                                        tempObj.push({
                                            ...itr, type: 'multiBranchNode', data: {
                                                "nodeTitle": itr.data.nodeTitle,
                                                "nodeSvg": itr.data.nodeSvg,
                                                "branchCount": itr.data.branchCount,
                                                "id": itr.id,
                                                "nodeContent": <div style={{
                                                    display: "flex",
                                                    justifyContent: 'center',
                                                    flexDirection: 'column'
                                                }}>
                                                    <Title
                                                        level={5}>Holdout: {itr.data.nodeContent.props.children.props.children[1]}%</Title>
                                                </div>
                                            }
                                        });
                                        break;
                                    }
                                    case 'yesNoSplit': {
                                        tempObj.push({
                                            ...itr, type: 'multiBranchNode', data: {
                                                "nodeTitle": itr.data.nodeTitle,
                                                "nodeSvg": itr.data.nodeSvg,
                                                "branchCount": itr.data.branchCount,
                                                "id": itr.id,
                                                "nodeContent": <div style={{
                                                    display: "flex",
                                                    justifyContent: 'center',
                                                    flexDirection: 'column'
                                                }}>
                                                    <Title
                                                        level={5}>{itr.data.nodeContent.props.children[2].props.children}</Title>
                                                    <Divider/>
                                                    <Paragraph>Event: {itr.data.nodeContent.props.children[2].props.children[1]}</Paragraph>
                                                </div>
                                            }
                                        });
                                        break;
                                    }
                                    case 'randomSplit':
                                    case 'multiVariateSplit': {
                                        tempObj.push({
                                            ...itr, type: 'multiBranchNode', data: {
                                                "nodeTitle": itr.data.nodeTitle,
                                                "nodeSvg": itr.data.nodeSvg,
                                                "branchCount": itr.data.branchCount,
                                                "id": itr.id,
                                                "nodeContent": <div style={{
                                                    display: "flex",
                                                    justifyContent: 'center',
                                                    flexDirection: 'column'
                                                }}>
                                                    {itr.data.nodeContent.props.children.map((chItr, index) => {
                                                        return <Paragraph> <span className='dot'
                                                                                 style={{backgroundColor: getBranchStyle(index % 4)}}/>Branch {String.fromCharCode(65 + index)}
                                                        </Paragraph>
                                                    })}
                                                </div>
                                            }
                                        });
                                        break;
                                    }
                                    default: {
                                        tempObj.push({...itr});
                                        break;
                                    }
                                }
                                setId(idAndType[0]);
                            }
                        });
                        setElements(tempObj);
                    }
                }).catch(reason => {
                    console.log(reason);
                    message.error(GET_SERVER_ERROR, 0.8).then(() => {
                    });
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
                title: 'Are you sure delete following node?',
                content: elementsToRemove[0].nodeTitle,
                okText: 'Yes',
                okType: 'danger',
                cancelText: 'No',
                onOk() {
                    let sourceObj = tempElements.current.filter(itr => itr.target === elementsToRemove[0].id);
                    let tempElementsObj = removeElements(tempElements.current.filter(itr => itr.id === elementsToRemove[0].id), tempElements.current);
                    orphanChildIds.current.forEach(itr => {
                        tempElementsObj = removeElements(tempElementsObj.filter(itrOne => itr === itrOne.id), tempElementsObj);
                    });
                    orphanChildIds.current = [];
                    tempElements.current = tempElementsObj;
                    setElements(tempElementsObj);
                    triggerDownStream(elementsToRemove[0], sourceObj);
                },
                onCancel() {
                    console.log('Node deletion cancelled');
                },
            });
        } else {
            message.warning("No element selected for deletion", 0.6).then(_ => {
            });
        }
    };

    const triggerDownStream = (elementRemoved, sourceObj) => {
        if (sourceObj.length > 0) {
            sourceObj = sourceObj[0];
            let allEdgeElements = tempElements.current.filter(itr => itr.source === sourceObj.source);
            let label;
            if (allEdgeElements.length > 0) {
                label = allEdgeElements.filter(itr => itr.sourceHandle === sourceObj.sourceHandle)[0].label;
            } else {
                label = allEdgeElements.length > 0 ? allEdgeElements[0].sourceHandle : null;
            }
            createAddActivityNode(sourceObj.source, sourceObj.sourceHandle, elementRemoved.position, 0, label, 'plusNode', tempElements.current)
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
        if (element.type === 'emptyCardNode' || element.type === 'plusNode' || (element.data && (element.data.label || element.data.branchCount))) {
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
                case "holdOut":
                    setNodeTitle('Holdout');
                    setCardType(elementType);
                    setActivityModal(true);
                    break;
                case "emptyCardNode":
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
            data: tempElements.current,
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
        if (elements.length > 0 && tempElements.current.length === 0) {
            tempElements.current = elements;
        }
    }, [reactFlowInstance, elements.length, elements, orphanChildIds]);

    useEffect(() => {
        if (tempElements.current && tempElements.current.length > 0) {
            setElements(tempElements.current);
        }
    }, [tempElements.current.length])
    const nodeTypes = {
        multiBranchNode: multiBranchNode,
        plusNode: plusNode,
        emptyCardNode: emptyCardNode
    };

    const deleteNodeClick = (event, nodeId, nodeTitle, isRedux) => {
        handleCancel();
        onElementsRemove(tempElements.current.filter(itr => itr.id === nodeId));
        dispatch(updateIdForDelete({}));
        if (!isRedux) {
            event.stopPropagation();
        }
        getAllChildNodes(nodeId, []);
    };

    const getAllChildNodes = (nodeId, allNodeIds) => {
        let childNodes = tempElements.current.filter(itr => itr.source === nodeId);
        if (childNodes.length > 0) {
            childNodes.forEach(itr => {
                allNodeIds.push(itr.target);
                return getAllChildNodes(itr.target, allNodeIds);
            });
        } else {
            orphanChildIds.current = allNodeIds;
        }
    };

    useEffect(() => {
        if (Object.keys(nodeForDelete).length > 0) {
            deleteNodeClick(nodeForDelete.event, nodeForDelete.nodeId, nodeForDelete.nodeTitle, nodeForDelete.isRedux);
        }
    }, [nodeForDelete])

    useEffect(() => {
        if (journeyData.current && workFlowCardDataRedux[journeyData.current.id]) {
            let newJourneyNode = {
                ...journeyData.current, data: {
                    label:
                        <Card title={<div className='titleContent'>
                            <img style={{width: 20}}
                                 src={`/assets/icons/icon-timer.svg`}
                                 alt="icon"/><span>Journey Entry</span>
                        </div>}>
                            <Typography className={'columnFlex'}>
                                <strong style={{fontSize: 10}}>Evaluate every: 3
                                    hours</strong>
                                <Divider/>
                                <Paragraph>Segment: {workFlowCardDataRedux[journeyData.current.id].segments}</Paragraph>
                            </Typography>
                        </Card>
                }
            }
            setElements((es) => es.concat(newJourneyNode));
        }
    }, [workFlowCardDataRedux]);

    const createNodeFromActivity = (nodeContent, nodeType, nodeTitle, nodeSvg, branchCount, existingNodeId, formData) => {
        let tempElementsObj = tempElements.current;
        let multiBranchNode = (nodeType === 'randomSplit' || nodeType === 'multiVariateSplit');
        const position = (existingNodeId) ? modalData.currentElement.position : {
            x: Math.floor(modalData.currentElement.position.x + Math.random() * 40),
            y: Math.floor(modalData.currentElement.position.y + Math.random() * 150)
        };
        let previousEdge = [...tempElementsObj].filter(itr => itr.target === elementSelected.id);
        tempElementsObj = removeElements(new Array(elementSelected), tempElementsObj);
        if (previousEdge.length > 0) {
            let newNodeId = existingNodeId && !multiBranchNode ? existingNodeId : getId().concat(`-${nodeType}`);
            const newNode = {
                id: newNodeId,
                position,
                type: (multiBranchNode || nodeType === 'yesNoSplit' || nodeType === 'multiVariateSplit') ? 'multiBranchNode' : 'default',
                data: (multiBranchNode || nodeType === 'yesNoSplit' || nodeType === 'multiVariateSplit') ? {
                    nodeContent: nodeContent,
                    nodeTitle: nodeTitle,
                    nodeSvg: nodeSvg,
                    branchCount: branchCount,
                    id: newNodeId
                } : {
                    label:
                        <Card title={<div className='titleContent'>
                            <img style={{width: 20}} src={nodeSvg} alt="icon"/><span>{nodeTitle}</span></div>}
                              extra={<CloseOutlined onClick={(e) => deleteNodeClick(e, newNodeId, nodeTitle, false)}/>}>
                            {nodeContent}
                        </Card>
                }
            };
            tempElementsObj.push(newNode);
            if (!existingNodeId && !multiBranchNode) {
                createSourceEdgeNode(newNodeId, nodeType, branchCount, position, tempElementsObj);
            } else if (!multiBranchNode) {
                let targetEdgeObj = [...tempElementsObj].filter(itr => itr.source === elementSelected.id)[0];
                createTargetEdgeNode(targetEdgeObj.target, newNodeId, targetEdgeObj.sourceHandle, targetEdgeObj.label, tempElementsObj);
            } else {
                let childNodes = tempElements.current.filter(itr => itr.source === elementSelected.id);
                let tempObj = [];
                if (childNodes.length > 0) {
                    childNodes.forEach(itr => {
                        tempObj.push(itr);
                    });
                    orphanChildIds.current = tempObj;
                }
                createSourceEdgeNode(newNodeId, nodeType, branchCount, position, tempElementsObj);
            }
            createTargetEdgeNode(newNodeId, previousEdge[0].source, previousEdge[0].sourceHandle, previousEdge[0].label, tempElementsObj);
            if (nodeType === 'randomSplit' || nodeType === 'multiVariateSplit') {
                let oldSourceNode = null;
                orphanChildIds.current.forEach(itr => {
                    let found = false;
                    let nodeToDelete = [];
                    let oldNodeType = itr.target.split("-")[1];
                    if (oldNodeType !== 'addActivity') {
                        tempElementsObj.forEach(itrOne => {
                            if (!found && itrOne.source === newNodeId && itrOne.label === itr.label) {
                                nodeToDelete.push({id: itr.id});
                                nodeToDelete.push({id: itrOne.target});
                                itrOne.target = itr.target;
                                found = true;
                            }
                        });
                    } else {
                        tempElementsObj = removeElements(tempElementsObj.filter(itrOne => itr.target === itrOne.id), tempElementsObj);
                    }
                    oldSourceNode = itr.source;
                    if (found) {
                        tempElementsObj = removeElements(nodeToDelete, tempElementsObj);
                    }
                });
                orphanChildIds.current = [];
                tempElements.current = tempElementsObj;
                tempElementsObj = removeElements(new Array({id: oldSourceNode}), tempElementsObj);
                setModalData({...modalData, cardId: newNodeId});
            }
            setNodeTitle("");
            saveAutomationData(formData, newNodeId, elementSelected.id);
            saveJson();
            setElementSelected({id: ''});
        } else {
            message.error("Unable to get previous node details", 0.8).then(_ => {
            });
        }
    };

    const saveAutomationData = (formData, newNodeId, oldId) => {
        editObjectById({
            id: newNodeId,
            ...workFlowCardDataRedux,
            [newNodeId]: formData,
            [oldId]: undefined
        }, 'cardData').then(async nodeDataAsync => {
            let nodeDataRes = await nodeDataAsync.json();
            if (nodeDataRes) {
                message.success('Node data has been successfully captured', 0.6).then(_ => {
                });
                dispatch(updateWorkFlowCardData(nodeDataRes));
            }
        }).catch(reason => {
            console.log(reason);
            message.error(GET_SERVER_ERROR, 0.8).then(() => {
            });
        });
    };

    const createSourceEdgeNode = (sourceId, nodeType, branchCount, position, tempObj) => {
        if (nodeType === 'multiVariateSplit' || nodeType === 'randomSplit' || nodeType === 'yesNoSplit' || nodeType === 'holdOut') {
            let counter = 0;
            let edgeLabel = null;
            while (counter < branchCount) {
                if (nodeType === 'yesNoSplit') {
                    counter === 0 ? edgeLabel = 'Yes' : edgeLabel = 'No';
                } else if (nodeType === 'holdOut') {
                    counter === 0 ? edgeLabel = null : edgeLabel = 'Holdout';
                } else {
                    edgeLabel = `Branch ${String.fromCharCode(65 + counter)}`;
                    if (counter === branchCount - 1 && nodeType === 'multiVariateSplit') {
                        edgeLabel = 'Else';
                    }
                }
                edgeLabel !== 'Holdout' ? createAddActivityNode(sourceId, `srcToAct${counter}`, position, counter, edgeLabel, 'plusNode', tempObj) :
                    createAddActivityNode(sourceId, `srcToAct${counter}`, position, counter, edgeLabel, 'emptyCardNode', tempObj);
                counter++;
            }
        } else {
            createAddActivityNode(sourceId, null, position, 0, null, 'plusNode', tempObj);
        }
    };

    const createAddActivityNode = (sourceId, sourceHandler, oldPosition, counter, label, cardType, tempObj) => {
        const position = {
            x: Math.floor(oldPosition.x + Math.random() * 40),
            y: Math.floor(oldPosition.y + Math.random() * 150)
        };
        let newNodeId = String(parseInt(getId(), 10) + counter).concat(cardType === 'plusNode' ? `-addActivity` : '-emptyCardNode');
        const activityNode = {
            id: newNodeId,
            position,
            type: cardType,
            data: cardType === 'emptyCardNode' ? {id: newNodeId} : null
        };
        tempObj.push(activityNode);
        tempElements.current = tempObj;
        createTargetEdgeNode(newNodeId, sourceId, sourceHandler, label, tempObj)
    };

    const createTargetEdgeNode = (targetId, sourceId, sourceHandler, label, tempObj) => {
        let edgeNode = {
            "source": sourceId,
            "sourceHandle": sourceHandler,
            "target": targetId,
            "targetHandle": label === 'Holdout' ? 'emptyCardVoid' : `plusToNode`,
            "id": `reactflow__edge-src${sourceId}-tr${targetId}`,
            "label": label
        }
        tempObj.push(edgeNode);
        tempElements.current = tempObj;
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
            {isJourneyModal ? <JourneyEntryModal data={{...elementSelected, workflowKey: props.amendObj.key}}
                                                 openModal={isJourneyModal} closeModal={handleCancel}/> : null}
            {isActivityModal ?
                <ActivityModal selectedCardType={cardType}
                               createNode={createNodeFromActivity} openModal={true} modalData={modalData}
                               closeModal={handleCancel}/> : null}
            <div className='gridDisplay'>
                <ReactFlowProvider>
                    <div className="reactflow-wrapper" ref={reactFlowWrapper}>
                        <ReactFlow onElementClick={openType ? onElementClick : undefined}
                                   elements={tempElements.current.length === 0 ? elements : tempElements.current}
                                   nodeTypes={nodeTypes} nodesDraggable={openType} nodesConnectable={openType}
                                   ref={reactFlowInstance} paneMoveable={openType}
                                   onNodeDragStop={openType ? onNodeDragStop : undefined}
                                   onConnect={openType ? onConnect : undefined} onLoad={onLoad}>
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
