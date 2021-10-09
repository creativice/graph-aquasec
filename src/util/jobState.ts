import {
  createDirectRelationship,
  Entity,
  IntegrationError,
  JobState,
  RelationshipClass,
} from '@jupiterone/integration-sdk-core';

export const ACCOUNT_ENTITY_KEY = 'entity:account';

function toArray<T>(v: T | T[]): T[] {
  return Array.isArray(v) ? v : [v];
}

export async function withAccountEntity<TResult>({
  jobState,
  data,
  converter,
}: {
  jobState: JobState;
  data: TResult | TResult[];
  converter: (data: TResult) => Entity;
}) {
  const accountEntity = await getAccountEntity(jobState);

  for (const record of toArray(data)) {
    await jobState.addRelationship(
      createDirectRelationship({
        _class: RelationshipClass.HAS,
        from: accountEntity,
        to: await jobState.addEntity(converter(record)),
      }),
    );
  }
}

export async function getAccountEntity(jobState: JobState): Promise<Entity> {
  const accountEntity = await jobState.getData<Entity>(ACCOUNT_ENTITY_KEY);

  if (!accountEntity) {
    throw new IntegrationError({
      code: 'MISSING_REQUIRED_JOB_STATE_DATA',
      message: 'Could not find account entity in job state',
      fatal: true,
    });
  }

  return accountEntity;
}

export async function setAccountEntity(
  jobState: JobState,
  accountEntity: Entity,
) {
  await jobState.setData(ACCOUNT_ENTITY_KEY, accountEntity);
}
