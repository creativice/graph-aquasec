import {
  createIntegrationEntity,
  Entity,
} from '@jupiterone/integration-sdk-core';
import { AquaSecDetection } from '../../aquasec/types';

import { Entities } from '../constants';

function mapSeverityToNumber(severity: string): number {
  switch (severity) {
    case "info":
      return 0;
    case "low":
      return 3;
    case "medium":
      return 6;
    case "high":
      return 8;
    case "critical":
      return 10;
    default:
      return -1;
  }
}

export function buildDetectionEntityKey(data: AquaSecDetection) {
  return `aquasec_detection:${data.avd_id}`;
}

export function createDetectionEntity(data: AquaSecDetection): Entity {
  return createIntegrationEntity({
    entityData: {
      source: data,
      assign: {
        _key: buildDetectionEntityKey(data),
        _type: Entities.DETECTION._type,
        _class: Entities.DETECTION._class,
        name: data.title,
        category: "unknown",
        severity: data.highest_severity,
        numericSeverity: mapSeverityToNumber(data.highest_severity),
        open: true,
      },
    },
  });
}
