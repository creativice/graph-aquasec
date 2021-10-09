import { createMockStepExecutionContext } from '@jupiterone/integration-sdk-testing';

import { IntegrationConfig } from '../../config';
import { integrationConfig, withRecording } from '../../../test/config';
import { fetchAccountDetails } from '../account';
import { fetchGroups } from '../groups';

describe('#fetchGroups', () => {
  test(
    'should collect data',
    withRecording('fetchGroups', __dirname, async () => {
      const context = createMockStepExecutionContext<IntegrationConfig>({
        instanceConfig: integrationConfig,
      });

      await fetchAccountDetails(context);
      await fetchGroups(context);

      expect({
        numCollectedEntities: context.jobState.collectedEntities.length,
        numCollectedRelationships:
          context.jobState.collectedRelationships.length,
        collectedEntities: context.jobState.collectedEntities,
        collectedRelationships: context.jobState.collectedRelationships,
        encounteredTypes: context.jobState.encounteredTypes,
      }).toMatchSnapshot();

      const groups = context.jobState.collectedEntities.filter((e) =>
        e._class.includes('Group'),
      );

      expect(groups.length).toBeGreaterThan(0);
      expect(groups).toMatchGraphObjectSchema({
        _class: ['Group'],
        schema: {
          additionalProperties: false,
          properties: {
            _type: { const: 'aquasec_group' },
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
