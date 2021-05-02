import React, {useEffect, useState} from "react";
import './editContact.scss';
import {updateBreadcrumb} from "../../../../store/actions/root";
import {useDispatch} from "react-redux";
import {Button, Form, Input, Tabs} from "antd";
import Title from "antd/lib/typography/Title";
import {StepBackwardOutlined} from '@ant-design/icons';
import {FormEditPage} from "../../../common/formEdit/formEdit";
import {populateFormObj} from "../../../../utils/common";
import {CustomFields} from "../../contactInterface";

export const EditContactPage: any = (props: any) => {
    const dispatch = useDispatch();
    const {TabPane} = Tabs;
    const [contactForm] = Form.useForm();

    useEffect(() => {
        dispatch(updateBreadcrumb(['Audience', 'Contacts', 'Edit Contact']));
        populateFormObj(props.contactObj, contactForm);
    }, [dispatch, contactForm, props.contactObj]);

    const modifyContactService = (values: any) => {
        console.log(values);
    };

    const [customFieldForm] = Form.useForm();

    const [customFieldsDS, setCustomFieldsDS] = useState<CustomFields[]>([
        {
            key: 'anniversary',
            fieldName: 'Anniversary',
            fieldType: 'text',
        },
        {
            key: 'alternateEmail',
            fieldName: 'Alternate Email',
            fieldType: 'email',
        },
        {
            key: 'alternateNumber',
            fieldName: 'Alternate Number',
            fieldType: 'number',
        }
    ]);
    return (
        <div className="editContact pageLayout">
            <div className="firstNav">
                <div className="leftPlacement">
                    <Title
                        level={4}>{props.contactObj.firstName ? [props.contactObj.firstName, ' ', props.contactObj.lastName] : 'Add Contact Manually'}</Title>
                </div>
                <div className="rightPlacement">
                    <Button className="deleteBtn" icon={<StepBackwardOutlined/>}
                            onClick={props.routeToOverview}>Cancel</Button>
                </div>
            </div>
            <div className="tabsNav">
                <Tabs defaultActiveKey="1">
                    <TabPane tab="General" key="1">
                        <FormEditPage generalForm={contactForm} saveFormValues={modifyContactService}/>
                    </TabPane>
                    <TabPane style={{width: 408}} tab="Custom Fields" key="2">
                        <Form form={customFieldForm} layout={'vertical'} onFinish={modifyContactService}>
                            {customFieldsDS.map(mapItr => {
                                return <Form.Item label={mapItr.fieldName} name={['formObj', mapItr.key]}>
                                    <Input type={mapItr.fieldType} placeholder={"Enter ".concat(mapItr.fieldName)}/>
                                </Form.Item>
                            })}
                            <Form.Item>
                                <Button type="primary" htmlType={'submit'}>Save</Button>
                            </Form.Item>
                        </Form>
                    </TabPane>
                </Tabs>
            </div>
        </div>
    );
}