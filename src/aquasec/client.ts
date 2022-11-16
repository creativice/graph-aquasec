import fetch, { Response } from 'node-fetch';

import {
  AquaSecAccount,
  AquaSecApiKey,
  AquaSecAuth,
  AquaSecDetection,
  AquaSecDetectionInstance,
  AquaSecDetectionInstancesResponse,
  AquaSecDetectionsResponse,
  AquaSecGroup,
  AquaSecPage,
  AquaSecRepositoriesResponse,
  AquaSecRepository,
  AquaSecUser,
} from './types';
import { buildRequestHmacSignature, getUnixTimestamp, withQs } from '../util/misc';

export type ResourceIteratee<T> = (each: T) => Promise<void>;

export interface CreateAquaSecClientParams {
  apiKey: string;
  apiSecret: string;
  endpoint?: string;
  accountId: string;
  accountEmail: string;
  accountPassword: string;
  handleFailedRequest?: HandleFailedRequestFn;
}

export type RequestSignatureData = {
  signature: string;
  timestamp: number;
};

export type RequestParams = {
  method: string;
  path: string;
  qsParams?: Record<string, any>;
};

type HandleFailedRequestFn = (response: Response) => Error;

interface PaginatedApiParams {
  limit?: number;
  offset?: number;
  expandGroups?: boolean;
}

export class AquaSecClient {
  private readonly apiKey: string;
  private readonly apiSecret: string;
  private readonly endpoint: string;
  private readonly accountId: string;
  private readonly accountEmail: string;
  private readonly accountPassword: string;
  private readonly handleFailedRequest?: HandleFailedRequestFn;
  private bearerToken?: string;

  constructor(params: CreateAquaSecClientParams) {
    this.apiKey = params.apiKey;
    this.apiSecret = params.apiSecret;
    this.endpoint = params.endpoint || 'https://api.cloudsploit.com';
    this.accountId = params.accountId;
    this.accountEmail = params.accountEmail;
    this.accountPassword = params.accountPassword;
    this.handleFailedRequest = params.handleFailedRequest;
  }

  private buildRequestSignatureData(
    requestMethod: string,
    requestPath: string,
  ): RequestSignatureData {
    const timestamp = getUnixTimestamp();
    const chunk = timestamp + requestMethod + requestPath;

    return {
      signature: buildRequestHmacSignature(this.apiSecret, chunk),
      timestamp,
    };
  }

  private buildRequestHeaders(requestMethod: string, requestPath: string) {
    const { signature, timestamp } = this.buildRequestSignatureData(
      requestMethod,
      requestPath,
    );

    return {
      Accept: 'application/json',
      'X-API-Key': this.apiKey,
      'X-Signature': signature,
      'X-Timestamp': timestamp.toString(),
      'Content-Type': 'application/json',
    };
  }

  async request<T>(params: RequestParams): Promise<T> {
    const { path, method, qsParams } = params;

    const response = await fetch(withQs(`${this.endpoint}${path}`, qsParams), {
      method,
      headers: this.buildRequestHeaders(method, path),
    });

    if (response.ok) {
      const result = await response.json();
      return result.data;
    }

    // TODO: Add retry logic for specific status codes
    if (this.handleFailedRequest) {
      throw this.handleFailedRequest(response);
    } else {
      // TODO: Improve this generic error
      throw new Error(
        `Failed to make AquaSec request (url=${response.url}, status=${response.status}, statusText=${response.statusText})`,
      );
    }
  }

  private async isBearerTokenExpired(): Promise<boolean> {
    const response = await fetch(`${this.endpoint}/v2/accounts/${this.accountId}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${this.bearerToken}`,
      }
    });

    return !response.ok;
  }

  private async signInWithEmailAndPassword(): Promise<void> {
    if (!this.bearerToken || await this.isBearerTokenExpired()) {
      const response = await fetch(`${this.endpoint}/v2/signin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: this.accountEmail,
          password: this.accountPassword,
        })
      });

      if (response.ok) {
        const body: AquaSecAuth = await response.json();
        this.bearerToken = body.data.token;

        return;
      }

      if (this.handleFailedRequest) {
        throw this.handleFailedRequest(response);
      } else {
        // TODO: Improve this generic error
        throw new Error(
          `Failed to make AquaSec request (url=${response.url}, status=${response.status}, statusText=${response.statusText})`,
        );
      }
    }
  }

  private async bearerTokenRequest<T>(path: string, opts?: {
    page: number;
  }): Promise<T> {
    await this.signInWithEmailAndPassword();

    const response = await fetch(`https://api.aquasec.com${path}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${this.bearerToken}`,
        'Content-Type': 'application/json',
      }
    });

    if (response.ok) {
      return response.json();
    }

    // TODO: Add retry logic for specific status codes
    if (this.handleFailedRequest) {
      throw this.handleFailedRequest(response);
    } else {
      // TODO: Improve this generic error
      throw new Error(
        `Failed to make AquaSec request (url=${response.url}, status=${response.status}, statusText=${response.statusText})`,
      );
    }
  }

  private async paginatedRequest<S, T extends AquaSecPage<S>>(path: string, iteratee: ResourceIteratee<T>): Promise<void> {
    let page = 1,
      processed = 0,
      totalCount = 0;

    do {
      const response: T = await this.bearerTokenRequest(path, {
        page
      });

      await iteratee(response);

      totalCount = response.total_count;
      processed += response.returned_count;
      page += 1;
    } while (totalCount > processed);
  }

  async getAccount(accountId: string): Promise<AquaSecAccount> {
    return this.request({
      method: 'GET',
      path: `/v2/accounts/${accountId}`,
    });
  }

  async listGroups(params?: PaginatedApiParams): Promise<AquaSecGroup[]> {
    return this.request({
      method: 'GET',
      path: `/v2/groups`,
      qsParams: params,
    });
  }

  async listUsers(params?: PaginatedApiParams): Promise<AquaSecUser[]> {
    const requestParams: Record<string, any> = {
      limit: params?.limit,
      offset: params?.offset,
    };

    if (params?.expandGroups) {
      requestParams.expand = 'group';
    }

    return this.request({
      method: 'GET',
      path: `/v2/users`,
      qsParams: requestParams,
    });
  }

  async listApiKeys(params?: PaginatedApiParams): Promise<AquaSecApiKey[]> {
    return this.request({
      method: 'GET',
      path: `/v2/apikeys`,
      qsParams: params,
    });
  }

  async iterateRepositories(iteratee: ResourceIteratee<AquaSecRepository>): Promise<void> {
    await this.paginatedRequest('/v2/build/repositories', async (res: AquaSecRepositoriesResponse) => {
      for (const repository of res.data) {
        await iteratee(repository);
      }
    });
  }

  async iterateDetections(iteratee: ResourceIteratee<AquaSecDetection>): Promise<void> {
    await this.paginatedRequest('/v2/build/detections', async (res: AquaSecDetectionsResponse) => {
      for (const detection of res.data) {
        await iteratee(detection);
      }
    });
  }

  async iterateDetectionInstances(avdId: string, iteratee: ResourceIteratee<AquaSecDetectionInstance>): Promise<void> {
    await this.paginatedRequest(`/v2/build/detections/${avdId}/instances`, async (res: AquaSecDetectionInstancesResponse) => {
      for (const instance of res.data) {
        await iteratee(instance);
      }
    });
  }
}
