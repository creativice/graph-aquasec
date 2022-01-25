import { createMockStepExecutionContext } from '@jupiterone/integration-sdk-testing';

import { IntegrationConfig } from '../../config';
import { integrationConfig, withRecording } from '../../../test/config';
import { fetchAccountDetails } from '../account';
import { fetchApiKeys } from '.';

describe('#fetchApiKeys', () => {
  test(
    'should collect data',
    withRecording('fetchApiKeys', __dirname, async () => {
      const context = createMockStepExecutionContext<IntegrationConfig>({
        instanceConfig: integrationConfig,
      });

      await fetchAccountDetails(context);
      await fetchApiKeys(context);

      expect({
        numCollectedEntities: context.jobState.collectedEntities.length,
        numCollectedRelationships:
          context.jobState.collectedRelationships.length,
        collectedEntities: context.jobState.collectedEntities,
        collectedRelationships: context.jobState.collectedRelationships,
        encounteredTypes: context.jobState.encounteredTypes,
      }).toMatchSnapshot();

      const apiKeyEntities = context.jobState.collectedEntities.filter((e) =>
        e._class.includes('AccessKey'),
      );

      expect(apiKeyEntities.length).toBeGreaterThan(0);
      expect(apiKeyEntities).toMatchGraphObjectSchema({
        _class: ['AccessKey'],
        schema: {
          additionalProperties: false,
          properties: {
            _type: { const: 'aquasec_api_key' },
            _rawData: {
              type: 'array',
              items: { type: 'object' },
            },
            id: { type: 'string' },
            name: { type: 'string' },
            description: { type: 'string' },
            whitelisted: { type: 'boolean' },
            scansPerMonth: { type: 'number' },
            accountId: { type: 'number' },
            groupId: { type: 'number' },
            iacToken: { type: 'boolean' },
            ipAddresses: {
              type: 'array',
              items: { type: 'string' },
            },
          },
        },
      });
    }),
  );
});
