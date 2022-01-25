import {
  IntegrationStep,
  IntegrationStepExecutionContext,
} from '@jupiterone/integration-sdk-core';
import { createApiClient } from '../../aquasec/jupiterone';

import { IntegrationConfig } from '../../config';
import { withAccountEntity } from '../../util/jobState';
import { Steps, Entities, Relationships } from '../constants';
import { createApiKeyEntity } from './converter';

export async function fetchApiKeys(
  context: IntegrationStepExecutionContext<IntegrationConfig>,
) {
  const { jobState } = context;
  const client = createApiClient(context);

  await withAccountEntity({
    jobState,
    data: await client.listApiKeys(),
    converter: createApiKeyEntity,
  });
}

export const apiKeySteps: IntegrationStep<IntegrationConfig>[] = [
  {
    id: Steps.API_KEYS,
    name: 'Fetch API Keys',
    entities: [Entities.API_KEY],
    relationships: [Relationships.ACCOUNT_HAS_API_KEY],
    dependsOn: [Steps.ACCOUNT],
    executionHandler: fetchApiKeys,
  },
];
