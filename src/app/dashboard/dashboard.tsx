import React from "react";
import {useSelector} from "react-redux";

export const DashboardPage: any = () => {

    const collapsed = useSelector((state: any) => state.root.collapsed);

    return <iframe title={"Analytics Dashboard"}
                   style={collapsed ? {
                       margin: -24,
                       height: 'calc(100vh - 128px)',
                       width: 'calc(100vw - 96px)'
                   } : {margin: -24, height: 'calc(100vh - 128px)', width: 'calc(100vw - 256px)'}}
                   src={'https://programmablesearchengine.google.com/about/'}/>
}
