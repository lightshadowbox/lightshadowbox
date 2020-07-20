import React, { Fragment, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Redirect, Route, Switch } from 'react-router-dom';
import { ConnectedRouter } from 'connected-react-router';
import { isEmpty } from 'lodash';
import { LOCAL_STORAGE_KEY } from 'app/consts';
import LocalStorageServices from 'app/utils/localStorage';
import { makeSelectAccounts } from 'app/redux/incognito/selector';
import { loadingClose, loadingOpen } from 'app/redux/common/actions';
import { onIncognitoGetAccounts } from 'app/redux/incognito/actions';
import loadIncognito from 'app/services/incognito';
import { routeAppConfig, routeForAuthConfig } from './config';
import RouterApp from './consts';
import history from './history';

const AppRoutes = () => {
    const dispatch = useDispatch();
    const accounts = useSelector(makeSelectAccounts());
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
            if (LocalStorageServices.getItem(LOCAL_STORAGE_KEY.WALLET)) {
                dispatch(loadingOpen());
                await loadIncognito();
                dispatch(onIncognitoGetAccounts());
                dispatch(loadingClose());
            }
        };
        // loadWebAssembly();
    }, [dispatch]);

    useEffect(() => {
        if (LocalStorageServices.getItem(LOCAL_STORAGE_KEY.WALLET) && !isEmpty(accounts)) {
            setWalletBackup(true);
        }
    }, [accounts]);

    return (
        <ConnectedRouter history={history}>
            {!hasWalletBackup ? (
                <>
                    <Switch>
                        {routerListNav(routeForAuthConfig)}
                        <Redirect to={RouterApp.rOnboarding} />
                    </Switch>
                </>
            ) : (
                <>
                    <Switch>
                        {routerListNav(routeAppConfig)}
                        <Redirect path="*" to={RouterApp.rAccount} />
                    </Switch>
                </>
            )}
        </ConnectedRouter>
    );
};

export default AppRoutes;
