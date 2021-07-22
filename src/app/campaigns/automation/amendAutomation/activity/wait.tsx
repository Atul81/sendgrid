import React, {useEffect} from "react";
import {Button, Form, Input, message, Radio, Select} from "antd";
import Paragraph from "antd/es/typography/Paragraph";
import {CheckOutlined} from "@ant-design/icons";
import {DropDown} from "../../../../../utils/Interfaces";
import {editObjectById, getObjectById} from "../../../../../service/serverCalls/mockServerRest";
import {GET_SERVER_ERROR} from "../../../../../utils/common";
import {useSelector} from "react-redux";

export const Wait = (props: any) => {
    const [waitForm] = Form.useForm();
    const {Option} = Select;
    // @ts-ignore
    const workFlowCardData = useSelector((state) => state.root.workFlowData);

    const saveWaitForm = (values: any) => {
        editObjectById({
            id: props.modalData.cardId,
            ...workFlowCardData,
            [props.modalData.cardId]: values.waitObj
        }, 'cardData').then(async waitAsync => {
            let waitRes = await waitAsync.json();
            if (waitRes) {
                message.success('Wait data has been successfully updated', 0.6).then(_ => {
                });
            }
        }).catch(reason => {
            console.log(reason);
            message.error(GET_SERVER_ERROR, 0.8).then(() => {
            });
        });
        props.createCard(
            <div style={{display: "flex", justifyContent: 'center', flexDirection: 'column'}}>
                <Paragraph>Wait for: {values.waitObj.timeAmount} {values.waitObj.timeUnit}</Paragraph>
            </div>, 'wait', 'Wait', '/assets/icons/icon-wait.svg', null, props.modalData ? props.modalData.cardId : null);
    };

    useEffect(() => {
        if (props.modalData) {
            getObjectById(props.modalData.workFlowId, 'cardData').then(async getWaitAsync => {
                let waitRes = await getWaitAsync.json();
                if (waitRes && waitRes[props.modalData.cardId]) {
                    waitRes = waitRes[props.modalData.cardId];
                    waitForm.setFieldsValue({
                        waitObj: {
                            activityWait: waitRes.activityWait,
                            timeAmount: waitRes.timeAmount,
                            timeUnit: waitRes.timeUnit,
                            description: waitRes.description
                        }
                    });
                }
            }).catch(_ => {
                console.log("Unable to get wait data");
                message.error(GET_SERVER_ERROR, 0.8).then(() => {
                });
            });
        }
    }, []);
    const radioStyle = {
        display: 'block',
        height: '30px',
        lineHeight: '30px',
    };

    const timeUnit: DropDown[] = [
        {value: 'sec', label: 'seconds', children: null},
        {value: 'min', label: 'minutes', children: null},
        {value: 'hr', label: 'hour', children: null},
        {value: 'day', label: 'day', children: null}];

    return <Form className={'waitForm'} name="waitForm" form={waitForm} layout={'vertical'}
                 onFinish={saveWaitForm} autoComplete={'off'}>
        <div className='radioForm'>
            <Form.Item label={<strong>Participants should wait on this activity:</strong>}>
                <Form.Item name={['waitObj', 'activityWait']} noStyle>
                    <Radio.Group>
                        <Radio style={radioStyle} value={'periodTime'}>For a period of time</Radio>
                        <Radio style={radioStyle} value={'specificDate'}>Until a specific date</Radio>
                    </Radio.Group>
                </Form.Item>
            </Form.Item>
        </div>
        <strong>Specify the amount of time the participants should remain on this activity</strong>
        <div className='timeAmount'>
            <Form.Item label={null}>
                <Form.Item name={['waitObj', 'timeAmount']} noStyle>
                    <Input placeholder={'Enter a description for this step'} type={'number'}/>
                </Form.Item>
            </Form.Item>
            <Form.Item label={null}>
                <Form.Item name={['waitObj', 'timeUnit']} noStyle>
                    <Select placeholder="Select time unit" allowClear={true}>
                        {timeUnit.map(value => {
                            return <Option value={value.label} key={value.value}>{value.label}</Option>
                        })}
                    </Select>
                </Form.Item>
            </Form.Item>
        </div>
        <Form.Item label={<strong>Description - optional</strong>}>
            <Form.Item name={['waitObj', 'description']} noStyle>
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