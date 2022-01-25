import {
  IntegrationExecutionContext,
  IntegrationInstanceConfigFieldMap,
  IntegrationInstanceConfig,
  IntegrationValidationError,
} from '@jupiterone/integration-sdk-core';
import { createApiClient } from './aquasec/jupiterone';

/**
 * A type describing the configuration fields required to execute the
 * integration for a specific account in the data provider.
 *
 * When executing the integration in a development environment, these values may
 * be provided in a `.env` file with environment variables. For example:
 *
 * - `CLIENT_ID=123` becomes `instance.config.clientId = '123'`
 * - `CLIENT_SECRET=abc` becomes `instance.config.clientSecret = 'abc'`
 *
 * Environment variables are NOT used when the integration is executing in a
 * managed environment. For example, in JupiterOne, users configure
 * `instance.config` in a UI.
 */
export const instanceConfigFields: IntegrationInstanceConfigFieldMap = {
  /**
   * NOTE: Aqua calls this an "API Key", but it is essentially an auto-generated
   * API key _name_. The value of this property is _visible_ from the Aqua
   * console. The actual sensitive token is the `apiSecret` described below.
   */
  apiKey: {
    type: 'string',
  },
  apiSecret: {
    type: 'string',
    mask: true,
  },
  accountId: {
    type: 'string',
  },
};

/**
 * Properties provided by the `IntegrationInstance.config`. This reflects the
 * same properties defined by `instanceConfigFields`.
 */
export interface IntegrationConfig extends IntegrationInstanceConfig {
  apiKey: string;
  apiSecret: string;
  accountId: string;
}

export async function validateInvocation(
  context: IntegrationExecutionContext<IntegrationConfig>,
) {
  const { config } = context.instance;

  if (!config.apiKey || !config.apiSecret || !config.accountId) {
    throw new IntegrationValidationError(
      'Config requires all of {apiKey, apiSecret, accountId}',
    );
  }

  const apiClient = createApiClient(context);
  await apiClient.getAccount(config.accountId);
}
