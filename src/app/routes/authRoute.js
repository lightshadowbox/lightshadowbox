import { PublicLayout, PrivateLayout } from 'app/layouts';
import { AsyncOnboarding, AsyncInitWallet } from './authSync';
import RouterApp from './consts';

const AuthRouteConfig = [
    {
        title: 'Incognito Web Wallet',
        path: RouterApp.rOnboarding,
        layout: PublicLayout,
        component: AsyncOnboarding,
    },
    {
        title: 'Incognito Web Wallet',
        path: RouterApp.rInitWallet,
        layout: PrivateLayout,
        component: AsyncInitWallet,
    },
];

export default AuthRouteConfig;
