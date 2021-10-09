import { createMockStepExecutionContext } from '@jupiterone/integration-sdk-testing';

import { IntegrationConfig } from '../../config';
import { fetchUsers } from './index';
import { integrationConfig, withRecording } from '../../../test/config';
import { fetchAccountDetails } from '../account';

describe('#fetchUsers', () => {
  test(
    'should collect data',
    withRecording('fetchUsers', __dirname, async () => {
      const context = createMockStepExecutionContext<IntegrationConfig>({
        instanceConfig: integrationConfig,
      });

      await fetchAccountDetails(context);
      await fetchUsers(context);

      expect({
        numCollectedEntities: context.jobState.collectedEntities.length,
        numCollectedRelationships:
          context.jobState.collectedRelationships.length,
        collectedEntities: context.jobState.collectedEntities,
        collectedRelationships: context.jobState.collectedRelationships,
        encounteredTypes: context.jobState.encounteredTypes,
      }).toMatchSnapshot();

      const users = context.jobState.collectedEntities.filter((e) =>
        e._class.includes('User'),
      );

      expect(users.length).toBeGreaterThan(0);
      expect(users).toMatchGraphObjectSchema({
        _class: ['User'],
        schema: {
          additionalProperties: false,
          properties: {
            _type: { const: 'aquasec_user' },
            _rawData: {
              type: 'array',
              items: { type: 'object' },
            },
            id: { type: 'string' },
            email: { type: 'string' },
            confirmed: { type: 'boolean' },
            passwordReset: { type: 'boolean' },
            sendAnnouncements: { type: 'boolean' },
            sendScanResults: { type: 'boolean' },
            sendNewPlugins: { type: 'boolean' },
            sendNewRisks: { type: 'boolean' },
            admin: { type: 'boolean' },
            created: { type: 'string' },
            multiaccount: { type: 'boolean' },
          },
        },
      });
    }),
  );
});
