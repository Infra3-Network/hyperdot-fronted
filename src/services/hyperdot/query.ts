// @ts-ignore
/* eslint-disable */
import { request } from 'umi';

/** Update an existing pet PUT /pet */
export async function queryRun(body: any, options?: { [key: string]: any }) {
  return request<any>('/apis/v1/query/run', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}
