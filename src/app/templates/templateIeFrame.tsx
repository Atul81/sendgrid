import React, {useCallback, useEffect} from "react";

export const TemplateIeFrame: any = (props: any) => {

    const escFunction = useCallback((event) => {
        if (event.keyCode === 27) {
            props.exitTemplateEdit();
        }
        event.stopImmediatePropagation();
    }, [props]);

    useEffect(() => {
        // if (document && document.getElementById('ieFrame')) {
        //     let elem = document.getElementById('ieFrame');
        //     if (null !== elem && elem.requestFullscreen) {
        //         elem.requestFullscreen();
        //     }
        // }
        document.addEventListener("keydown", escFunction, false);

    }, [escFunction]);

    return (
        <iframe id={'ieFrame'} title={"Analytics Dashboard"}
                style={{margin: -24, height: 'calc(100vh - 128px)', width: 'calc(100vw - 232px)'}}
                src={props.ieFrameSrc}/>
    )
}