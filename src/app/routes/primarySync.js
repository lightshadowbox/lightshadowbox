import AsyncComponent from 'app/components/asyncComponent';

const AsyncOnboarding = AsyncComponent(() => import('app/pages/onboarding/index'));
const AsyncAccount = AsyncComponent(() => import('app/pages/account/index'));

export { AsyncOnboarding, AsyncAccount };
