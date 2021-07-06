import React, {useState} from "react";
import {Button, message, Modal, Select} from "antd";
import {MailFilled} from "@ant-design/icons";
import './amendAutomation.scss';
import Paragraph from "antd/es/typography/Paragraph";
import {SelectValue} from "antd/es/select";
import {SendEmail} from "./sendEmail";
import {Wait} from "./wait";
import {YesNoSplit} from "./yesNoSplit";
import {MultiVariateSplit} from "./multiVariateSplit";

export const ActivityModal = (props: any) => {

    const [showSelect, setShowSelect] = useState(props.activitySelection);
    const handleCancel = () => {
        props.closeModal();
    };

    const [selectedValue, setSelectedValue] = useState<SelectValue>(undefined);
    const [selectedTitle, setSelectedTitle] = useState<string>('');
    const {Option} = Select;

    const onSelectChange = (value: any, option: any) => {
        setSelectedValue(value);
        setSelectedTitle(option.label);
    };

    const onSelectDone = () => {
        setShowSelect(false);
    };

    const getCardContent = (content: any, nodeType: string, nodeTitle: string) => {
        props.createNode(content, nodeType, nodeTitle);
        handleCancel();
    };

    const switchActivityModal = () => {
        switch (selectedValue) {
            case 'sendEmail' :
                return <SendEmail createCard={getCardContent}/>;
            case 'wait':
                return <Wait createCard={getCardContent}/>;
            case 'yesNoSplit':
                return <YesNoSplit createCard={getCardContent}/>;
            case 'multiVariateSplit':
                return <MultiVariateSplit createCard={getCardContent}/>;
            default:
                message.error('No Implementation for selected type', 0.7).then((onF) => console.log(onF));
        }
    };

    // Add svg image in the title
    return <Modal wrapClassName='activitySelection' width={showSelect ? 600 : 750}
                  title={showSelect ? 'Add Activity' : selectedTitle}
                  visible={props.openModal}
                  onCancel={handleCancel} destroyOnClose={true} footer={null} centered>
        {showSelect ?
            <div className='selectDiv'>
                <Select dropdownClassName='antSelect' style={{width: '84%'}} placeholder="select one activity"
                        allowClear onChange={onSelectChange} optionLabelProp="label">
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
                                    example you can send all participants who read an email down one path, and everyone
                                    else
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
                </Select>
                <Button type={'primary'} onClick={onSelectDone}>Done</Button>
            </div> : switchActivityModal()
        }
    </Modal>
}
