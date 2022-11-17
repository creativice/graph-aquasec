import { createMockStepExecutionContext } from '@jupiterone/integration-sdk-testing';

import { IntegrationConfig } from '../../config';
import { fetchRepositories } from './index';
import { integrationConfig, withRecording } from '../../../test/config';
import { fetchAccountDetails } from '../account';

describe('#fetchRepositories', () => {
  test(
    'should collect data',
    withRecording('fetchRepositories', __dirname, async () => {
      const context = createMockStepExecutionContext<IntegrationConfig>({
        instanceConfig: integrationConfig,
      });

      await fetchAccountDetails(context);
      await fetchRepositories(context);

      expect({
        numCollectedEntities: context.jobState.collectedEntities.length,
        numCollectedRelationships:
          context.jobState.collectedRelationships.length,
        collectedEntities: context.jobState.collectedEntities,
        collectedRelationships: context.jobState.collectedRelationships,
        encounteredTypes: context.jobState.encounteredTypes,
      }).toMatchSnapshot();

      const users = context.jobState.collectedEntities.filter((e) =>
        e._class.includes('CodeRepo'),
      );

      expect(users.length).toBeGreaterThan(0);
      expect(users).toMatchGraphObjectSchema({
        _class: ['CodeRepo'],
        schema: {
          additionalProperties: false,
          properties: {
            _type: { const: 'aquasec_repository' },
            _rawData: {
              type: 'array',
              items: { type: 'object' },
            },
            id: { type: 'string' },
            name: { type: 'string' },
          },
        },
      });
    }),
  );
});
