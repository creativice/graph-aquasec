import {
  IntegrationStep,
  IntegrationStepExecutionContext,
} from '@jupiterone/integration-sdk-core';
import { createApiClient } from '../../aquasec/jupiterone';

import { IntegrationConfig } from '../../config';
import { withAccountEntity } from '../../util/jobState';
import { Steps, Entities, Relationships } from '../constants';
import { createGroupEntity } from './converter';

export async function fetchGroups(
  context: IntegrationStepExecutionContext<IntegrationConfig>,
) {
  const { jobState } = context;
  const client = createApiClient(context);

  await withAccountEntity({
    jobState,
    data: await client.listGroups(),
    converter: createGroupEntity,
  });
}

export const groupSteps: IntegrationStep<IntegrationConfig>[] = [
  {
    id: Steps.GROUPS,
    name: 'Fetch Groups',
    entities: [Entities.GROUP],
    relationships: [Relationships.ACCOUNT_HAS_GROUP],
    dependsOn: [Steps.ACCOUNT],
    executionHandler: fetchGroups,
  },
];
