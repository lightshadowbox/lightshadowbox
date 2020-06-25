import AsyncComponent from 'app/components/asyncComponent';

const AsyncOnboarding = AsyncComponent(() => import('app/pages/onboarding/index'));
const AsyncAccount = AsyncComponent(() => import('app/pages/account/index'));
const AsyncImportAccount = AsyncComponent(() => import('app/pages/account/importAccount/index'));
const AsyncDetailAccount = AsyncComponent(() => import('app/pages/account/accountDetail/index'));

export { AsyncOnboarding, AsyncAccount, AsyncImportAccount, AsyncDetailAccount };
