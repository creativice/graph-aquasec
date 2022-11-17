import * as crypto from 'crypto';
import * as qs from 'querystring';

export function getUnixTimestamp(): number {
  return Math.floor(new Date().getTime() / 1000);
}

export function withoutUndefinedProperties(
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

export function buildRequestHmacSignature(key: string, chunk: string) {
  const hmac = crypto.createHmac('sha256', key);
  hmac.setEncoding('hex');
  hmac.write(chunk);
  hmac.end();
  return hmac.read();
}

export function withQs(path: string, qsParams: any | undefined) {
  return qsParams
    ? `${path}?${qs.stringify(withoutUndefinedProperties(qsParams))}`
    : path;
}