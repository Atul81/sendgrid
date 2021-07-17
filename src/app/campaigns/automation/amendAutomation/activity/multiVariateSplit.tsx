import React, {useEffect, useState} from "react";
import {Button, Divider, Form, Input, Select, Space} from "antd";
import {CheckOutlined, MinusCircleOutlined, PlusOutlined} from "@ant-design/icons";
import Paragraph from "antd/es/typography/Paragraph";
import {DropDown} from "../../../../../utils/Interfaces";
import '../amendAutomation.scss';

export const MultiVariateSplit = (props: any) => {

    const [multiVariateSplitForm] = Form.useForm();
    const {Option} = Select;

    const saveMultiVariateSplitForm = (values: any) => {
        props.createCard(
            <div style={{display: "flex", justifyContent: 'center', flexDirection: 'column'}}>
                {Object.keys(values.multiVariateSplitFormObj.branch).map((itr: any, index: number) => {
                    return <Paragraph> <span className='dot' style={{backgroundColor: getBranchStyle(index % 4)}}/>Branch {itr}</Paragraph>
                })}
            </div>, 'multiVariateSplit', 'Multivariate Split', '/assets/icons/icon-multivariate-split.svg', Object.keys(values.multiVariateSplitFormObj.branch).length+1);
    };

    const [branchCount, setBranchCount] = useState(0);

    const conditionEvalSelect: DropDown[] = [
        {value: 'evalIm', label: 'Evaluate Immediately', children: null},
        {value: 'evalPr', label: 'Evaluate Periodically', children: null},
        {value: 'evalMn', label: 'Evaluate Monthly', children: null}
    ];
    const getBranchStyle = (key: number) => {
        switch (key) {
            case 0:
                return 'orange';
            case 1:
                return 'blue';
            case 2:
                return 'green';
            case 3:
                return 'red';
            default:
                return '#bbb';

        }
    };

    const [arr, setArr] = useState<Number[]>([]);

    useEffect(() => {
        console.error(arr);
    }, [branchCount, arr.length]);


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
                        <MinusCircleOutlined onClick={() => updateBranchCount('delete')}/>
                    </div>
                </Space>
            })}
            <Form.Item className='conBtn'>
                <Button type="link" className='btn' onClick={() => updateBranchCount('add')} block
                        icon={<PlusOutlined/>}
                        disabled={branchCount === 4}>
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
