import {
  IntegrationStep,
  IntegrationStepExecutionContext,
} from '@jupiterone/integration-sdk-core';
import { createApiClient } from '../../aquasec/jupiterone';

import { IntegrationConfig } from '../../config';
import { withAccountEntity } from '../../util/jobState';
import { Steps, Entities, Relationships } from '../constants';
import { createUserEntity } from './converter';

export async function fetchUsers(
  context: IntegrationStepExecutionContext<IntegrationConfig>,
) {
  const { jobState } = context;
  const client = createApiClient(context);

  await withAccountEntity({
    jobState,
    data: await client.listUsers(),
    converter: createUserEntity,
  });
}

export const userSteps: IntegrationStep<IntegrationConfig>[] = [
  {
    id: Steps.USERS,
    name: 'Fetch Users',
    entities: [Entities.USER],
    relationships: [Relationships.ACCOUNT_HAS_USER],
    dependsOn: [Steps.ACCOUNT],
    executionHandler: fetchUsers,
  },
];
