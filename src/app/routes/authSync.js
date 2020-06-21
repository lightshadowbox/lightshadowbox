import AsyncComponent from 'app/components/asyncComponent';

const AsyncOnboarding = AsyncComponent(() => import('app/pages/onboarding/index'));

// eslint-disable-next-line import/prefer-default-export
export { AsyncOnboarding };
