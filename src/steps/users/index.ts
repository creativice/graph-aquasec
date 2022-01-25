import {
  createDirectRelationship,
  Entity,
  IntegrationStep,
  IntegrationStepExecutionContext,
  JobState,
  RelationshipClass,
} from '@jupiterone/integration-sdk-core';
import { createApiClient } from '../../aquasec/jupiterone';
import { AquaSecUser } from '../../aquasec/types';

import { IntegrationConfig } from '../../config';
import { withAccountEntity } from '../../util/jobState';
import { Steps, Entities, Relationships } from '../constants';
import { buildGroupEntityKey } from '../groups/converter';
import { buildUserEntityKey, createUserEntity } from './converter';

async function buildGroupHasUserRelationships(
  jobState: JobState,
  users: AquaSecUser[],
) {
  // Cache the local job state lookups for groups
  const groupMap = new Map<number, Entity>();

  for (const user of users) {
    if (!user.groups || !user.groups.length) {
      continue;
    }

    for (const group of user.groups) {
      const groupEntity =
        groupMap.get(group.id) ||
        (await jobState.findEntity(buildGroupEntityKey(group)));

      if (!groupEntity) continue;
      groupMap.set(group.id, groupEntity);

      await jobState.addRelationship(
        createDirectRelationship({
          _class: RelationshipClass.HAS,
          fromType: groupEntity._type,
          fromKey: groupEntity._key,
          toKey: buildUserEntityKey(user),
          toType: Entities.USER._type,
        }),
      );
    }
  }
}

export async function fetchUsers(
  context: IntegrationStepExecutionContext<IntegrationConfig>,
) {
  const { jobState } = context;
  const client = createApiClient(context);
  const users = await client.listUsers({ expandGroups: true });

  await withAccountEntity({
    jobState,
    data: users,
    converter: createUserEntity,
  });

  await buildGroupHasUserRelationships(jobState, users);
}

export const userSteps: IntegrationStep<IntegrationConfig>[] = [
  {
    id: Steps.USERS,
    name: 'Fetch Users',
    entities: [Entities.USER],
    relationships: [
      Relationships.ACCOUNT_HAS_USER,
      Relationships.GROUP_HAS_USER,
    ],
    dependsOn: [Steps.ACCOUNT, Steps.GROUPS],
    executionHandler: fetchUsers,
  },
];
