import {Button, Card, Input, message, Modal, Radio, Select, Typography} from "antd";
import React, {useEffect, useState} from "react";
import ReactFlow, {
    addEdge,
    Background,
    Connection,
    Controls,
    Edge,
    Elements,
    MiniMap,
    Node,
    removeElements
} from 'react-flow-renderer';
import './amendAutomation.scss';
import {StepBackwardOutlined} from "@ant-design/icons";
import {addNewObject, editObjectById, getObjectById} from "../../../../service/serverCalls/mockServerRest";
import {updateBreadcrumb} from "../../../../store/actions/root";
import {useDispatch} from "react-redux";

export const AmendAutomationPage: any = (props: any) => {
    const [reactFlowInstance, setReactFlowInstance] = useState(null);
    const [reactFlowInstanceFitView, setReactFlowInstanceFitView] = useState(null);
    const [elements, setElements] = useState<Elements>([]);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(updateBreadcrumb(['Campaigns', 'Automation', 'amend-automation']));
        if (props.amendObj.viewType !== 'create' && props.amendObj.key) {
            getObjectById(props.amendObj.key, 'workFlow').then(async response => {
                let elementsJson = await response.json();
                if (elementsJson) {
                    let tempObj: Elements = [];
                    let elementsData = elementsJson.data;
                    elementsData.forEach((itr: any) => {
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
    }, [props.amendObj.key, props.amendObj.viewType, dispatch]);

    const {Text} = Typography;
    const {Option} = Select;
    const deleteConfirm = Modal.confirm;
    const [id, setId] = useState('0');
    const [nodeDrawer, setNodeDrawer] = useState<boolean>(false);
    const [nodeTitle, setNodeTitle] = useState<string>("");
    const [edgeTitle, setEdgeTitle] = useState<string>("");
    const [elementSelected, setElementSelected] = useState<any>({});
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isEdgeModalVisible, setIsEdgeModalVisible] = useState(false);
    const [nodeType, setNodeType] = useState<string>("default");

    const nodeStrokeColor = (n: Node): string => {
        if (n.style?.background) {
            return n.style.background as string;
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

    const nodeColor = (n: Node): string => {
        if (n.style?.background) {
            return n.style.background as string;
        }

        return '#fff';
    };

    const onElementsRemove = (elementsToRemove: Elements) => {
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
                    setElements((els: Elements) => removeElements(elementsToRemove, els));
                },
                onCancel() {
                    console.log('Node deletion cancelled');
                },
            });
        }
    };
    const onConnect = (params: Edge | Connection) => setElements((els) => addEdge(params, els));

    const createNewNode = (event: any) => {
        if (nodeTitle.length <= 0) {
            message.error("Node Title Required", 0.5).then(() => {
            });
        } else {
            event.preventDefault();
            // @ts-ignore
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

    const onLoad = (_reactFlowInstance: any) => {
        setReactFlowInstance(_reactFlowInstance);
        setReactFlowInstanceFitView(_reactFlowInstance.fitView());
    };

    const onElementClick = (event: any, element: any) => {
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

    const radioValueChange = (event: { target: { value: any; }; }) => {
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

    const onTypeChange = (value: any) => {
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

    const onNodeDragStop = (event: any, node: any) => {
        let oldElements: Elements = [...elements];
        for (let i = 0; i < elements.length; i++) {
            if (elements[i].id === node.id) {
                oldElements[i] = node;
                break;
            }
        }
        setElements(oldElements);
    }

    return (
        <div className='amendAutomation pageLayout'>
            {(props.amendObj && (props.amendObj.viewType === 'edit' || props.amendObj.viewType === 'create')) ? (
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
            <ReactFlow key={props.amendObj.key} onElementClick={onElementClick} elements={elements} snapToGrid={true}
                       snapGrid={[15, 15]} onNodeDragStop={onNodeDragStop}
                       onElementsRemove={onElementsRemove} onConnect={onConnect} onLoad={onLoad}
                       deleteKeyCode={46}>
                <MiniMap nodeStrokeColor={nodeStrokeColor} nodeColor={nodeColor} nodeBorderRadius={2}/>
                <Controls/>
                <Background color="#aaa" gap={16}/>
            </ReactFlow>
        </div>
    );
}