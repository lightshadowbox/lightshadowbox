import AsyncComponent from 'app/components/asyncComponent';

const AsyncOnboarding = AsyncComponent(() => import('app/pages/onboarding/index'));
const AsyncAccount = AsyncComponent(() => import('app/pages/account/index'));
const AsyncDetailAccount = AsyncComponent(() => import('app/pages/account/accountDetail/index'));
const AsyncListAccount = AsyncComponent(() => import('app/pages/account/list/index'));

export { AsyncOnboarding, AsyncAccount, AsyncDetailAccount, AsyncListAccount };
