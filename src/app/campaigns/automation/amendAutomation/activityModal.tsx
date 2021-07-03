import React, {useState} from "react";
import {Modal, Select} from "antd";
import {MailFilled} from "@ant-design/icons";
import './amendAutomation.scss';
import Paragraph from "antd/es/typography/Paragraph";

export const ActivityModal = (props: any) => {

    const [showSelect, setShowSelect] = useState(props.activitySelection);
    const handleCancel = () => {
        props.closeModal();
    };

    const {Option} = Select;

    const handleChange = (value: string) => {
        console.log(`selected ${value}`);
    }
    return <Modal wrapClassName='activitySelection' width={showSelect ? 500 : 750} title={'Add Activity'}
                  visible={props.openModal}
                  onCancel={handleCancel} destroyOnClose={true} footer={null} centered>
        {showSelect ?
            <Select dropdownClassName='antSelect' style={{width: '100%'}} placeholder="select one activity" onChange={handleChange} optionLabelProp="label">
                <Option value="sendEmail" label="Send an Email">
                    <div className="selectionBox">
                        <MailFilled/>
                        <div className='text'>
                            <Paragraph strong>Send an Email</Paragraph>
                            <Paragraph>Sends an email message.</Paragraph>
                        </div>
                    </div>
                </Option>
                <Option value="sendPushNotification" label="Send a push notification">
                    <div className="selectionBox">
                        <MailFilled/>
                        <div className='text'>
                            <Paragraph strong>Send a push notification</Paragraph>
                            <Paragraph>Sends a push notification to the recipient's mobile device.</Paragraph>
                        </div>
                    </div>
                </Option>
                <Option value="sendMessage" label="Send a SMS message">
                    <div className="selectionBox">
                        <MailFilled/>
                        <div className='text'>
                            <Paragraph strong>Send a SMS message</Paragraph>
                            <Paragraph>Sends a SMS(text) message.</Paragraph>
                        </div>
                    </div>
                </Option>
                <Option value="sendCustomChannel" label="Send through a custom channel">
                    <div className="selectionBox">
                        <MailFilled/>
                        <div className='text'>
                            <Paragraph strong>Send through a custom channel</Paragraph>
                            <Paragraph>Use a Lambda function or web address to send a message using a custom
                                channel.</Paragraph>
                        </div>
                    </div>
                </Option>
                <Option value="wait" label="Wait">
                    <div className="selectionBox">
                        <MailFilled/>
                        <div className='text'>
                            <Paragraph strong>Wait</Paragraph>
                            <Paragraph>Waits for a certain amount of time, or until a specific date, before sending
                                participants to the next activity.</Paragraph>
                        </div>
                    </div>
                </Option>
                <Option value="yesNoSplit" label="Yes/No Split">
                    <div className="selectionBox">
                        <MailFilled/>
                        <div className='text'>
                            <Paragraph strong>Yes/No Split</Paragraph>
                            <Paragraph>Sends participants down one of two paths based on certain criteria. For
                                example you can send all participants who read an email down one path, and everyone else
                                down the other path.</Paragraph>
                        </div>
                    </div>
                </Option>
                <Option value="multiVariateSplit" label="Multivariate Split">
                    <div className="selectionBox">
                        <MailFilled/>
                        <div className='text'>
                            <Paragraph strong>Multivariate Split</Paragraph>
                            <Paragraph>Sends participants down one of up to four paths, based on certain criteria.
                                Participants who don't meet any criteria are sent sown an "Else" path.</Paragraph>
                        </div>
                    </div>
                </Option>
                <Option value="holdOut" label="Holdout">
                    <div className="selectionBox">
                        <MailFilled/>
                        <div className='text'>
                            <Paragraph strong>Holdout</Paragraph>
                            <Paragraph>Ends the journey for a specified number of participants.</Paragraph>
                        </div>
                    </div>
                </Option>
                <Option value="randomSplit" label="Random Split">
                    <div className="selectionBox">
                        <MailFilled/>
                        <div className='text'>
                            <Paragraph strong>Random Split</Paragraph>
                            <Paragraph>Randomly sends participants down one of five paths.</Paragraph>
                        </div>
                    </div>
                </Option>
            </Select> : null}
    </Modal>
}