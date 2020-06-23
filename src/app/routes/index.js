import { LOCAL_STORAGE_KEY } from 'app/consts';
import loadWASM from 'app/services/wasm';
import LocalStorageServices from 'app/utils/localStorage';
import { Config } from 'configs';
import { ConnectedRouter } from 'connected-react-router';
import React, { Fragment, useEffect, useState } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import { routeAppConfig, routeForAuthConfig } from './config';
import RouterApp from './consts';
import history from './history';

console.log(Config.API_SERVER);
const AppRoutes = ({ wallet }) => {
    const [hasAccountImported, setAccountImported] = useState(true);

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
        if (LocalStorageServices.getItem(LOCAL_STORAGE_KEY.IS_DASHBOARD) && LocalStorageServices.getItem(LOCAL_STORAGE_KEY.IS_DASHBOARD)) {
            setAccountImported(true);
        }

        const loadWebAssembly = async () => {
            await loadWASM();
        };

        if (!wallet) {
            loadWebAssembly();
        }
    }, []);

    return (
        <ConnectedRouter history={history}>
            {!hasAccountImported ? (
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
