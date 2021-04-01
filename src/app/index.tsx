import React, {useEffect, useState} from 'react';
import 'antd/dist/antd.css';
import './index.scss';
import {Breadcrumb, Layout, Menu} from 'antd';
import {FileOutlined, TeamOutlined, UserOutlined,} from '@ant-design/icons';
import Sider from "antd/es/layout/Sider";
import SubMenu from "antd/es/menu/SubMenu";
import {Content, Header} from "antd/es/layout/layout";
import {Link, Route, Switch, useLocation,} from "react-router-dom";
import {AnalyticsPage} from "./analytics/AnalyticsLoadable";
import Clock from 'react-live-clock';
import {ContactsPage} from "./audience/contacts/ContactsLoadable";
import {CustomFieldsPage} from "./audience/customFields/CustomFieldsLoadable";
import {SegmentsPage} from "./audience/segments/SegmentsLoadable";
import {UploadsPage} from "./audience/uploads/UploadsLoadable";
import {useDispatch, useSelector} from "react-redux";
import {updateActiveContent, updateActiveMenuContent, updateBreadcrumb} from "../store/actions/root";
import {CampaignPage} from "./campaigns/CampaignLoadable";

export function App() {
    const [collapsed, setCollapsed] = useState(false);
    const dispatch = useDispatch();
    const rootState = useSelector((state: any) => state.root);
    const urlPath = useLocation();

    useEffect(() => {
        let urlRoute = urlPath.pathname.split("/");
        if (urlRoute && urlRoute[1]) {
            dispatch(updateActiveMenuContent(urlRoute[1]));
            if (urlRoute[1] === "analytics") {
                if (urlRoute[2] && urlRoute[2] === "statistics") {
                    dispatch(updateActiveContent("1"));
                    dispatch(updateBreadcrumb(['Analytics', 'Sending Statistics']))
                } else if (urlRoute[2] && urlRoute[2] === "suppression") {
                    dispatch(updateActiveContent("2"));
                    dispatch(updateBreadcrumb(['Analytics', 'Suppression']))
                }
            } else if (urlRoute[1] === "audience") {
                if (urlRoute[2] && urlRoute[2] === "customField") {
                    dispatch(updateActiveContent("4"));
                    dispatch(updateBreadcrumb(['Audience', 'Custom Fields']))
                } else if (urlRoute[2] && urlRoute[2] === "segments") {
                    dispatch(updateActiveContent("5"));
                    dispatch(updateBreadcrumb(['Audience', 'Segments']))
                } else if (urlRoute[2] && urlRoute[2] === "uploads") {
                    dispatch(updateActiveContent("6"));
                    dispatch(updateBreadcrumb(['Audience', 'Uploads']))
                } else {
                    dispatch(updateActiveContent("3"));
                    dispatch(updateBreadcrumb(['Audience', 'Contacts']))
                }
            } else if (urlRoute[1] === "campaigns") {
                if (urlRoute[2] && urlRoute[2] === "automation") {
                    dispatch(updateActiveContent("7"));
                    dispatch(updateBreadcrumb(['Campaigns', 'Automation']))
                } else if (urlRoute[2] && urlRoute[2] === "campaigns") {
                    dispatch(updateActiveContent("8"));
                    dispatch(updateBreadcrumb(['Campaigns', 'Campaigns']))
                } else if (urlRoute[2] && urlRoute[2] === "senders") {
                    dispatch(updateActiveContent("9"));
                    dispatch(updateBreadcrumb(['Campaigns', 'Senders']))
                }
            }
        }
    }, [dispatch, urlPath.pathname]);

    const onMenuTitleClick = (activeMenuContent: string, activeContent: string) => {
        dispatch(updateActiveContent(rootState.activeMenuContent !== activeMenuContent ? activeContent : null));
        dispatch(updateActiveMenuContent(rootState.activeMenuContent !== activeMenuContent ? activeMenuContent : null))
    }
    return (
        <Layout style={{minHeight: "100vh"}}>
            <Sider collapsible collapsed={collapsed} onCollapse={() => setCollapsed(!collapsed)}>
                <div className="logo">
                    <img style={collapsed ? {marginTop: -8} : {marginTop: -68}} src={`/${"assets/images/logo.svg"}`}
                         alt="icon"/>
                </div>
                <Menu theme="dark" openKeys={[rootState.activeMenuContent]} selectedKeys={[rootState.activeContent]}
                      mode="inline">
                    <SubMenu onTitleClick={() => onMenuTitleClick("analytics", "1")} key="analytics"
                             icon={<UserOutlined/>} title="Analytics">
                        <Menu.Item key="1"><Link to={"/analytics/statistics"}>Sending Statistics</Link></Menu.Item>
                        <Menu.Item key="2"><Link to={"/analytics/suppression"}>Suppression</Link></Menu.Item>
                    </SubMenu>
                    <SubMenu onTitleClick={() => onMenuTitleClick("audience", "3")}
                             key="audience" icon={<TeamOutlined/>} title="Audience">
                        <Menu.Item key="3"><Link to={"/audience/contacts"}>Contacts</Link></Menu.Item>
                        <Menu.Item key="4"><Link to={"/audience/customField"}>Custom Fields</Link></Menu.Item>
                        <Menu.Item key="5"><Link to={"/audience/segments"}>Segments</Link></Menu.Item>
                        <Menu.Item key="6"><Link to={"/audience/uploads"}>Uploads</Link></Menu.Item>
                    </SubMenu>
                    <SubMenu onTitleClick={() => onMenuTitleClick("campaigns", "7")}
                             key="campaigns" icon={<TeamOutlined/>} title="Campaigns">
                        <Menu.Item key="7"><Link to={"/campaigns/automation"}>Automation</Link></Menu.Item>
                        <Menu.Item key="8"><Link to={"/campaigns/campaigns"}>Campaigns</Link></Menu.Item>
                        <Menu.Item key="9"><Link to={"/campaigns/senders"}>Senders</Link></Menu.Item>
                    </SubMenu>
                    <Menu.Item key="15" icon={<FileOutlined/>}>
                        Settings
                    </Menu.Item>
                </Menu>
            </Sider>
            <Layout className="site-layout">
                <Header className="header">
                    <Menu theme="dark" mode="horizontal" selectable={false}>
                        <Menu.Item key="1"><Clock format={'h:mm:ss a'} ticking={true}
                                                  timezone={'Asia/Kolkata'}/></Menu.Item>
                        <SubMenu key="user" icon={<UserOutlined/>} title="Atul Pandey">
                            <Menu.Item key="1">Log Out</Menu.Item>
                            <Menu.Item key="2"><a href={"https://www.gmail.com"} target={"_blank"}>Change Password</a></Menu.Item>
                        </SubMenu>
                    </Menu>
                </Header>
                <Content style={{margin: "0 16px"}}>
                    <Breadcrumb style={{margin: "16px 0"}} separator=">">
                        {rootState.selectedBreadCrum.map((breadCrum: string) => {
                            return <Breadcrumb.Item>{breadCrum}</Breadcrumb.Item>;
                        })}
                    </Breadcrumb>
                    <div className="site-layout-background" style={{padding: 24, minHeight: "calc(100vh - 128px)"}}>
                        <Switch>
                            <Switch>
                                <Route path="/analytics" component={AnalyticsPage}/>
                                <Route path="/audience/contacts" component={ContactsPage}/>
                                <Route path="/audience/customField" component={CustomFieldsPage}/>
                                <Route path="/audience/segments" component={SegmentsPage}/>
                                <Route path="/audience/uploads" component={UploadsPage}/>
                                <Route path="/audience" component={ContactsPage}/>
                                <Route path="/campaigns" component={CampaignPage}/>
                                <Route path="/" component={AnalyticsPage} exact/>
                            </Switch>
                        </Switch>
                    </div>
                </Content>
            </Layout>
        </Layout>
    );
}
