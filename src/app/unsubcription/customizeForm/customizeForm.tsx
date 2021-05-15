import React, {useEffect, useState} from "react";
import './customizeForm.scss';
import {Button, Collapse, message, Upload} from "antd";
import {CheckCircleOutlined, UndoOutlined, UploadOutlined} from '@ant-design/icons';
import Title from "antd/lib/typography/Title";
import {AccordionHeaderInterface} from "../unsubcriptionInterface";
import {getAllServerCall} from "../../../service/serverCalls/mockServerRest";
import {SketchPicker} from 'react-color'
import {UploadFile} from "antd/lib/upload/interface";

export const CustomizeFormPage = () => {

    const [fileList, setFileList] = useState<UploadFile[]>([]);
    const [imageUrl, setImageUrl] = useState('');
    const getBase64 = (img: any, callback: any) => {
        const reader = new FileReader();
        reader.addEventListener('load', () => callback(reader.result));
        reader.readAsDataURL(img);
    }

    const beforeUpload = (file: any) => {
        const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
        if (!isJpgOrPng) {
            message.error('You can only upload JPG/PNG file!').then(() => {
            });
        }
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
            message.error('Image must smaller than 2MB!').then(() => {
            });
        }
        return isJpgOrPng && isLt2M;
    };

    const handleChange = (info: any) => {
        if (info.file.status === 'done') {
            message.success(`${info.file.name} file uploaded successfully`, 0.7).then(() => {
            });
            getBase64(info.file.originFileObj, (imageUrlCB: any) => {
                setImageUrl(imageUrlCB);
            });
        } else if (info.file.status === 'error') {
            message.error(`${info.file.name} file upload failed.`).then(() => {
            });
        }
        let fileList = [...info.fileList];
        setFileList(fileList);
        console.log(fileList);
    }

    const cancelAllChanges = () => {
        setPickColor('#fff');
        setColor('');
        setFileList([]);
    };

    const saveAllChangesService = () => {

    };

    const {Panel} = Collapse;
    const [accordionHeader, setAccordionHeader] = useState<AccordionHeaderInterface[]>([]);
    const [color, setColor] = useState('');
    const [pickColor, setPickColor] = useState('#fff')

    const accordion1ColorChange = (color: any, event: any) => {
        setColor(color);
        setPickColor(color.hex);
    }

    const [displayColorPicker, setDisplayColorPicker] = useState(false);

    const handleClick = () => {
        setDisplayColorPicker(!displayColorPicker);

    };

    const handleClose = () => {
        setDisplayColorPicker(false);
    };

    const getAccordionText = (headerKey: string) => {
        switch (headerKey) {
            case "1":
                return (
                    <div>
                        <div className='flexEqualSpacing' style={{justifyContent: 'start'}}>
                            {pickColor !== '#fff' ? <div className='pickedColor'
                                                         style={{background: pickColor, marginRight: '2%'}}/> : null}
                            <div className='swatch' onClick={handleClick}> Pick Color</div>
                        </div>
                        {displayColorPicker ?
                            <div style={{
                                position: 'absolute',
                                zIndex: 2
                            }}>
                                <div style={{
                                    position: 'fixed',
                                    top: '0px',
                                    right: '0px',
                                    bottom: '0px',
                                    left: '0px'
                                }} onClick={handleClose}/>
                                <SketchPicker color={color} onChange={accordion1ColorChange}/>
                            </div> : null}
                    </div>
                )
            default:
                // throw new Error(`${headerKey} not found, hence cannot populate accordion value`);
                return 'Work In Progress, pending design'
        }
    };

    useEffect(() => {
        getAllServerCall('utils').then(async allAccordionHeaderAsync => {
            let allAccordionHeaderRes = await allAccordionHeaderAsync.json();
            let tempItrObj: AccordionHeaderInterface[] = [];
            if (allAccordionHeaderRes && allAccordionHeaderRes.accordionHeader) {
                allAccordionHeaderRes.accordionHeader.forEach((itr: any) => {
                    tempItrObj.push({...itr, key: itr.id});
                });
                setAccordionHeader(tempItrObj);
            }
        });
    }, [])

    return (
        <>
            <div className='pageLayout' style={{height: 40}}>
                <div className="firstNav">
                    <div className="leftPlacement">
                        <Title level={4}>Customize Forms</Title>
                    </div>
                    <div className="rightPlacement">
                        <Button key="cancel" style={{marginRight: 8, width: 75}}
                                onClick={cancelAllChanges}
                                icon={<UndoOutlined/>}>Cancel</Button>
                        <Button key="saveChanges" style={{marginRight: 8, width: 115}} type={'primary'}
                                onClick={saveAllChangesService}
                                icon={<CheckCircleOutlined/>}>Save Changes</Button>
                    </div>
                </div>
            </div>
            <div className='customizeForm'>
                <div className='uploadSection columnFlex'>
                    <div style={{marginBottom: 24}}>
                        <Title level={5}>Customize Logo</Title>
                    </div>
                    <div>
                        <Upload
                            name="avatar"
                            listType="picture"
                            className="avatar-uploader"
                            showUploadList={true}
                            action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                            beforeUpload={beforeUpload}
                            onChange={handleChange}
                            maxCount={1} fileList={fileList}
                        >
                            {imageUrl ? <img src={imageUrl} alt="avatar" style={{width: '100%'}}/> :
                                <Button className='uploadBtn' icon={<UploadOutlined/>}>Click to Upload</Button>}
                        </Upload>
                    </div>
                </div>
                <div className='accordionSection columnFlex'>
                    <div style={{marginBottom: 24}}>
                        <Title level={5}>Customize CSS and colors</Title>
                    </div>
                    <div>
                        <Collapse accordion>
                            {accordionHeader.map((accValue) => {
                                return <Panel header={accValue.name} key={accValue.key}>
                                    <p>{getAccordionText(accValue.key)}</p>
                                </Panel>
                            })}
                        </Collapse>
                    </div>
                </div>
            </div>
        </>
    )
}