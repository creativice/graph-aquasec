import { IntegrationStep } from '@jupiterone/integration-sdk-core';
import { IntegrationConfig } from '../config';
import { accountSteps } from './account';
import { apiKeySteps } from './api-keys';
import { groupSteps } from './groups';
import { userSteps } from './users';

const integrationSteps: IntegrationStep<IntegrationConfig>[] = [
  ...accountSteps,
  ...userSteps,
  ...groupSteps,
  ...apiKeySteps,
];

export { integrationSteps };
