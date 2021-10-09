import {
  createIntegrationEntity,
  Entity,
  parseTimePropertyValue,
} from '@jupiterone/integration-sdk-core';
import { AquaSecUser } from '../../aquasec/types';

import { Entities } from '../constants';

export function buildUserEntityKey(data: AquaSecUser) {
  return `aquasec_user:${data.id}`;
}

export function createUserEntity(data: AquaSecUser): Entity {
  return createIntegrationEntity({
    entityData: {
      source: data,
      assign: {
        _key: buildUserEntityKey(data),
        _type: Entities.USER._type,
        _class: Entities.USER._class,
        createdOn: parseTimePropertyValue(data.created),
        id: data.id.toString(),
        name: data.email,
        username: data.email,
        admin: data.account_admin === true,

        // dashboard: data.dashboard,
        // cspRoles: data.csp_roles,
        email: data.email,
        confirmed: data.confirmed,
        passwordReset: data.password_reset,
        sendAnnouncements: data.send_announcements,
        sendScanResults: data.send_scan_results,
        sendNewPlugins: data.send_new_plugins,
        sendNewRisks: data.send_new_risks,
        multiaccount: data.multiaccount,
      },
    },
  });
}
