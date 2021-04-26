import React, {useEffect, useState} from "react";
import './editContact.scss';
import {updateBreadcrumb} from "../../../../store/actions/root";
import {useDispatch} from "react-redux";
import {Button, Form, message, Modal, Popconfirm, Select, Space, Table, Tabs} from "antd";
import Title from "antd/lib/typography/Title";
import {DeleteOutlined, PlusOutlined, StepBackwardOutlined} from '@ant-design/icons';
import {AddSegment} from "../../contactInterface";
import {FormEditPage} from "../../../common/formEdit/formEdit";
import {filterSelectOptions, populateFormObj} from "../../../../utils/common";

export const EditContactPage: any = (props: any) => {
    const dispatch = useDispatch();
    const {TabPane} = Tabs;
    const [contactForm] = Form.useForm();
    const {Option} = Select;

    useEffect(() => {
        dispatch(updateBreadcrumb(['Audience', 'Contacts', 'Edit Contact']));
        populateFormObj(props.contactObj, contactForm);
    }, [dispatch, contactForm, props.contactObj]);



    const [allSegments, setAllSegments] = useState<AddSegment[]>(
        [{
            key: 'xennials',
            segment: 'The Xennials'
        }, {
            key: 'lg',
            segment: 'LG Curve'
        }, {
            key: 'samsung',
            segment: 'Samsung Curve'
        }]);

    const [assignedSegments, setAssignedSegments] = useState<AddSegment[]>(
        [{
            key: '1',
            segment: 'The Xennials'
        }]);
    const [segmentSelected, setSegmentSelected] = useState<AddSegment>({
        key: '',
        segment: ''
    });
    const assignedSegCol = [
        {
            title: 'Segment',
            dataIndex: 'segment',
            key: 'segment',
        },
        {
            title: 'Action',
            dataIndex: '',
            key: 'action',
            width: '75px',
            render: ((text: string, record: any) => {
                return <Space size="small">
                    <Popconfirm overlayClassName="ant-popover-audience" placement="left"
                                title={<p><Title level={5}>Are you sure you want to delete?</Title>
                                    This will permanently delete these records and all associated data from your
                                    account. Deleting and re-adding records can alter your monthly contact limits. <a
                                        href={"https://www.google.com"} target={'_blank'} rel={'noreferrer'}>Learn
                                        More</a></p>}
                                okText="Delete" cancelText="Cancel"
                                onConfirm={() => deleteContact(record)}>
                        <p className={"actionColumn"}>
                            <DeleteOutlined/>
                        </p>
                    </Popconfirm>
                </Space>
            }),
        },
    ];

    const deleteContact = (record: any) => {
        console.log(record);
    };

    const [addSegModal, setAddSegModal] = useState(false);

    const addContactToSegment = () => {
        if (segmentSelected.segment.length <= 0) {
            message.error('Please select Segment from dropdown');
        } else {
            let tempObj = [...assignedSegments];
            tempObj.push(segmentSelected);
            setAssignedSegments(tempObj);
        }
        setAddSegModal(false);
        setSegmentSelected({key: '', segment: ''});
    };

    const newSegmentSelectChange = (option: any) => {
        setSegmentSelected({key: option.key, segment: option.children});
    };

    const cancelNewSegmentAddition = () => {
        setAddSegModal(false);
        setSegmentSelected({key: '', segment: ''});
    };

    const modifyContactService = (values: any) => {
        console.log(values);
    };

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
                    <TabPane tab="Custom Fields" key="2">
                        Content of Tab Pane 2
                    </TabPane>
                    <TabPane tab="Segment" key="3">
                        <div className="addSegBtnCon">
                            <Button style={{width: 135}} type='primary' onClick={() => setAddSegModal(true)}
                                    icon={<PlusOutlined/>}>Add to Segment</Button>
                            <Modal title="Add contact to segment" centered visible={addSegModal} width={400} footer={[
                                <Button key="cancel" onClick={cancelNewSegmentAddition}>
                                    Cancel
                                </Button>,
                                <Button key="add" type="primary" onClick={addContactToSegment}>
                                    Add
                                </Button>
                            ]} onCancel={cancelNewSegmentAddition}>
                                <Title level={5}>Select Segment</Title>
                                <Select style={{width: 360}} showSearch
                                        value={segmentSelected.segment.length === 0 ? undefined : segmentSelected.segment}
                                        placeholder="Select Segments"
                                        optionFilterProp="children"
                                        filterOption={(input, option) => filterSelectOptions(input, option)}
                                        onChange={(value, option) => newSegmentSelectChange(option)}>
                                    {allSegments.map(value => {
                                        return <Option key={value.key} value={value.key}>{value.segment}</Option>
                                    })}
                                </Select>
                            </Modal>
                        </div>
                        <Table dataSource={assignedSegments} columns={assignedSegCol} bordered/>
                    </TabPane>
                </Tabs>
            </div>
        </div>
    );
}