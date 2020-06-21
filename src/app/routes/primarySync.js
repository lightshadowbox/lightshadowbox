import AsyncComponent from 'app/components/asyncComponent';

const AsyncOnboarding = AsyncComponent(() => import('app/pages/onboarding/index'));
const AsyncAccount = AsyncComponent(() => import('app/pages/account/index'));
const AsyncImportAccount = AsyncComponent(() => import('app/pages/account/importAccount/index'));

export { AsyncOnboarding, AsyncAccount, AsyncImportAccount };
