import React, {useEffect, useState} from "react";
import './editContact.scss';
import {updateBreadcrumb} from "../../../../store/actions/root";
import {useDispatch} from "react-redux";
import {Button, Form, Input, message, Tabs} from "antd";
import Title from "antd/lib/typography/Title";
import {StepBackwardOutlined} from '@ant-design/icons';
import {FormEditPage} from "../../../common/formEdit/formEdit";
import {populateFormObj} from "../../../../utils/common";
import {CustomFields} from "../../contactInterface";
import {addNewContact, editContactById} from "../../serverCalls/contactsFetch";

export const EditContactPage: any = (props: any) => {
    const dispatch = useDispatch();
    const {TabPane} = Tabs;
    const [contactForm] = Form.useForm();
    const [customFieldForm] = Form.useForm();

    useEffect(() => {
        dispatch(updateBreadcrumb(['Audience', 'Contacts', 'Edit Contact']));
        populateFormObj(props.contactObj, contactForm);
    }, [dispatch, contactForm, props.contactObj]);

    const modifyContactService = (values: any) => {
        if(props.contactObj.firstName) {
            editContactById({...values, oldObj: props.contactObj}).then(async response => {
                let resBody = await response.json();
                if (resBody) {
                    populateFormObj(resBody, contactForm);
                    message.success("Contact Data successfully updated", 0.6);
                }
            }).catch(reason => {
                console.log(reason);
            });
        } else {
            console.log(props.contactObj)
            addNewContact({...values.formObj, id: props.contactObj.id + 1}).then(async response => {
                let resBody = await response.json();
                if (resBody) {
                    populateFormObj(resBody, contactForm);
                    message.success("New Contact successfully created", 0.6);
                }
            }).catch(reason => {
                console.log(reason);
                message.error("Unable to create new contact", 0.6);
            });
        }
    };

    const [customFieldsDS, setCustomFieldsDS] = useState<CustomFields[]>([
        {
            key: 'anniversary',
            fieldName: 'Anniversary',
            fieldType: 'text'
        },
        {
            key: 'alternateEmail',
            fieldName: 'Alternate Email',
            fieldType: 'email'
        },
        {
            key: 'alternateNumber',
            fieldName: 'Alternate Number',
            fieldType: 'number'
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
                        <FormEditPage key={props.contactObj ? props.contactObj.key : Math.random()}
                                      generalForm={contactForm} saveFormValues={modifyContactService}/>
                    </TabPane>
                    <TabPane style={{width: 408}} tab="Custom Fields" key="2">
                        <Form form={customFieldForm} layout={'vertical'} onFinish={modifyContactService}>
                            {customFieldsDS.map(mapItr => {
                                return <Form.Item key={mapItr.key} label={mapItr.fieldName}
                                                  name={['formObj', mapItr.key]}>
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