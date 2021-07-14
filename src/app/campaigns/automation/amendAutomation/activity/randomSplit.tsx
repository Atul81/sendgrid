import React, {useEffect, useState} from "react";
import {Button, Divider, Form, Input, Space} from "antd";
import {CheckOutlined, MinusCircleOutlined, PlusOutlined} from "@ant-design/icons";
import Title from "antd/es/typography/Title";
import Paragraph from "antd/es/typography/Paragraph";
import '../amendAutomation.scss';

export const RandomSplit = (props: any) => {

    const [randomSplitSplit] = Form.useForm();
    const saveRandomSplitForm = (values: any) => {
        props.createCard(
            <div style={{display: "flex", justifyContent: 'center', flexDirection: 'column'}}>
                <Title level={5}>Evaluate Immediately</Title>
                <Divider/>
                {values.multiVariateSplitFormObj.branch.map((itr: any) => {
                    return <Paragraph><span className="dot"/>{itr}</Paragraph>
                })}
            </div>, 'multiVariateSplit', 'Multivariate Split');
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
    };

    return <Form className='multiVariateSplit randomSplit' name="randomSplit" form={randomSplitSplit}
                 layout={'horizontal'} colon={false}
                 onFinish={saveRandomSplitForm} autoComplete={'off'}>
        <div className='variableForm'>
            {arr.map((value, index) => {
                return <Space align="center">
                    <Form.Item label={<div className='branchName'>
                        <span className='dot' style={{backgroundColor: getBranchStyle(index % 4)}}/>
                        <span>{`Branch ${String.fromCharCode(65 + index)}`}</span></div>}
                               requiredMark={'optional'}
                               name={['randomSplitFormObj', `attr${String.fromCharCode(65 + index)}`]}
                               rules={[{required: true, message: 'Missing Branch condition Attributes'}]}>
                        <Input placeholder={'Enter split percentage'} type={'number'}/>
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
                {branchCount > 0 ? <strong>Total Percentage: 80%</strong> : null}
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
