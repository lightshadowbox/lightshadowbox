import AsyncComponent from 'app/components/asyncComponent';

const AsyncOnboarding = AsyncComponent(() => import('app/pages/onboarding/index'));
const AsyncInitWallet = AsyncComponent(() => import('app/pages/initWallet/index'));

export { AsyncOnboarding, AsyncInitWallet };
