import React, {useEffect, useState} from 'react';
import 'antd/dist/antd.css';
import './index.scss';
import {Breadcrumb, Layout, Menu} from 'antd';
import {UserOutlined} from '@ant-design/icons';
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
import {CampaignPage} from "./campaigns/campaigns/CampaignLoadable";
import {AutomationPage} from "./campaigns/automation/AutomationLoadable";
import {SendersPage} from "./campaigns/senders/SendersLoadable";
import translation from './../locales/en/translation.json'
import {routes} from "./routes";
import {TemplatesPage} from "./templates/TemplatesLoadable";

export function App() {
    const [collapsed, setCollapsed] = useState(false);
    const dispatch = useDispatch();
    const rootState = useSelector((state: any) => state.root);
    const urlPath = useLocation();

    useEffect(() => {
        let urlRoute = urlPath.pathname.split("/");
        if (urlRoute && urlRoute[1]) {
            dispatch(updateActiveMenuContent(urlRoute[1]));
            if (urlRoute[2]) {
                dispatch(updateActiveContent(urlRoute[2]));
                dispatch(updateBreadcrumb([translation.breadcrumb[urlRoute[1]], translation.breadcrumb[urlRoute[2]]]));
            } else {
                dispatch(updateActiveContent(translation.defaultSidebar[urlRoute[1]]));
                dispatch(updateBreadcrumb([translation.breadcrumb[urlRoute[1]], translation.breadcrumb[translation.defaultSidebar[urlRoute[1]]]]));
            }
        }
    }, [dispatch, urlPath.pathname]);

    const onMenuTitleClick = (activeMenuContent: string, activeContent: string) => {
        dispatch(updateActiveContent(rootState.activeMenuContent !== activeMenuContent ? activeContent : null));
        dispatch(updateActiveMenuContent(rootState.activeMenuContent !== activeMenuContent ? activeMenuContent : null))
    };

    return (
        <Layout style={{minHeight: "100vh"}}>
            <Sider collapsible collapsed={collapsed} onCollapse={() => setCollapsed(!collapsed)}>
                <div className="logo">
                    <img style={collapsed ? {marginTop: -8} : {marginTop: -68}} src={`/${"assets/images/logo.svg"}`}
                         alt="icon"/>
                </div>
                <Menu theme="dark" openKeys={[rootState.activeMenuContent]} selectedKeys={[rootState.activeContent]}
                      mode="inline">
                    {routes.map((value) => (
                        <SubMenu onTitleClick={() => onMenuTitleClick(value.name, value.key)} key={value.name}
                                 icon={value.icon} title={translation.breadcrumb[value.name]}>
                            {value.children.map((childItr) => (
                                <Menu.Item key={childItr.key}><Link
                                    to={value.route.concat(childItr.key)}>{translation.breadcrumb[childItr.key]}</Link></Menu.Item>
                            ))}
                        </SubMenu>
                    ))}
                </Menu>
            </Sider>
            <Layout className="site-layout">
                <Header className="header">
                    <Menu mode="horizontal" selectable={false}>
                        <Menu.Item key="1"><Clock format={'h:mm:ss a'} ticking={true}
                                                  timezone={'Asia/Kolkata'}/></Menu.Item>
                        <SubMenu key="user" icon={<UserOutlined/>} title="Atul Pandey">
                            <Menu.Item key="1">Log Out</Menu.Item>
                            <Menu.Item key="2"><a rel={'noreferrer'} href={"https://www.gmail.com"} target={"_blank"}>Change
                                Password</a></Menu.Item>
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
                                <Route path="/audience/customField" component={CustomFieldsPage}/>
                                <Route path="/audience/segments" component={SegmentsPage}/>
                                <Route path="/audience/uploads" component={UploadsPage}/>
                                <Route path="/campaigns/campaigns" component={CampaignPage}/>
                                <Route path="/campaigns/senders" component={SendersPage}/>
                                <Route path="/templates" component={TemplatesPage}/>
                                <Route path="/audience" component={ContactsPage}/>
                                <Route path="/campaigns" component={AutomationPage}/>
                                <Route path="/" component={AnalyticsPage}/>
                            </Switch>
                        </Switch>
                    </div>
                </Content>
            </Layout>
        </Layout>
    );
}
