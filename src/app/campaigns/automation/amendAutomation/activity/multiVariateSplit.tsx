import React, {useEffect, useState} from "react";
import {Button, Divider, Form, Input, message, Select, Space} from "antd";
import {CheckOutlined, MinusCircleOutlined, PlusOutlined} from "@ant-design/icons";
import Paragraph from "antd/es/typography/Paragraph";
import {DropDown} from "../../../../../utils/Interfaces";
import '../amendAutomation.scss';
import {GET_SERVER_ERROR, getBranchStyle} from "../../../../../utils/common";
import {useSelector} from "react-redux";
import {editObjectById, getObjectById} from "../../../../../service/serverCalls/mockServerRest";

export const MultiVariateSplit = (props: any) => {

    const [multiVariateSplitForm] = Form.useForm();
    const {Option} = Select;

    // @ts-ignore
    const workFlowCardData = useSelector((state) => state.root.workFlowData);

    const saveMultiVariateSplitForm = (values: any) => {
        if (branchCount === 0) {
            message.error("At least one branch selection is required").then(_ => {
            })
        } else {
            editObjectById({
                id: props.modalData.cardId,
                ...workFlowCardData,
                [props.modalData.cardId]: values.multiVariateSplitFormObj
            }, 'cardData').then(async waitAsync => {
                let waitRes = await waitAsync.json();
                if (waitRes) {
                    message.success('Multivariate form data has been successfully updated', 0.6).then(_ => {
                    });
                }
            }).catch(reason => {
                console.log(reason);
                message.error(GET_SERVER_ERROR, 0.8).then(() => {
                });
            });
            props.createCard(
                <div style={{display: "flex", justifyContent: 'center', flexDirection: 'column'}}>
                    {values.multiVariateSplitFormObj.branch && Object.keys(values.multiVariateSplitFormObj.branch).map((itr: any, index: number) => {
                        return <Paragraph> <span className='dot'
                                                 style={{backgroundColor: getBranchStyle(index % 4)}}/>Branch {itr}
                        </Paragraph>
                    })}
                </div>, 'multiVariateSplit', 'Multivariate Split', '/assets/icons/icon-multivariate-split.svg',
                values.multiVariateSplitFormObj.branch ? Object.keys(values.multiVariateSplitFormObj.branch).length + 1 : null, props.modalData ? props.modalData.cardId : null);
        }
    };

    useEffect(() => {
        if (props.modalData) {
            getObjectById(props.modalData.workFlowId, 'cardData').then(async getMultivariateAsync => {
                let multiVariateRes = await getMultivariateAsync.json();
                if (multiVariateRes && multiVariateRes[props.modalData.cardId]) {
                    multiVariateRes = multiVariateRes[props.modalData.cardId];
                    setBranchCount(Object.keys(multiVariateRes.branch).length);
                    let arrLength = Object.keys(multiVariateRes.branch).length;
                    let tempObj = [];
                    while (arrLength-- > 0) {
                        tempObj.push(1);
                    }
                    multiVariateSplitForm.setFieldsValue({
                        multiVariateSplitFormObj: {
                            branch: multiVariateRes.branch,
                            evaluation: multiVariateRes.evaluation,
                            description: multiVariateRes.description
                        }
                    });
                    setArr(tempObj);
                }
            }).catch(_ => {
                console.log("Unable to get wait data");
                message.error(GET_SERVER_ERROR, 0.8).then(() => {
                });
            });
        }
    }, []);

    const [branchCount, setBranchCount] = useState(1);

    const conditionEvalSelect: DropDown[] = [
        {value: 'evalIm', label: 'Evaluate Immediately', children: null},
        {value: 'evalPr', label: 'Evaluate Periodically', children: null},
        {value: 'evalMn', label: 'Evaluate Monthly', children: null}
    ];

    const [arr, setArr] = useState<Number[]>([1]);

    useEffect(() => {
    }, [branchCount, arr]);


    const updateBranchCount = (opsType: string) => {
        let tempObj = [...arr];
        if (opsType === 'add') {
            setBranchCount(branchCount + 1);
            tempObj.push(1);
        } else {
            setBranchCount(branchCount - 1);
            tempObj.pop();
        }
        setArr(tempObj);
    }

    return <Form className={'multiVariateSplit'} name="multiVariateSplitForm" form={multiVariateSplitForm}
                 layout={'vertical'}
                 onFinish={saveMultiVariateSplitForm} autoComplete={'off'}>
        <div className='variableForm'>
            {arr.map((value, index) => {
                return <Space style={{display: 'flex'}} align="center">
                    <Form.Item label={<div className='branchName'>
                        <span className='dot' style={{backgroundColor: getBranchStyle(index % 4)}}/>
                        <span>{`Branch ${String.fromCharCode(65 + index)}`}</span></div>}
                               requiredMark={'optional'}
                               name={['multiVariateSplitFormObj', 'branch', `${String.fromCharCode(65 + index)}`]}
                               rules={[{required: true, message: 'Missing Branch condition Attributes'}]}>
                        <Select dropdownClassName='antSelect' style={{width: 221}}
                                placeholder="select condition type"
                                allowClear optionLabelProp="label">
                            {conditionEvalSelect.map(value => {
                                return <Option value={value.label} key={value.value}>{value.label}</Option>
                            })}
                        </Select>
                    </Form.Item>
                    <div className={'multiCloseIcon'}>
                        {branchCount > 1 ? <MinusCircleOutlined onClick={() => updateBranchCount('delete')}/> : null}
                    </div>
                </Space>
            })}
            <Form.Item className='conBtn'>
                <Button type="link" className='btn' onClick={() => updateBranchCount('add')} block
                        icon={<PlusOutlined/>}
                        disabled={branchCount >= 4}>
                    Add Another Branch
                </Button>
            </Form.Item>
        </div>
        <Divider/>
        <Form.Item
            label={<div className='colFlex'><strong>Condition evaluation</strong>
                <span>The amount of time that Amazon Pinpoint waits before it evaluated the conditions</span>
            </div>}>
            <Form.Item name={['multiVariateSplitFormObj', 'evaluation']} noStyle>
                <Select showSearch placeholder="Select condition type" allowClear={true}>
                    {conditionEvalSelect.map(value => {
                        return <Option value={value.label} key={value.value}>{value.label}</Option>
                    })}
                </Select>
            </Form.Item>
        </Form.Item>
        <Form.Item label={<strong>Description - optional</strong>}>
            <Form.Item name={['multiVariateSplitFormObj', 'description']} noStyle>
                <Input placeholder={'Enter a description for this step'}/>
            </Form.Item>
        </Form.Item>
        <div className='reverseFlex'>
            <Form.Item>
                <Button style={{marginRight: 8}} key="save" htmlType={'submit'} type="primary"
                        icon={<CheckOutlined/>}>
                    Save
                </Button>
            </Form.Item>
        </div>
    </Form>
}
