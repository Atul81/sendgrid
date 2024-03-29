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
        name: 'dashboard',
        icon: <MacCommandOutlined/>,
        route: '/dashboard',
        children: null
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
                key: 'segments'
            },
            {
                key: 'imports'
            },
            {
                key: 'exports'
            },
            {
                key: 'custom-field'
            }
        ]
    },
    {
        key: '3',
        name: 'campaign',
        icon: <CompassOutlined/>,
        route: '/campaign/',
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
                key: 'dedicated-ips'
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
