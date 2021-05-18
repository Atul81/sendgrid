import React, {useEffect, useState} from 'react';
import 'antd/dist/antd.css';
import './index.scss';
import {Breadcrumb, Layout, Menu} from 'antd';
import {UserOutlined} from '@ant-design/icons';
import Sider from "antd/es/layout/Sider";
import SubMenu from "antd/es/menu/SubMenu";
import {Content, Header} from "antd/es/layout/layout";
import {Link, Route, Switch, useLocation,} from "react-router-dom";
import Clock from 'react-live-clock';
import {ContactsPage} from "./audience/contacts/ContactsLoadable";
import {CustomFieldsPage} from "./audience/customFields/CustomFieldsLoadable";
import {SegmentsPage} from "./audience/segments/SegmentsLoadable";
import {useDispatch, useSelector} from "react-redux";
import {updateActiveContent, updateActiveMenuContent, updateBreadcrumb} from "../store/actions/root";

import {CampaignPage} from "./campaigns/campaigns/CampaignLoadable";
import {AutomationPage} from "./campaigns/automation/AutomationLoadable";
import {SendersPage} from "./campaigns/senders/SendersLoadable";
import translation from './../locales/en/translation.json'
import {routes} from "./routes";
import {TemplatesPage} from "./templates/TemplatesLoadable";
import {DashboardPage} from "./dashboard/DashboardLoadable";
import {ImportsPage} from "./audience/imports/ImportsLoadable";
import {ExportPage} from "./audience/exports/ExportsLoadable";
import {GroupsPage} from "./unsubcription/groups/GroupsLoadable";
import {DomainSettingsPage} from "./settings/domain/DomainLoadable";
import {DedicatedIpsPage} from "./settings/dedicatedIps/DedicatedIpsLoadable";
import {CustomEventsPage} from "./settings/customEvents/CustomEventsLoadable";
import {UsersPage} from "./settings/users/UsersLoadable";
import {PreferencePage} from "./settings/preferences/PreferenceLoadable";
import {CustomizeFormPage} from "./unsubcription/customizeForm/CustomizeFormLoadable";

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
                dispatch(updateBreadcrumb([urlRoute[1], urlRoute[2]]));
            } else {
                dispatch(updateActiveContent(translation.defaultSidebar[urlRoute[1]]));
                dispatch(updateBreadcrumb([translation.breadcrumb[urlRoute[1]], translation.breadcrumb[translation.defaultSidebar[urlRoute[1]]]]));
            }
        }
    }, [dispatch, urlPath.pathname]);

    const onMenuTitleClick = (activeMenuContent: string, activeContent: string) => {
        dispatch(updateActiveContent(activeContent));
        dispatch(updateActiveMenuContent(activeMenuContent));
    };

    const resetDrawerMenu = (drawerVal: any[]) => {
        if (drawerVal.length === 0) {
            dispatch(updateActiveContent(null));
            dispatch(updateActiveMenuContent(null));
        } else {
            let urlRoute = urlPath.pathname.split("/");
            dispatch(updateActiveContent(urlRoute[2]));
            dispatch(updateBreadcrumb([urlRoute[1], urlRoute[2]]));
        }
    };

    return (
        <Layout style={{minHeight: "100vh"}}>
            <Sider collapsible collapsed={collapsed} onCollapse={() => setCollapsed(!collapsed)}>
                <div className="logo">
                    <img style={collapsed ? {marginTop: -8} : {}}
                         src={!collapsed ? `/assets/images/logo.svg` : `/assets/images/logoCollapsed.svg`}
                         alt="icon"/>
                </div>
                <Menu theme="dark" openKeys={[rootState.activeMenuContent]} onOpenChange={resetDrawerMenu}
                      selectedKeys={[rootState.activeContent]}
                      mode="inline">
                    {routes.map((value) => (
                        value.children != null ?
                            <SubMenu onTitleClick={() => onMenuTitleClick(value.name, value.key)} key={value.name}
                                     icon={value.icon} title={translation.breadcrumb[value.name]}>
                                {value.children.map((childItr) => (
                                    <Menu.Item key={childItr.key}><Link
                                        to={value.route.concat(childItr.key)}>{translation.breadcrumb[childItr.key]}</Link></Menu.Item>
                                ))}
                            </SubMenu> :
                            <Menu.Item onClick={() => onMenuTitleClick('dashboard', '1')} icon={value.icon}
                                       key={value.key}><Link
                                to={value.route}>{translation.breadcrumb[value.name]}</Link></Menu.Item>
                    ))}
                </Menu>
            </Sider>
            <Layout className="site-layout">
                <Header className="header">
                    <Menu mode="horizontal" selectable={false}>
                        <Menu.Item key="1"><Clock format={'h:mm:ss a'} ticking={true}
                                                  timezone={'Asia/Kolkata'}/></Menu.Item>
                        <SubMenu key="user" icon={<UserOutlined/>} title="John Doe">
                            <Menu.Item key="1">Log Out</Menu.Item>
                            <Menu.Item key="2"><a rel={'noreferrer'} href={"https://www.gmail.com"} target={"_blank"}>Change
                                Password</a></Menu.Item>
                        </SubMenu>
                    </Menu>
                </Header>
                <Content style={{margin: "0 16px"}}>
                    <Breadcrumb style={{margin: "16px 0"}} separator=">">
                        {rootState.selectedBreadCrum.map((breadCrumb: string, index: number) => {
                            if (breadCrumb) {
                                if (index !== 2) {
                                    return <Breadcrumb.Item>
                                        <a href={breadCrumb ? breadCrumb.toLowerCase() : breadCrumb}> {translation.breadcrumb[breadCrumb.toLowerCase()]}</a>
                                    </Breadcrumb.Item>;
                                } else {
                                    return <Breadcrumb.Item>{translation.breadcrumb[breadCrumb.toLowerCase()]}</Breadcrumb.Item>
                                }
                            } else {
                                return null;
                            }
                        })}
                    </Breadcrumb>
                    <div className="site-layout-background" style={{padding: 24, minHeight: "calc(100vh - 128px)"}}>
                        <Switch>
                            <Switch>
                                <Route path="/dashboard" component={DashboardPage}/>
                                <Route path="/audience/custom-field" component={CustomFieldsPage}/>
                                <Route path="/audience/segments" component={SegmentsPage}/>
                                <Route path="/audience/imports" component={ImportsPage}/>
                                <Route path="/audience/exports" component={ExportPage}/>
                                <Route path="/campaign/campaigns" component={CampaignPage}/>
                                <Route path="/campaign/senders" component={SendersPage}/>
                                <Route path="/templates" component={TemplatesPage}/>
                                <Route path="/unsubscription/groups" component={GroupsPage}/>
                                <Route path="/unsubscription/customize-form" component={CustomizeFormPage}/>
                                <Route path="/settings/domain" component={DomainSettingsPage}/>
                                <Route path="/settings/dedicated-ips" component={DedicatedIpsPage}/>
                                <Route path="/settings/custom-events" component={CustomEventsPage}/>
                                <Route path="/settings/users" component={UsersPage}/>
                                <Route path="/settings/preference" component={PreferencePage}/>
                                <Route path="/audience" component={ContactsPage}/>
                                <Route path="/campaign" component={AutomationPage}/>
                                <Route path="/unsubscription" component={GroupsPage}/>
                                <Route path="/settings" component={DomainSettingsPage}/>
                                <Route path="/" component={DashboardPage}/>
                            </Switch>
                        </Switch>
                    </div>
                </Content>
            </Layout>
        </Layout>
    );
}
