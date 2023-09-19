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

/** create user query POST /apis/v1/user/query */
export async function userCreateQuery(
  body: HYPERDOT_API.UserQuery,
  options?: { [key: string]: any },
) {
  return request<HYPERDOT_API.UserQueryResponse>('/apis/v1/user/query', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** get user query GET /apis/v1/user/query/:id */
export async function getUserQuery(id: number, options?: { [key: string]: any }) {
  return request<HYPERDOT_API.UserQueryResponse>('/apis/v1/user/query/' + id, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    ...(options || {}),
  });
}
