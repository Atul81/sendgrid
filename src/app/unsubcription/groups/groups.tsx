import React, {useEffect, useState} from "react";
import {Button, Form, Input, Modal, Popconfirm, Space, Switch, Table} from "antd";
import {CloseOutlined, DeleteOutlined, EditOutlined, PlusOutlined} from "@ant-design/icons";
import Title from "antd/es/typography/Title";
import {GroupNameInterface} from "../unsubcriptionInterface";
import Paragraph from "antd/es/typography/Paragraph";
import {useLocation} from "react-router-dom";

export const GroupsPage: any = () => {
    const [groupNameDS, setGroupNameDS] = useState<GroupNameInterface[]>([]);
    const [selectedGroups, setSelectedGroups] = useState<string[]>([]);
    const urlPath = useLocation();
    const [openCustomizeForm, setCustomizeFormFrame] = useState(false);

    const contactRowSelection = {
        onChange: (selectedRowKeys: React.Key[], selectedRows: GroupNameInterface[]) => {
            let rowsSelected: string[] = [];
            selectedRows.forEach(contactsData => {
                rowsSelected.push(contactsData.key);
            });
            setSelectedGroups(rowsSelected);
        }
    };
    useEffect(() => {
        let urlRoute = urlPath.pathname.split("/");
        setCustomizeFormFrame(false);

        if (urlRoute[2] && urlRoute[2] === 'customize-form') {
            setCustomizeFormFrame(true);
        } else {
            let data: GroupNameInterface[] = [];
            for (let i = 0; i < 100; i++) {
                data.push({
                    key: i.toString(10),
                    groupName: `email+test@gmail.com ${i} Unsubscribe`,
                    groupDesc: `${i} Unsubscribe`,
                    globalDisplay: true
                });
            }
            setGroupNameDS(data);
        }
    }, [urlPath.pathname]);

    const openGroupNameEdit = (record: any) => {
        console.log(record);
        unsubscribeForm.setFieldsValue({
            formObj: {
                groupName: record.groupName,
                groupDesc: record.groupDesc,
                globalDisplay: record.globalDisplay
            }
        });
        setSwitchCheck(record.globalDisplay);
        setAmendGroupModal(true);
    };

    const deleteGroupName = (record: any) => {
        console.log(record);
    }
    const columns = [
        {
            title: 'Group Name',
            dataIndex: 'groupName',
            key: 'groupName',
        },
        {
            title: 'Action',
            dataIndex: '',
            key: 'action',
            width: '75px',
            render: ((text: string, record: any) => {
                return <Space size="small">
                    <p className={"actionColumn"} onClick={() => openGroupNameEdit(record)}><EditOutlined/></p>
                    <Popconfirm overlayClassName="ant-popover-audience" placement="left"
                                title={<p><Title level={5}>Are you sure you want to delete?</Title>
                                    This will permanently delete these records and all associated data from your
                                    account. Deleting and re-adding records can alter your monthly contact limits. <a>Learn
                                        More</a></p>}
                                okText="Delete" cancelText="Cancel"
                                onConfirm={() => deleteGroupName(record)}>
                        <p className={"actionColumn"}><DeleteOutlined/></p>
                    </Popconfirm>
                </Space>
            }),
        }
    ];

    const [amendGroupModal, setAmendGroupModal] = useState(false);
    const [switchCheck, setSwitchCheck] = useState(false);
    const [unsubscribeForm] = Form.useForm();
    const {TextArea} = Input;

    const cancelUnsubscribeAmend = () => {
        setAmendGroupModal(false);
        unsubscribeForm.resetFields();
        setSwitchCheck(false);
    };

    const amendGroupService = (values: any) => {
        console.log(values, switchCheck);
    };

    return !openCustomizeForm ? (<div className={'pageLayout'}>
        <div className="reverseFlex">
            <Button style={{marginRight: 8}} key="addGroup" type="primary" onClick={() => setAmendGroupModal(true)}
                    icon={<PlusOutlined/>}>
                Add New
            </Button>
            {selectedGroups.length > 0 ?
                <Button style={{marginRight: 8}} key="delGroup" type="primary" danger icon={<DeleteOutlined/>}>
                    Delete
                </Button> : null}
        </div>
        <Modal title="Add Unsubscribe Group" centered visible={amendGroupModal} width={500} footer={null}
               closable={false}
               onCancel={cancelUnsubscribeAmend}>
            <div className='columnFlex'>
                <Form form={unsubscribeForm} layout={'vertical'} onFinish={amendGroupService}>
                    <Form.Item label="Group Name" required>
                        <Form.Item name={['formObj', 'groupName']}
                                   noStyle rules={[{required: true, message: 'Email Address required'}]}>
                            <Input placeholder="Text Only" type={"text"}/>
                        </Form.Item>
                    </Form.Item>
                    <Form.Item label="Group Description">
                        <Form.Item name={['formObj', 'groupDesc']} noStyle>
                            <TextArea placeholder="Text Only"/>
                        </Form.Item>
                    </Form.Item>
                    <Form.Item label={null}>
                        <Form.Item name={['formObj', 'globalDisplay']} noStyle>
                            <div className={'flexEqualSpacing'}>
                                <Switch checked={switchCheck}/>
                                <Paragraph>Display this group in global subscription preferences</Paragraph></div>
                        </Form.Item>
                    </Form.Item>
                    <div className='reverseFlex'>
                        <Form.Item>
                            <Button key="cancel" htmlType={'reset'} onClick={cancelUnsubscribeAmend}
                                    icon={<CloseOutlined/>}>
                                Cancel
                            </Button>
                        </Form.Item>
                        <Form.Item>
                            <Button style={{marginRight: 8}} key="quickAdd" htmlType={'submit'} type="primary"
                                    icon={<PlusOutlined/>}>
                                Add
                            </Button>
                        </Form.Item>
                    </div>
                </Form>
            </div>
        </Modal>
        <div className="thirdNav" style={{height: 'calc(100vh - 222px)'}}>
            <Table scroll={{y: 'calc(100vh - 320px)'}} rowSelection={{...contactRowSelection}} dataSource={groupNameDS}
                   columns={columns} bordered/>
        </div>
    </div>) : <iframe title={"Analytics Dashboard"}
                      style={{margin: -24, height: 'calc(100vh - 128px)', width: 'calc(100vw - 232px)'}}
                      src={'https://programmablesearchengine.google.com/about/'}/>
}