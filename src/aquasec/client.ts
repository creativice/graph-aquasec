import * as crypto from 'crypto';
import * as qs from 'querystring';
import fetch, { Response } from 'node-fetch';
import { AquaSecAccount, AquaSecGroup, AquaSecUser } from './types';

export interface CreateAquaSecClientParams {
  apiKey: string;
  apiSecret: string;
  endpoint?: string;
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

function getUnixTimestamp(): number {
  return Math.floor(new Date().getTime() / 1000);
}

function withoutUndefinedProperties(
  obj: Record<string, any>,
): Record<string, any> {
  const newObj: Record<string, any> = {};

  for (const key in obj) {
    const val = obj[key];

    if (val !== undefined) {
      newObj[key] = val;
    }
  }

  return newObj;
}

function buildRequestHmacSignature(key: string, chunk: string) {
  const hmac = crypto.createHmac('sha256', key);
  hmac.setEncoding('hex');
  hmac.write(chunk);
  hmac.end();
  return hmac.read();
}

function withQs(path: string, qsParams: any | undefined) {
  return qsParams
    ? `${path}?${qs.stringify(withoutUndefinedProperties(qsParams))}`
    : path;
}

export class AquaSecClient {
  private readonly apiKey: string;
  private readonly apiSecret: string;
  private readonly endpoint: string;
  private readonly handleFailedRequest?: HandleFailedRequestFn;

  constructor(params: CreateAquaSecClientParams) {
    this.apiKey = params.apiKey;
    this.apiSecret = params.apiSecret;
    this.endpoint = params.endpoint || 'https://api.cloudsploit.com';
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
}
