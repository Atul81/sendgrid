import React, {useEffect, useState} from "react";
import {Button, Divider, Form, Input, message, Popover, Space} from "antd";
import {CheckOutlined, MinusCircleOutlined, PlusOutlined} from "@ant-design/icons";
import Paragraph from "antd/es/typography/Paragraph";
import '../amendAutomation.scss';

export const RandomSplit = (props: any) => {

    const [randomSplitForm] = Form.useForm();
    const [percentage, setPercentage] = useState(0);
    const saveRandomSplitForm = (values: any) => {
        if (percentage === 0 || percentage > 100) {
            message.error('Sum of percentages of all the branch should be hundred(100)', 0.8).then(_ => {
            });
        } else {
            props.createCard(
                <div style={{display: "flex", justifyContent: 'center', flexDirection: 'column'}}>
                    {values.randomSplitFormObj.branch && Object.keys(values.randomSplitFormObj.branch).map((itr: any, index: number) => {
                        return <Paragraph key={index}>
                            <span className='dot' style={{backgroundColor: getBranchStyle(index % 4)}}/>
                            Branch {itr}
                        </Paragraph>
                    })}
                </div>, 'randomSplit', 'Random Split', '/assets/icons/icon-random-split.svg', values.randomSplitFormObj.branch ? Object.keys(values.randomSplitFormObj.branch).length : null, props.modalData ? props.modalData.cardId : null);
        }
    };

    const [branchCount, setBranchCount] = useState(0);
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
            case 4:
                return 'yellow';
            default:
                return '#bbb';

        }
    };

    const [arr, setArr] = useState<Number[]>([]);

    useEffect(() => {
    }, [branchCount, arr.length, percentage]);

    const updatePercentage = () => {
        let tempPercentage = 0;
        let branchFormValues = randomSplitForm.getFieldsValue().randomSplitFormObj.branch;
        Object.keys(branchFormValues).map(itr => tempPercentage += parseInt(branchFormValues[itr], 10));
        setPercentage(tempPercentage);
    }
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
    };

    return <Form className='multiVariateSplit randomSplit' name="randomSplit" form={randomSplitForm}
                 layout={'horizontal'} colon={false}
                 onFinish={saveRandomSplitForm} autoComplete={'off'}>
        <div className='variableForm'>
            {arr.map((value, index) => {
                return <Space align="center">
                    <Form.Item label={<div className='branchName'>
                        <span className='dot' style={{backgroundColor: getBranchStyle(index % 4)}}/>
                        <span><Popover content={<p>Input type should be percentage</p>} title={null}>
                            <span>{`Branch ${String.fromCharCode(65 + index)}`}</span> </Popover></span></div>}
                               requiredMark={'optional'}
                               name={['randomSplitFormObj', 'branch', `${String.fromCharCode(65 + index)}`]}
                               rules={[{required: true, message: 'Missing Branch condition Attributes'}]}>
                        <Input onChange={updatePercentage} placeholder={'Enter split percentage'} type={'number'}/>
                    </Form.Item>
                    <div className={'closeIcon'}>
                        <MinusCircleOutlined onClick={() => updateBranchCount('delete')}/>
                    </div>
                </Space>
            })}
            <Form.Item className='conPer'>
                <Button type="link" className='btn' onClick={() => updateBranchCount('add')} block
                        icon={<PlusOutlined/>}
                        disabled={branchCount === 5}>
                    Add Another Branch
                </Button>
                {branchCount > 0 ? <strong>Total Percentage: {percentage}%</strong> : null}
            </Form.Item>
        </div>
        <Divider/>
        <Form.Item label={<strong>Description - optional</strong>}>
            <Form.Item name={['randomSplitFormObj', 'description']} noStyle>
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
