import { PrivateLayout } from 'app/layouts';
import { AsyncAccount, AsyncImportAccount } from './primarySync';
import RouterApp from './consts';

const PrimaryRouteConfig = [
    {
        title: 'Account',
        path: RouterApp.rAccount,
        layout: PrivateLayout,
        component: AsyncAccount,
        children: [
            {
                title: 'Import account from private keys',
                path: `${RouterApp.rAccount}${RouterApp.rImport}`,
                layout: PrivateLayout,
                component: AsyncImportAccount,
            },
        ],
    },
];

export default PrimaryRouteConfig;
