import React, {useEffect} from "react";
import {Button, Form, Input, message} from "antd";
import {CheckOutlined} from "@ant-design/icons";
import Title from "antd/es/typography/Title";
import '../amendAutomation.scss';
import {useSelector} from "react-redux";
import {editObjectById, getObjectById} from "../../../../../service/serverCalls/mockServerRest";
import {GET_SERVER_ERROR} from "../../../../../utils/common";

export const HoldOut = (props: any) => {

    const [holdOutForm] = Form.useForm();
    // @ts-ignore
    const workFlowCardData = useSelector((state) => state.root.workFlowData);

    const saveHoldOutForm = (values: any) => {
        editObjectById({
            id: props.modalData.cardId,
            ...workFlowCardData,
            [props.modalData.cardId]: values.holdOutFormObj
        }, 'cardData').then(async holdOutAsync => {
            let holdOutRes = await holdOutAsync.json();
            if (holdOutRes) {
                message.success('Holdout data has been successfully updated', 0.6).then(_ => {
                });
            }
        }).catch(reason => {
            console.log(reason);
            message.error(GET_SERVER_ERROR, 0.8).then(() => {
            });
        });
        props.createCard(
            <div style={{display: "flex", justifyContent: 'center', flexDirection: 'column'}}>
                <Title level={5}>Holdout: {values.holdOutFormObj.holdOutPercentage}%</Title>
            </div>, 'holdOut', 'HoldOut', '/assets/icons/icon-holdout.svg', 2, props.modalData ? props.modalData.cardId : null);
    };

    useEffect(() => {
        if (props.modalData) {
            getObjectById(props.modalData.workFlowId, 'cardData').then(async getHoldOutAsync => {
                let holdOutRes = await getHoldOutAsync.json();
                if (holdOutRes && holdOutRes[props.modalData.cardId]) {
                    holdOutRes = holdOutRes[props.modalData.cardId];
                    holdOutForm.setFieldsValue({
                        holdOutFormObj: {
                            holdOutPercentage: holdOutRes.holdOutPercentage,
                            description: holdOutRes.description
                        }
                    });
                }
            }).catch(_ => {
                console.log("Unable to get holdout data");
                message.error(GET_SERVER_ERROR, 0.8).then(() => {
                });
            });
        }
    }, []);

    return <Form className={'holdOut'} name="holdOutForm" form={holdOutForm}
                 layout={'vertical'}
                 onFinish={saveHoldOutForm} autoComplete={'off'}>
        <Form.Item label={<div className='colFlex'><strong>Holdout Percentage</strong>
            <span>Specify the percentage of customers who should exit the journey</span>
        </div>
        }>
            <Form.Item name={['holdOutFormObj', 'holdOutPercentage']} noStyle>
                <Input placeholder={'Enter a description for this step'} type={'number'}/>
            </Form.Item>
        </Form.Item>
        <Form.Item label={<strong>Description - optional</strong>}>
            <Form.Item name={['holdOutFormObj', 'description']} noStyle>
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
