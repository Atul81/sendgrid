import React from 'react';
import {
    AppstoreOutlined,
    CompassOutlined,
    ExportOutlined,
    MacCommandOutlined,
    SettingOutlined,
    SmileOutlined
} from '@ant-design/icons';

export const routes = [
    {
        key: '1',
        name: 'analytics',
        icon: <MacCommandOutlined/>,
        route: '/analytics/',
        children: [
            {
                key: 'dashboard',
            }
        ]
    },
    {
        key: '2',
        name: 'audience',
        icon: <SmileOutlined/>,
        route: '/audience/',
        children: [
            {
                key: 'contacts'
            },
            {
                key: 'customField'
            },
            {
                key: 'segments'
            },
            {
                key: 'uploads'
            }
        ]
    },
    {
        key: '3',
        name: 'campaigns',
        icon: <CompassOutlined/>,
        route: '/campaigns/',
        children: [
            {
                key: 'automation'
            },
            {
                key: 'campaigns'
            },
            {
                key: 'senders'
            }
        ]
    },
    {
        key: '4',
        name: 'templates',
        icon: <AppstoreOutlined/>,
        route: '/templates/',
        children: [
            {
                key: 'templates'
            },
            {
                key: 'template-editor'
            },
            {
                key: 'delivery-testing'
            }
        ]
    },
    {
        key: '5',
        name: 'unsubscription',
        icon: <ExportOutlined/>,
        route: '/unsubscription/',
        children: [
            {
                key: 'groups'
            },
            {
                key: 'customize-form'
            }
        ]
    },
    {
        key: '6',
        name: 'settings',
        icon: <SettingOutlined/>,
        route: '/settings/',
        children: [
            {
                key: 'domain'
            },
            {
                key: 'dedicated-ip'
            },
            {
                key: 'custom-events'
            },
            {
                key: 'preference'
            },
            {
                key: 'users'
            }
        ]
    }
];
