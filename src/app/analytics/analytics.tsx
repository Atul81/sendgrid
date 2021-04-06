import React from "react";
import {useSelector} from "react-redux";

export const AnalyticsPage: any = () => {
    const rootState = useSelector((state: any) => state.root.activeContent);
    return <div>
        <iframe title={"Analytics Dashboard"}
                style={{margin: -24, height: 'calc(100vh - 128px)', width: 'calc(100vw - 232px)'}}
                src={rootState === 'statistics' ? "https://ant.design/components/table/#header" : 'https://pro.ant.design/'}/>
    </div>
}