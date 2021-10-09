import {
  IntegrationStep,
  IntegrationStepExecutionContext,
} from '@jupiterone/integration-sdk-core';
import { createApiClient } from '../../aquasec/jupiterone';
import { IntegrationConfig } from '../../config';
import { setAccountEntity } from '../../util/jobState';
import { Steps, Entities } from '../constants';
import { createAccountEntity } from './converter';

export async function fetchAccountDetails(
  context: IntegrationStepExecutionContext<IntegrationConfig>,
) {
  const { jobState, instance } = context;
  const client = createApiClient(context);
  const account = await client.getAccount(instance.config.accountId);

  await setAccountEntity(
    jobState,
    await jobState.addEntity(createAccountEntity(account)),
  );
}

export const accountSteps: IntegrationStep<IntegrationConfig>[] = [
  {
    id: Steps.ACCOUNT,
    name: 'Fetch Account Details',
    entities: [Entities.ACCOUNT],
    relationships: [],
    dependsOn: [],
    executionHandler: fetchAccountDetails,
  },
];
