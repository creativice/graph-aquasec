import {
  createIntegrationEntity,
  Entity,
  parseTimePropertyValue,
} from '@jupiterone/integration-sdk-core';
import { AquaSecApiKey } from '../../aquasec/types';

import { Entities } from '../constants';

export function buildApiKeyEntityKey(data: AquaSecApiKey) {
  return `aquasec_api_key:${data.id}`;
}

export function createApiKeyEntity(data: AquaSecApiKey): Entity {
  return createIntegrationEntity({
    entityData: {
      source: data,
      assign: {
        _key: buildApiKeyEntityKey(data),
        _type: Entities.API_KEY._type,
        _class: Entities.API_KEY._class,
        createdOn: parseTimePropertyValue(data.created),
        id: data.id.toString(),
        name: data.access_key,
        description: data.description || undefined,
        whitelisted: data.whitelisted,
        scansPerMonth: data.scans_per_month,
        accountId: data.account_id,
        groupId: data.group_id || undefined,
        iacToken: data.iac_token,
        ipAddresses: data.ip_addresses || undefined,
      },
    },
  });
}
