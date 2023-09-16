// @ts-ignore
/* eslint-disable */
import { request } from 'umi';

/** Login api POST /apis/user/login */
export async function login(body: HYPERDOT_API.LoginParams, options?: { [key: string]: any }) {
  return request('/apis/v1/user/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** Get current logined user GET /apis/user */
export async function getCurrentUser(options?: { [key: string]: any }) {
  return request<{
    data: HYPERDOT_API.CurrentUser;
  }>('/apis/v1/user', {
    method: 'GET',
    ...(options || {}),
  });
}
