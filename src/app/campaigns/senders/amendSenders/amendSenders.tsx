import React, {useEffect} from "react";
import {Button, Form} from "antd";
import {StepBackwardOutlined} from "@ant-design/icons";
import {FormEditPage} from "../../../common/formEdit/formEdit";
import {updateBreadcrumb} from "../../../../store/actions/root";
import {useDispatch} from "react-redux";
import {populateFormObj} from "../../../../utils/common";
import Title from "antd/es/typography/Title";

export const AmendSendersPage: any = (props: any) => {
    const [sendersForm] = Form.useForm();
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(updateBreadcrumb(['Campaigns', 'Senders', 'Create/Modify Sender']));
        populateFormObj(props.sendersObj, sendersForm);
    }, [dispatch, sendersForm, props.sendersObj]);
    const saveSendersForm = (values: any) => {
        console.log(values);
    }
    return (
        <div className="pageLayout">
            <div className="reverseFlex">
                <Button className='leftMargin' icon={<StepBackwardOutlined/>}
                        onClick={props.routeToOverview}>Cancel</Button>
            </div>
            <div className='secondNav'>
                <Title
                    level={4}>{props.sendersObj.firstName ? 'Modify Sender '.concat(props.sendersObj.firstName.concat(' ').concat(props.sendersObj.lastName)) : 'Add Sender'}</Title>
            </div>
            <div className="thirdNav" style={{height: 'calc(100vh - 280px'}}>
                <FormEditPage generalForm={sendersForm} saveFormValues={saveSendersForm}/>
            </div>
        </div>)
}