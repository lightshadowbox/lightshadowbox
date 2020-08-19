import React, { Fragment } from 'react'

import AsyncComponent from 'app/components/asyncComponent'
import { LOCAL_STORAGE_KEY } from 'app/consts'
import { PrivateLayout, PublicLayout } from 'app/layouts'
import { makeSelectorIsLogin } from 'app/redux/incognito/selector'
import LocalStorageServices from 'app/utils/localStorage'
import { ConnectedRouter } from 'connected-react-router'
import isEmpty from 'lodash/isEmpty'
import { useSelector } from 'react-redux'
import { Redirect, Route, Switch } from 'react-router-dom'

import RouterApp from './consts'
import history from './history'

const AsyncAccount = AsyncComponent(() => import('app/pages/account/index'))
const AsyncOnboarding = AsyncComponent(() => import('app/pages/onboarding/index'))
const AsyncInitWallet = AsyncComponent(() => import('app/pages/initWallet/index'))
const AsyncLogin = AsyncComponent(() => import('app/pages/login/passcode'))

const publicRoutes = [
  {
    title: 'Migrate Your Wallet',
    path: RouterApp.rMigrate,
    layout: PublicLayout,
    component: AsyncComponent(() => import('app/pages/migrate/index')),
  },
]

const returnRoutes = [
  {
    title: 'Incognito Login',
    path: RouterApp.rLogin,
    layout: PublicLayout,
    component: AsyncLogin,
  },
]

const authenticatedRoutes = [
  {
    title: 'Account',
    path: RouterApp.rAccount,
    layout: PrivateLayout,
    component: AsyncAccount,
  },
]

export const firstTimeRoutes = [
  {
    title: 'Welcome LIGHT SHADOW BOX',
    path: RouterApp.rOnboarding,
    layout: PublicLayout,
    component: AsyncOnboarding,
  },
  {
    title: 'Create New Wallet',
    path: RouterApp.rInitWallet,
    layout: PublicLayout,
    component: AsyncInitWallet,
  },
]

const AppRoutes = () => {
  const isLogin = useSelector(makeSelectorIsLogin())
  const isHaveBackupWallet = !isEmpty(LocalStorageServices.getItem(LOCAL_STORAGE_KEY.WALLET))
  const routesMatch = []

  const onceRouter = (route) => {
    const { component: Component, layout: Layout, path, exact, strict } = route
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
    )
  }

  const routerListNav = (data) => {
    data.forEach((route) => {
      if (Object.prototype.hasOwnProperty.call(route, 'children')) {
        const { children, path } = route
        routerListNav(children)
        if (path) {
          routesMatch.push(onceRouter(route))
        }
      } else {
        routesMatch.push(onceRouter(route))
      }
    })
    return routesMatch
  }

  if (isLogin) {
    return (
      <ConnectedRouter history={history}>
        <Switch>
          {routerListNav(authenticatedRoutes)}
          <Redirect to={RouterApp.rAccount} />
        </Switch>
      </ConnectedRouter>
    )
  }

  return (
    <ConnectedRouter history={history}>
      {!isHaveBackupWallet ? (
        <>
          <Switch>
            {routerListNav([...publicRoutes, ...firstTimeRoutes])}
            <Redirect to={RouterApp.rOnboarding} />
          </Switch>
        </>
      ) : (
        <>
          <Switch>
            {routerListNav(returnRoutes)}
            <Redirect path="*" to={RouterApp.rLogin} />
          </Switch>
        </>
      )}
    </ConnectedRouter>
  )
}

export default AppRoutes
