import {
  createDirectRelationship,
  IntegrationStep,
  IntegrationStepExecutionContext,
  RelationshipClass,
} from '@jupiterone/integration-sdk-core';
import { createApiClient } from '../../aquasec/jupiterone';

import { IntegrationConfig } from '../../config';
import { Steps, Entities, Relationships } from '../constants';
import { buildRepositoryEntityKey } from '../repositories/converter';
import { createDetectionEntity } from './converter';

export async function fetchDetections(
  context: IntegrationStepExecutionContext<IntegrationConfig>,
) {
  const { jobState } = context;
  const client = createApiClient(context);

  await client.iterateDetections(async detection => {
    const detectionEntity = await jobState.addEntity(createDetectionEntity(detection));

    await client.iterateDetectionInstances(detection.avd_id, async instance => {
      const repository = await jobState.findEntity(buildRepositoryEntityKey(instance.repository_id));

      if (!repository) {
        return;
      }

      await jobState.addRelationship(createDirectRelationship({
        _class: RelationshipClass.HAS,
        from: repository,
        to: detectionEntity,
      }));
    });
  });
}

export const detectionSteps: IntegrationStep<IntegrationConfig>[] = [
  {
    id: Steps.DETECTIONS,
    name: 'Fetch Detections',
    entities: [Entities.DETECTION],
    relationships: [Relationships.REPOSITORY_HAS_DETECTION],
    dependsOn: [],
    executionHandler: fetchDetections,
  },
];
