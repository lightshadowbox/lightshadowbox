import { PrivateLayout } from 'app/layouts';
import RouterApp from './consts';
import { AsyncDetailAccount, AsyncListAccount } from './primarySync';

const PrimaryRouteConfig = [
    {
        title: 'Detail account',
        path: RouterApp.rDetailAccount,
        layout: PrivateLayout,
        component: AsyncDetailAccount,
    },
    {
        title: 'List account',
        path: RouterApp.rListAccount,
        layout: PrivateLayout,
        component: AsyncListAccount,
    },
    // {
    //     title: 'Account',
    //     path: RouterApp.rAccount,
    //     layout: PrivateLayout,
    //     component: AsyncAccount,
    //     children: [
    //         {
    //             title: 'Import account from private keys',
    //             path: `${RouterApp.rAccount}${RouterApp.rImport}`,
    //             layout: PrivateLayout,
    //             component: AsyncImportAccount,
    //         },
    //         {
    //             title: 'Detail account',
    //             path: `${RouterApp.rAccount}${RouterApp.rDetailAccount}`,
    //             layout: PrivateLayout,
    //             component: AsyncDetailAccount,
    //         },
    //     ],
    // },
];

export default PrimaryRouteConfig;
