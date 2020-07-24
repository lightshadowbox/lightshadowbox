import { PrivateLayout } from 'app/layouts';
import RouterApp from './consts';
import { AsyncAccount } from './primarySync';

const PrimaryRouteConfig = [
    {
        title: 'Account',
        path: RouterApp.rAccount,
        layout: PrivateLayout,
        component: AsyncAccount,
    },
];

export default PrimaryRouteConfig;
