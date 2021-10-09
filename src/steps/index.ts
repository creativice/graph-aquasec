import { IntegrationStep } from '@jupiterone/integration-sdk-core';
import { IntegrationConfig } from '../config';
import { accountSteps } from './account';
import { userSteps } from './users';

const integrationSteps: IntegrationStep<IntegrationConfig>[] = [
  ...accountSteps,
  ...userSteps,
];

export { integrationSteps };
