import React, {useEffect} from "react";
import {Button, Form, message} from "antd";
import {StepBackwardOutlined} from "@ant-design/icons";
import {FormEditPage} from "../../../common/formEdit/formEdit";
import {updateBreadcrumb} from "../../../../store/actions/root";
import {useDispatch} from "react-redux";
import {populateFormObj} from "../../../../utils/common";
import Title from "antd/es/typography/Title";
import {addNewObject, editObjectById, getObjectById} from "../../../../service/serverCalls/mockServerRest";

export const AmendSendersPage: any = (props: any) => {
    const [sendersForm] = Form.useForm();
    const dispatch = useDispatch();
    const sendersName = props.sendersObj.key ? props.sendersObj.firstName.concat(' ').concat(props.sendersObj.lastName) : undefined;

    const saveSendersForm = (values: any) => {
        if (props.sendersObj.key && !props.generatedId) {
            editObjectById({...values.formObj, id: props.sendersObj.key}, 'senders').then(async editResAsync => {
                let editRes = await editResAsync.json();
                if (editRes) {
                    message.success(`Sender ${props.sendersObj.email} has been successfully updated`, 0.6);
                }
            });
        } else {
            addNewObject({...values.formObj, id: props.generatedId}, 'senders').then(async newSenderResAsync => {
                let newSenderRes = await newSenderResAsync.json();
                if (newSenderRes) {
                    message.success(`Sender ${values.formObj.firstName.concat(' ').concat(values.formObj.lastName)} has been successfully created`, 0.7)
                }
            });
        }
    };

    useEffect(() => {
        dispatch(updateBreadcrumb(['Campaigns', 'Senders', 'Create/Modify Sender']));
        if (props.sendersObj.key) {
            getObjectById(props.sendersObj.key, 'senders').then(async senderByIdAsync => {
                let sendersObj = await senderByIdAsync.json();
                if (sendersObj) {
                    populateFormObj(sendersObj, sendersForm);
                }
            });
        }
    }, [dispatch, sendersForm, props.sendersObj]);

    return (
        <div className="pageLayout">
            <div className="reverseFlex">
                <Button className='leftMargin' icon={<StepBackwardOutlined/>}
                        onClick={props.routeToOverview}>Cancel</Button>
            </div>
            <div className='secondNav'>
                <Title
                    level={4}>{props.sendersObj.firstName ? 'Modify Sender: '.concat(sendersName) : 'Add Sender'}</Title>
            </div>
            <div className="thirdNav" style={{height: 'calc(100vh - 280px'}}>
                <FormEditPage key={props.sendersObj.key} type={'senders'} emailEditable={!!props.sendersObj.key}
                              generalForm={sendersForm}
                              saveFormValues={saveSendersForm}/>
            </div>
        </div>)
}