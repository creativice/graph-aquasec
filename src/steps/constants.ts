import {
  StepEntityMetadata,
  RelationshipClass,
  StepRelationshipMetadata,
} from '@jupiterone/integration-sdk-core';

export const Steps = {
  ACCOUNT: 'fetch-account',
  USERS: 'fetch-users',
  GROUPS: 'fetch-groups',
  API_KEYS: 'fetch-api-keys',
  REPOSITORIES: 'fetch-repositories',
  DETECTIONS: 'fetch-detections'
};

export const Entities: Record<
  'ACCOUNT' | 'USER' | 'GROUP' | 'API_KEY' | 'REPOSITORY' | 'DETECTION',
  StepEntityMetadata
> = {
  ACCOUNT: {
    resourceName: 'Account',
    _type: 'aquasec_account',
    _class: ['Account'],
  },
  USER: {
    resourceName: 'User',
    _type: 'aquasec_user',
    _class: ['User'],
  },
  GROUP: {
    resourceName: 'Group',
    _type: 'aquasec_group',
    _class: ['Group'],
  },
  API_KEY: {
    resourceName: 'API Key',
    _type: 'aquasec_api_key',
    _class: ['AccessKey'],
  },
  REPOSITORY: {
    resourceName: 'Repository',
    _type: 'aquasec_repository',
    _class: ['CodeRepo']
  },
  DETECTION: {
    resourceName: 'Detection',
    _type: 'aquasec_detection',
    _class: ['Finding'],
  },
};

export const Relationships: Record<
  | 'ACCOUNT_HAS_USER'
  | 'ACCOUNT_HAS_GROUP'
  | 'GROUP_HAS_USER'
  | 'ACCOUNT_HAS_API_KEY'
  | 'ACCOUNT_HAS_REPOSITORY'
  | 'REPOSITORY_HAS_DETECTION',
  StepRelationshipMetadata
> = {
  ACCOUNT_HAS_USER: {
    _type: 'aquasec_account_has_user',
    sourceType: Entities.ACCOUNT._type,
    _class: RelationshipClass.HAS,
    targetType: Entities.USER._type,
  },
  ACCOUNT_HAS_GROUP: {
    _type: 'aquasec_account_has_group',
    sourceType: Entities.ACCOUNT._type,
    _class: RelationshipClass.HAS,
    targetType: Entities.GROUP._type,
  },
  GROUP_HAS_USER: {
    _type: 'aquasec_group_has_user',
    sourceType: Entities.GROUP._type,
    _class: RelationshipClass.HAS,
    targetType: Entities.USER._type,
  },
  ACCOUNT_HAS_API_KEY: {
    _type: 'aquasec_account_has_api_key',
    sourceType: Entities.ACCOUNT._type,
    _class: RelationshipClass.HAS,
    targetType: Entities.API_KEY._type,
  },
  ACCOUNT_HAS_REPOSITORY: {
    _type: 'aquasec_account_has_repository',
    sourceType: Entities.ACCOUNT._type,
    _class: RelationshipClass.HAS,
    targetType: Entities.REPOSITORY._type,
  },
  REPOSITORY_HAS_DETECTION: {
    _type: 'aquasec_repository_has_detection',
    sourceType: Entities.REPOSITORY._type,
    _class: RelationshipClass.HAS,
    targetType: Entities.DETECTION._type,
  }
};
