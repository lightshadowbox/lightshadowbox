import { PublicLayout, PrivateLayout } from 'app/layouts';
import { AsyncOnboarding } from './authSync';
import { AsyncImportAccount, AsyncAccount } from './primarySync';
import RouterApp from './consts';

const AuthRouteConfig = [
    {
        title: 'Welcome to Incognito Web Wallet',
        path: RouterApp.rOnboarding,
        layout: PublicLayout,
        component: AsyncOnboarding,
    },
];

export default AuthRouteConfig;
