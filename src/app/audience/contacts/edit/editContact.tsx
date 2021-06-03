import React, {useEffect, useState} from "react";
import '../contacts.scss';
import {updateBreadcrumb} from "../../../../store/actions/root";
import {useDispatch} from "react-redux";
import {Button, Form, Input, message, Tabs} from "antd";
import Title from "antd/lib/typography/Title";
import {StepBackwardOutlined} from '@ant-design/icons';
import {FormEditPage} from "../../../common/formEdit/formEdit";
import {populateFormObj} from "../../../../utils/common";
import {CustomFields} from "../../audienceInterface";
import {addNewObject, editObjectById, getAllServerCall} from "../../../../service/serverCalls/mockServerRest";

export const EditContactPage: any = (props: any) => {
    const dispatch = useDispatch();
    const {TabPane} = Tabs;
    const [contactForm] = Form.useForm();
    const [customFieldForm] = Form.useForm();

    useEffect(() => {
        dispatch(updateBreadcrumb(['Audience', 'Contacts', 'edit-contact']));
        populateFormObj(props.contactObj, contactForm);
        getAllServerCall('customFields').then(async response => {
            let resBody = await response.json();
            let data: CustomFields[] = [];
            if (resBody && Array.isArray(resBody)) {
                resBody.forEach((itr: any) => {
                    data.push({...itr, key: itr.id});
                });
            }
            setCustomFieldsDS(data);
        });
    }, [dispatch, contactForm, props.contactObj]);

    const getCommaSeparatedValue = (listValue: any, commSeparated: string) => {
        if (listValue && Array.isArray(listValue) && listValue.length > 0) {
            listValue.forEach((info: any) => {
                commSeparated = commSeparated.concat(info).concat(', ');
            });
            commSeparated = commSeparated.substr(0, commSeparated.length - 2);
        }
        return commSeparated;
    }

    const modifyContactService = (values: any) => {
        let tagsInfo = '';
        let segmentsInfo = ''
        tagsInfo = getCommaSeparatedValue(values.formObj.tags, tagsInfo);
        segmentsInfo = getCommaSeparatedValue(values.formObj.segments, segmentsInfo);
        if (props.contactObj.firstName) {
            editObjectById({
                ...values.formObj,
                tags: tagsInfo,
                segments: segmentsInfo,
                oldObj: props.contactObj
            }, 'contacts').then(async response => {
                let resBody = await response.json();
                if (resBody) {
                    populateFormObj(resBody, contactForm);
                    message.success("Contact Data successfully updated", 0.6);
                }
            }).catch(reason => {
                console.log(reason);
            });
        } else {
            addNewObject({
                ...values.formObj,
                tags: tagsInfo,
                segments: segmentsInfo,
                id: props.contactObj.id + 1
            }, 'contacts').then(async response => {
                let resBody = await response.json();
                if (resBody) {
                    populateFormObj(resBody, contactForm);
                    message.success("New Contact successfully created", 0.6);
                }
            }).catch(reason => {
                console.log(reason);
                message.error("Unable to create new contact", 0.6).then(() => {
                });
            });
        }
    };

    const [customFieldsDS, setCustomFieldsDS] = useState<CustomFields[]>([]);

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
                        <FormEditPage key={props.contactObj ? props.contactObj.key : Math.random()} type={'contacts'}
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
