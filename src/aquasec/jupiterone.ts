import {
  IntegrationProviderAPIError,
  IntegrationStepExecutionContext,
} from '@jupiterone/integration-sdk-core';
import { IntegrationConfig } from '../config';
import { AquaSecClient } from './client';

export function createApiClient(
  context: IntegrationStepExecutionContext<IntegrationConfig>,
) {
  return new AquaSecClient({
    // TODO: Add support for a custom `endpoint`
    apiKey: context.instance.config.apiKey,
    apiSecret: context.instance.config.apiSecret,

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
