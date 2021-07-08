import React, {useEffect, useState} from "react";
import './customizeForm.scss';
import {Button, Collapse, message, Select, Upload} from "antd";
import {CheckCircleOutlined, UndoOutlined, UploadOutlined} from '@ant-design/icons';
import Title from "antd/lib/typography/Title";
import {AccordionHeaderInterface} from "../unsubcriptionInterface";
import {editObjectById, getAllServerCall} from "../../../service/serverCalls/mockServerRest";
import {SketchPicker} from 'react-color'
import {UploadFile} from "antd/lib/upload/interface";
import {GET_SERVER_ERROR, PUT_SERVER_ERROR} from "../../../utils/common";
import {DropDown} from "../../../utils/Interfaces";

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
        } else {
            setImageUrl('');
        }
        let fileList = [...info.fileList];
        setFileList(fileList);
    }

    const cancelAllChanges = () => {
        setUnsubscriptionData({...unsubscriptionData, backGroundColor: '#fff'});
        setColor('');
        setFileList([]);
    };

    const saveAllChangesService = () => {
        if (imageUrl.length === 0) {
            message.warn("No Image Content provide, using default one", 0.7).then(() => {
            });
        }
        editObjectById({
            id: 1,
            url: imageUrl.length > 0 ? imageUrl : 'https://is2-ssl.mzstatic.com/image/thumb/Purple123/v4/be/a1/be/bea1bef3-c6da-b823-0f9e-fb6ac60f461b/source/200x200bb.jpg',
            ...unsubscriptionData
        }, 'customizeForm').then(async setUnsubscriptionAsync => {
            let unSubscriptionRes = await setUnsubscriptionAsync.json();
            if (unSubscriptionRes) {
                message.success("Your preference has been recorded, redirecting to unsubscription page", 1).then(() => {
                    window.open("http://localhost:4200/1")
                });
            }
        }).catch(reason => {
            console.log(reason);
            message.error(PUT_SERVER_ERROR, 0.8).then(() => {
            });
        });
    };

    const {Panel} = Collapse;
    const {Option} = Select;

    const [accordionHeader, setAccordionHeader] = useState<AccordionHeaderInterface[]>([]);
    const [color, setColor] = useState('');

    const accordion1ColorChange = (color: any, _: any) => {
        setColor(color);
        setUnsubscriptionData({...unsubscriptionData, backGroundColor: color.hex});
    };

    const accordion2ColorChange = (color: any, _: any) => {
        setColor(color);
        setUnsubscriptionData({...unsubscriptionData, banner: color.hex});
    };

    const [displayColorPicker, setDisplayColorPicker] = useState(false);
    const [tableColorPicker, setTableColorPicker] = useState(false);

    const handleAccordionOneClick = () => {
        setDisplayColorPicker(!displayColorPicker);
    };

    const handleAccordionTwoClick = () => {
        setTableColorPicker(!tableColorPicker);
    };
    const handleClose = () => {
        setDisplayColorPicker(false);
        setTableColorPicker(false);
    };

    const [unsubscriptionData, setUnsubscriptionData] = useState({
        backGroundColor: '#fff',
        banner: '#fff',
        testDesc: ''
    });

    const availableFonts: DropDown[] = [
        {value: '1', label: 'Arial', children: null},
        {value: '2', label: 'Verdana', children: null},
        {value: '3', label: 'Brush Script MT', children: null},
        {value: '4', label: 'Courier New', children: null},
        {value: '5', label: 'Trebuchet MS', children: null},
        {value: '6', label: 'Times New Roman', children: null},
        {value: '7', label: 'Georgia', children: null},
        {value: '8', label: 'Garamond', children: null},
        {value: '9', label: 'Courier New', children: null}
    ];

    const changeAccordion = (curAcc: any) => {
        console.log(`Active accordion ${curAcc}`);
        setColor('');
        setUnsubscriptionData({...unsubscriptionData, backGroundColor: '#fff'});
    };

    const getAccordionText = (headerKey: string) => {
        switch (headerKey) {
            case "1":
                return (
                    <div>
                        <div className='flexEqualSpacing' style={{justifyContent: 'start'}}>
                            {unsubscriptionData.backGroundColor !== '#fff' ?
                                <div className='pickedColor'
                                     style={{
                                         background: unsubscriptionData.backGroundColor,
                                         marginRight: '2%'
                                     }}/> : null}
                            <div className='swatch' onClick={handleAccordionOneClick}> Pick Color</div>
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
            case "3":
                return (
                    <div>
                        <div className='flexEqualSpacing' style={{justifyContent: 'start'}}>
                            {unsubscriptionData.banner !== '#fff' ?
                                <div className='pickedColor'
                                     style={{background: unsubscriptionData.banner, marginRight: '2%'}}/> : null}
                            <div className='swatch' onClick={handleAccordionTwoClick}> Pick Color</div>
                        </div>
                        {tableColorPicker ?
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
                                <SketchPicker color={color} onChange={accordion2ColorChange}/>
                            </div> : null}
                    </div>
                )
            case "4":
                return (
                    <div>
                        <Select showSearch placeholder="Select Font family"
                                onChange={(value: string) => setUnsubscriptionData({
                                    ...unsubscriptionData,
                                    testDesc: value
                                })} allowClear={true}>
                            {availableFonts.map(value => {
                                return <Option value={value.label} key={value.value}>{value.label}</Option>
                            })}
                        </Select>
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
        }).catch(reason => {
            console.log(reason);
            message.error(GET_SERVER_ERROR, 0.8).then(() => {
            });
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
                        <Collapse accordion onChange={changeAccordion}>
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
