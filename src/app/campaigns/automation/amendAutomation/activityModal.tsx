import React, {useEffect, useState} from "react";
import {Button, message, Modal, Select} from "antd";
import './amendAutomation.scss';
import Paragraph from "antd/es/typography/Paragraph";
import {SelectValue} from "antd/es/select";
import {SendEmail} from "./activity/sendEmail";
import {Wait} from "./activity/wait";
import {YesNoSplit} from "./activity/yesNoSplit";
import {MultiVariateSplit} from "./activity/multiVariateSplit";
import {HoldOut} from "./activity/holdOut";
import {RandomSplit} from "./activity/randomSplit";

export const ActivityModal = (props: any) => {

    const [showSelect, setShowSelect] = useState(true);
    const handleCancel = () => {
        props.closeModal();
    };

    useEffect(() => {
        if (props.selectedCardType) {
            setShowSelect(false);
        }
    }, [props.selectedCardType])
    const [selectedValue, setSelectedValue] = useState<SelectValue>(props.selectedCardType || undefined);
    const [selectedTitle, setSelectedTitle] = useState<string>(props.modalData.nodeTitle || undefined);
    const {Option} = Select;

    const onSelectChange = (value: any, option: any) => {
        setSelectedValue(value);
        setSelectedTitle(option.label);
    };

    const onSelectDone = () => {
        setShowSelect(false);
    };

    const getCardContent = (content: any, nodeType: string, nodeTitle: string, nodeSvg: string, branchCount: number, existingNodeId: string) => {
        props.createNode(content, nodeType, nodeTitle, nodeSvg, branchCount, existingNodeId);
        handleCancel();
    };

    const switchActivityModal = () => {
        switch (selectedValue) {
            case 'sendEmail' :
                return <SendEmail modalData={props.modalData} createCard={getCardContent}/>;
            case 'wait':
                return <Wait modalData={props.modalData} createCard={getCardContent}/>;
            case 'yesNoSplit':
                return <YesNoSplit modalData={props.modalData} createCard={getCardContent}/>;
            case 'multiVariateSplit':
                return <MultiVariateSplit modalData={props.modalData} createCard={getCardContent}/>;
            case 'holdOut':
                return <HoldOut modalData={props.modalData} createCard={getCardContent}/>;
            case 'randomSplit':
                return <RandomSplit modalData={props.modalData} createCard={getCardContent}/>;
            default:
                setSelectedValue(undefined);
                message.error('No Implementation for selected type', 0.7).then((onF) => console.log(onF));
        }
    };

    return <Modal wrapClassName='activitySelection' width={700}
                  title={showSelect ? 'Add Activity' : selectedTitle}
                  visible={props.openModal}
                  onCancel={handleCancel} destroyOnClose={true} footer={null} centered>
        {showSelect ?
            <div className='selectDiv'>
                <Select dropdownClassName='antSelect' style={{width: '84%'}} placeholder="select one activity"
                        allowClear onChange={onSelectChange} value={selectedValue} optionLabelProp="label">
                    <Option value="sendEmail" label="Send an Email">
                        <div className="selectionBox">
                            <img src={'/assets/icons/icon-send-email.svg'}
                                 alt="icon"/>
                            <div className='text'>
                                <Paragraph strong>Send an Email</Paragraph>
                                <Paragraph>Sends an email message.</Paragraph>
                            </div>
                        </div>
                    </Option>
                    <Option value="wait" label="Wait">
                        <div className="selectionBox">
                            <img src={'/assets/icons/icon-wait.svg'}
                                 alt="icon"/>
                            <div className='text'>
                                <Paragraph strong>Wait</Paragraph>
                                <Paragraph>Waits for a certain amount of time, or until a specific date, before sending
                                    participants to the next activity.</Paragraph>
                            </div>
                        </div>
                    </Option>
                    <Option value="yesNoSplit" label="Yes/No Split">
                        <div className="selectionBox">
                            <img src={'/assets/icons/icon-yes-no-split.svg'}
                                 alt="icon"/>
                            <div className='text'>
                                <Paragraph strong>Yes/No Split</Paragraph>
                                <Paragraph>Sends participants down one of two paths based on certain criteria. \n For
                                    example you can send all participants who read an email down one path, and everyone
                                    else
                                    down the other path.</Paragraph>
                            </div>
                        </div>
                    </Option>
                    <Option value="multiVariateSplit" label="Multivariate Split">
                        <div className="selectionBox">
                            <img src={'/assets/icons/icon-multivariate-split.svg'}
                                 alt="icon"/>
                            <div className='text'>
                                <Paragraph strong>Multivariate Split</Paragraph>
                                <Paragraph>Sends participants down one of up to four paths, based on certain criteria.
                                    Participants who don't meet any criteria are sent sown an "Else" path.</Paragraph>
                            </div>
                        </div>
                    </Option>
                    <Option value="holdOut" label="HoldOut">
                        <div className="selectionBox">
                            <img src={'/assets/icons/icon-holdout.svg'}
                                 alt="icon"/>
                            <div className='text'>
                                <Paragraph strong>HoldOut</Paragraph>
                                <Paragraph>Ends the journey for a specified number of participants.</Paragraph>
                            </div>
                        </div>
                    </Option>
                    <Option value="randomSplit" label="Random Split">
                        <div className="selectionBox">
                            <img src={'/assets/icons/icon-random-split.svg'}
                                 alt="icon"/>
                            <div className='text'>
                                <Paragraph strong>Random Split</Paragraph>
                                <Paragraph>Randomly sends participants down one of five paths.</Paragraph>
                            </div>
                        </div>
                    </Option>
                </Select>
                <Button type={'primary'} disabled={!selectedValue} onClick={onSelectDone}>Done</Button>
            </div> : switchActivityModal()
        }
    </Modal>
}
