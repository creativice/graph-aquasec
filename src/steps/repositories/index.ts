import {
  IntegrationStep,
  IntegrationStepExecutionContext,
} from '@jupiterone/integration-sdk-core';
import { createApiClient } from '../../aquasec/jupiterone';

import { IntegrationConfig } from '../../config';
import { withAccountEntity } from '../../util/jobState';
import { Steps, Entities, Relationships } from '../constants';
import { createRepositoryEntity } from './converter';

export async function fetchRepositories(
  context: IntegrationStepExecutionContext<IntegrationConfig>,
) {
  const { jobState } = context;
  const client = createApiClient(context);

  await client.iterateRepositories(async repository => {
    await withAccountEntity({
      jobState,
      data: repository,
      converter: createRepositoryEntity,
    });
  });
}

export const repositorySteps: IntegrationStep<IntegrationConfig>[] = [
  {
    id: Steps.REPOSITORIES,
    name: 'Fetch Repositories',
    entities: [Entities.REPOSITORY],
    relationships: [
      Relationships.ACCOUNT_HAS_REPOSITORY,
    ],
    dependsOn: [Steps.ACCOUNT],
    executionHandler: fetchRepositories,
  },
];
