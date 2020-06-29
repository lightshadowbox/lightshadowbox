import React, { Fragment, useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ConnectedRouter } from 'connected-react-router';
import { Redirect, Route, Switch } from 'react-router-dom';
import loadWASM from 'app/services/wasm';
import LocalStorageServices from 'app/utils/localStorage';
import { LOCAL_STORAGE_KEY } from 'app/consts';
import { loadingOpen, loadingClose } from 'app/redux/common/actions';
import { makeSelectWallet } from 'app/redux/incognito/selector';
import { onIncognitoLoadWallet } from 'app/redux/incognito/actions';
import { routeAppConfig, routeForAuthConfig } from './config';
import RouterApp from './consts';
import history from './history';

const AppRoutes = () => {
    const dispatch = useDispatch();
    const wallet = useSelector(makeSelectWallet());
    const [hasWalletBackup, setWalletBackup] = useState(false);

    const routesMatch = [];

    const onceRouter = (route) => {
        const { component: Component, layout: Layout, path, exact, strict } = route;
        return Component ? (
            <Route
                key={Math.random().toString(36).substr(2, 5)}
                path={path}
                exact={exact}
                strict={strict}
                render={(props) => (
                    <>
                        <Layout>
                            <Component {...props} />
                        </Layout>
                    </>
                )}
            />
        ) : (
            <Fragment key={Math.random().toString(36).substr(2, 5)}>No Component Imported</Fragment>
        );
    };

    const routerListNav = (data) => {
        data.forEach((route) => {
            if (Object.prototype.hasOwnProperty.call(route, 'children')) {
                const { children, path } = route;
                routerListNav(children);
                if (path) {
                    routesMatch.push(onceRouter(route));
                }
            } else {
                routesMatch.push(onceRouter(route));
            }
        });
        return routesMatch;
    };

    useEffect(() => {
        const loadWebAssembly = async () => {
            dispatch(loadingOpen());
            await loadWASM();
            dispatch(loadingClose());
            dispatch(onIncognitoLoadWallet());
        };
        loadWebAssembly();
    }, [dispatch]);

    useEffect(() => {
        const walletBackup = LocalStorageServices.getItem(LOCAL_STORAGE_KEY.WALLET);
        if (!walletBackup) {
            history.push(RouterApp.rOnboarding);
        }
        if (wallet) {
            setWalletBackup(true);
        }
    }, [wallet]);

    return (
        <ConnectedRouter history={history}>
            <>
                <Switch>
                    {routerListNav(routeAppConfig)}
                    <Redirect path="*" to={RouterApp.rDetailAccount} />
                </Switch>
            </>
        </ConnectedRouter>
    );
};

export default AppRoutes;
