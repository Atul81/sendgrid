import React from "react";

export const TemplateIeFrame: any = (props: any) => {


    return (
        <iframe id={'ieFrame'} title={"Analytics Dashboard"}
                style={{margin: -24, height: 'calc(100vh - 128px)', width: 'calc(100vw - 232px)'}}
                src={props.ieFrameSrc}/>
    )
}