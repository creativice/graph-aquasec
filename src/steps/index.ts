import { IntegrationStep } from '@jupiterone/integration-sdk-core';
import { IntegrationConfig } from '../config';
import { accountSteps } from './account';
import { apiKeySteps } from './api-keys';
import { detectionSteps } from './detections';
import { groupSteps } from './groups';
import { repositorySteps } from './repositories';
import { userSteps } from './users';

const integrationSteps: IntegrationStep<IntegrationConfig>[] = [
  ...accountSteps,
  ...userSteps,
  ...groupSteps,
  ...apiKeySteps,
  ...repositorySteps,
  ...detectionSteps
];

export { integrationSteps };
