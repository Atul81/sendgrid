import React from "react";
import {Modal} from "antd";

export const TemplateIeFrame: any = (props: any) => {
    return <Modal className={'fullScreenModal'} visible={true} width={'100%'} footer={null}
                  onCancel={props.exitTemplateEdit}>
        <iframe id={'ieFrame'} style={{width: '100%', height: 'calc(100vh - 72px)', marginTop: 24}}
                title={"Template IeFrame"} src={props.ieFrameSrc}/>
    </Modal>


}