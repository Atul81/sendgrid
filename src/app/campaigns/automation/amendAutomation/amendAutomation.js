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
    let elementsTemp = [];
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
                case "holdOut":
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
        plusNode: plusNode,
        emptyCardNode: emptyCardNode
    };

    const deleteNodeClick = (event, nodeId, nodeTitle, isRedux) => {
        handleCancel();
        onElementsRemove(new Array({id: nodeId, nodeTitle: nodeTitle}));
        orphanChildIds.current = elements.filter(value => {
            return value.source && value.source === nodeId;
        }).map(val => val.target);
        dispatch(updateIdForDelete({}));
        if (!isRedux) {
            event.stopPropagation();
        }
    };

    useEffect(() => {
        if (Object.keys(nodeForDelete).length > 0) {
            deleteNodeClick(nodeForDelete.event, nodeForDelete.nodeId, nodeForDelete.nodeTitle, nodeForDelete.isRedux);
        }
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

    }, [nodeForDelete, workFlowCardDataRedux]);

    const createNodeFromActivity = (nodeContent, nodeType, nodeTitle, nodeSvg, branchCount, existingNodeId) => {
        const position = existingNodeId ? modalData.currentElement.position : {
            x: Math.floor(modalData.currentElement.position.x + Math.random() * 40),
            y: Math.floor(modalData.currentElement.position.y + Math.random() * 150)
        };
        let newNodeId = existingNodeId ? existingNodeId : getId().concat(`-${nodeType}`);
        const newNode = {
            id: newNodeId,
            position,
            type: (nodeType === 'randomSplit' || nodeType === 'yesNoSplit' || nodeType === 'multiVariateSplit' || nodeType === 'holdOut') ? 'multiBranchNode' : 'default',
            data: (nodeType === 'randomSplit' || nodeType === 'yesNoSplit' || nodeType === 'multiVariateSplit' || nodeType === 'holdOut') ? {
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
        setElements((es) => es.concat(newNode));
        elementsTemp = [...elements];
        elements.push(newNode);
        if (!existingNodeId) {
            createTargetEdgeNode(newNodeId, elementSelected.id, null, null);
            createSourceEdgeNode(newNodeId, nodeType, branchCount, position);
        }
        setNodeTitle("");
    };
    const createSourceEdgeNode = (sourceId, nodeType, branchCount, position) => {
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
                edgeLabel !== 'Holdout' ? createAddActivityNode(sourceId, `srcToAct${counter}`, position, counter, edgeLabel, 'plusNode') :
                    createAddActivityNode(sourceId, `srcToAct${counter}`, position, counter, edgeLabel, 'emptyCardNode');
                counter++;
            }
        } else {
            createAddActivityNode(sourceId, null, position, 0, null, 'plusNode');
        }
    };

    const createAddActivityNode = (sourceId, sourceHandler, oldPosition, counter, label, cardType) => {
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
        setElements((es) => es.concat(activityNode));
        elementsTemp = [...elements];
        elements.push(activityNode);
        createTargetEdgeNode(newNodeId, sourceId, sourceHandler, label)
    };

    const createTargetEdgeNode = (targetId, sourceId, sourceHandler, label) => {
        let edgeNode = {
            "source": sourceId,
            "sourceHandle": sourceHandler,
            "target": targetId,
            "targetHandle": label === 'Holdout' ? 'emptyCardVoid' : `plusToNode`,
            "id": `reactflow__edge-src${sourceId}-tr${targetId}`,
            "label": label
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
            {isJourneyModal ? <JourneyEntryModal data={{...elementSelected, workflowKey: props.amendObj.key}}
                                                 openModal={isJourneyModal} closeModal={handleCancel}/> : null}
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
