import { createMockStepExecutionContext } from '@jupiterone/integration-sdk-testing';

import { IntegrationConfig } from '../../config';
import { fetchAccountDetails } from './index';
import { integrationConfig, withRecording } from '../../../test/config';

describe('#fetchAccount', () => {
  test(
    'should collect data',
    withRecording('fetchAccount', __dirname, async () => {
      const context = createMockStepExecutionContext<IntegrationConfig>({
        instanceConfig: integrationConfig,
      });

      await fetchAccountDetails(context);

      expect({
        numCollectedEntities: context.jobState.collectedEntities.length,
        numCollectedRelationships:
          context.jobState.collectedRelationships.length,
        collectedEntities: context.jobState.collectedEntities,
        collectedRelationships: context.jobState.collectedRelationships,
        encounteredTypes: context.jobState.encounteredTypes,
      }).toMatchSnapshot();

      const accounts = context.jobState.collectedEntities.filter((e) =>
        e._class.includes('Account'),
      );

      expect(accounts.length).toBeGreaterThan(0);
      expect(accounts).toMatchGraphObjectSchema({
        _class: ['Account'],
        schema: {
          additionalProperties: false,
          properties: {
            _type: { const: 'aquasec_account' },
            _rawData: {
              type: 'array',
              items: { type: 'object' },
            },
            manager: { type: 'string' },
            additionalCredits: { type: 'number' },
            associateTags: { type: 'boolean' },
            awsMarketplaceId: { type: 'string' },
            blockDefaultGroup: { type: 'boolean' },
            createdOn: { type: 'number' },
            cspEnabled: { type: 'boolean' },
            currentPlan: { type: 'number' },
            disableDefaultEmails: { type: 'boolean' },
            displayName: { type: 'string' },
            enforceOauth: { type: 'boolean' },
            globalSuppressionsAdminOnly: { type: 'boolean' },
            id: { type: 'string' },
            integrationsAdminOnly: { type: 'boolean' },
            name: { type: 'string' },
            numAllowedKeys: { type: 'number' },
            presuppressPlugins: { type: 'boolean' },
            rootUser: { type: 'string' },
            source: { type: 'string' },
            stripeId: { type: 'string' },
            suppressionsAdminOnly: { type: 'boolean' },
            trialEnd: { type: 'number' },
            usersAdminOnly: { type: 'boolean' },
          },
        },
      });
    }),
  );
});
