import {
  createIntegrationEntity,
  Entity,
  parseTimePropertyValue,
} from '@jupiterone/integration-sdk-core';
import { AquaSecGroup } from '../../aquasec/types';

import { Entities } from '../constants';

export function buildGroupEntityKey(data: AquaSecGroup) {
  return `aquasec_group:${data.id}`;
}

export function createGroupEntity(data: AquaSecGroup): Entity {
  return createIntegrationEntity({
    entityData: {
      source: data,
      assign: {
        _key: buildGroupEntityKey(data),
        _type: Entities.GROUP._type,
        _class: Entities.GROUP._class,
        createdOn: parseTimePropertyValue(data.created),
        id: data.id.toString(),
        name: data.name,
      },
    },
  });
}
