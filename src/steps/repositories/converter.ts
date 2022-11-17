import {
  createIntegrationEntity,
  Entity,
} from '@jupiterone/integration-sdk-core';
import { AquaSecRepository } from '../../aquasec/types';

import { Entities } from '../constants';

export function buildRepositoryEntityKey(id: string) {
  return `aquasec_repository:${id}`;
}

export function createRepositoryEntity(data: AquaSecRepository): Entity {
  return createIntegrationEntity({
    entityData: {
      source: data,
      assign: {
        _key: buildRepositoryEntityKey(data.repository_id),
        _type: Entities.REPOSITORY._type,
        _class: Entities.REPOSITORY._class,
        id: data.repository_id,
        name: data.name,
      },
    },
  });
}
