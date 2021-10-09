import {
  setupRecording,
  SetupRecordingInput,
} from '@jupiterone/integration-sdk-testing';
import * as dotenv from 'dotenv';
import * as path from 'path';
import { IntegrationConfig } from '../src/config';

if (process.env.LOAD_ENV) {
  dotenv.config({
    path: path.join(__dirname, '../.env'),
  });
}

const DEFAULT_API_KEY = 'dummy-api-key';
const DEFAULT_API_SECRET = 'dummy-api-secret';
const DEFAULT_ACCOUNT_ID = '10630';

export const integrationConfig: IntegrationConfig = {
  apiKey: process.env.API_KEY || DEFAULT_API_KEY,
  apiSecret: process.env.API_SECRET || DEFAULT_API_SECRET,
  accountId: process.env.ACCOUNT_ID || DEFAULT_ACCOUNT_ID,
};

export function withRecording(
  recordingName: string,
  directoryName: string,
  cb: () => Promise<void>,
  options?: SetupRecordingInput['options'],
) {
  return async () => {
    const recording = setupRecording({
      directory: directoryName,
      name: recordingName,
      redactedRequestHeaders: ['x-api-key', 'x-signature', 'x-timestamp'],
      options: {
        ...(options || {}),
      },
    });

    try {
      await cb();
    } finally {
      await recording.stop();
    }
  };
}
