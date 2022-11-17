import {
  IntegrationExecutionContext,
  IntegrationProviderAPIError,
} from '@jupiterone/integration-sdk-core';
import { IntegrationConfig } from '../config';
import { AquaSecClient } from './client';

export function createApiClient(
  context: IntegrationExecutionContext<IntegrationConfig>,
) {
  return new AquaSecClient({
    // TODO: Add support for a custom `endpoint`
    apiKey: context.instance.config.apiKey,
    apiSecret: context.instance.config.apiSecret,

    accountId: context.instance.config.accountId,
    accountEmail: context.instance.config.accountEmail,
    accountPassword: context.instance.config.accountPassword,

    handleFailedRequest(response): Error {
      context.logger.info(
        {
          url: response.url,
          status: response.status,
          statusText: response.statusText,
        },
        'Failed to make API request',
      );

      return new IntegrationProviderAPIError({
        endpoint: response.url,
        status: response.status,
        statusText: response.statusText,
        fatal: false,
      });
    },
  });
}
