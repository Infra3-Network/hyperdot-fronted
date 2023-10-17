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

export async function getUser(id: number, options?: { [key: string]: any }) {
  return request<HYPERDOT_API.GetUserResponse>('/apis/v1/user/' + id, {
    method: 'GET',
    ...(options || {}),
  });
}

export async function updateUser(body: HYPERDOT_API.CurrentUser, options?: { [key: string]: any }) {
  return request<{
    data: HYPERDOT_API.UpdateUserResponse;
  }>('/apis/v1/user', {
    method: 'PUT',
    data: body,
    ...(options || {}),
  });
}

export async function getFile(filename: string, options?: { [key: string]: any }) {
  return request('/apis/v1/file?file=' + filename, {
    method: 'GEt',
    ...(options || {}),
  });
}

export async function uploadUserAvatar(body: any, options?: { [key: string]: any }) {
  return request<{
    data: HYPERDOT_API.UploadUserAvatarResponse;
  }>('/apis/v1/user/avatar/upload', {
    method: 'POST',
    data: body,
    ...(options || {}),
  });
}

export async function updateUserPassword(
  body: HYPERDOT_API.UpdateUserPasswordRequest,
  options?: { [key: string]: any },
) {
  return request<{
    data: HYPERDOT_API.UpdateUserResponse;
  }>('/apis/v1/user/password', {
    method: 'PUT',
    data: body,
    ...(options || {}),
  });
}

/** run user query GET /apis/v1/user/query/run */
export async function queryRun(query: string, engine: string, options?: { [key: string]: any }) {
  return request<any>('/apis/v1/query/run?q=' + query + '&engine=' + engine, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    ...(options || {}),
  });
}

/** create user query POST /apis/v1/user/query */
export async function createQuery(body: HYPERDOT_API.UserQuery, options?: { [key: string]: any }) {
  return request<HYPERDOT_API.UserQueryResponse>('/apis/v1/query', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** get user query GET /apis/v1/user/query/:id */
export async function getQuery(id: number, options?: { [key: string]: any }) {
  return request<HYPERDOT_API.UserQueryResponse>('/apis/v1/query/' + id, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    ...(options || {}),
  });
}

export async function listQuery(
  page: number,
  pageSize: number,
  userId?: number,
  options?: { [key: string]: any },
) {
  let url = '/apis/v1/query?page=' + page + '&&page_size=' + pageSize;
  if (userId) {
    url += '&user_id=' + userId;
  }
  return request<HYPERDOT_API.ListQueryResponse>(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    ...(options || {}),
  });
}

export async function listFavoriteQuery(
  page: number,
  pageSize: number,
  userId?: number,
  options?: { [key: string]: any },
) {
  let url = '/apis/v1/query/favorite?page=' + page + '&&page_size=' + pageSize;
  if (userId) {
    url += '&user_id=' + userId;
  }
  return request<HYPERDOT_API.ListQueryResponse>(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    ...(options || {}),
  });
}

export async function listUserQuery(
  page: number,
  pageSize: number,
  userId: number,
  options?: { [key: string]: any },
) {
  return request<HYPERDOT_API.ListQueryResponse>(
    '/apis/v1/query/user/' + userId + '?page=' + page + '&&page_size=' + pageSize,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      ...(options || {}),
    },
  );
}

export async function listUserQueryChart(
  page: number,
  pageSize: number,
  userId?: number,
  options?: { [key: string]: any },
) {
  let url = '/apis/v1/query/charts/' + '?page=' + page + '&&page_size=' + pageSize;
  if (userId) {
    url = '/apis/v1/query/charts/user/' + userId + '?page=' + page + '&&page_size=' + pageSize;
  }
  return request<HYPERDOT_API.ListCurrentUserChartResponse>(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    ...(options || {}),
  });
}

export async function getUserQueryChart(
  {
    chart_id,
    query_id,
    user_id,
  }: {
    chart_id: number;
    query_id?: number;
    user_id?: number;
  },
  options?: { [key: string]: any },
) {
  let url = '';
  if (!user_id) {
    url = '/apis/v1/query/chart/' + chart_id;
    if (query_id) {
      url += '?query_id=' + query_id;
    }
  } else {
    url = '/apis/v1/query/chart/' + chart_id + '/user/' + user_id;
    if (query_id) {
      url += '?query_id=' + query_id;
    }
  }
  return request<HYPERDOT_API.GetCurrentUserChartResponse>(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    ...(options || {}),
  });
}

/** update user query PUT /apis/user/query */
export async function updateQuery(body: HYPERDOT_API.UserQuery, options?: { [key: string]: any }) {
  return request<HYPERDOT_API.UserQueryResponse>('/apis/v1/query', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

export async function getDashboard(id: number, options?: { [key: string]: any }) {
  return request<HYPERDOT_API.GetDashboardResponse>('/apis/v1/dashboard/' + id, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    ...(options || {}),
  });
}

export async function listDashboard(
  {
    page,
    pageSize,
    userId,
    order,
    timeRange,
  }: { page: number; pageSize: number; userId?: number; order?: string; timeRange?: string },
  options?: { [key: string]: any },
) {
  let url = `/apis/v1/dashboard?page=${page}&page_size=${pageSize}`;
  if (userId) {
    url += `&user_id=${userId}`;
  }
  if (order) {
    url += `&order=${order}`;
  }
  if (timeRange) {
    url += `&time_range=${timeRange}`;
  }
  console.log('url = ', url);
  return request<HYPERDOT_API.ListDashboardResponse>(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    ...(options || {}),
  });
}

export async function listFavoriteDashboard(
  {
    page,
    pageSize,
    userId,
    order,
    timeRange,
  }: { page: number; pageSize: number; userId?: number; order?: string; timeRange?: string },
  options?: { [key: string]: any },
) {
  let url = `/apis/v1/dashboard/favorite?page=${page}&page_size=${pageSize}`;
  if (userId) {
    url += `&user_id=${userId}`;
  }
  if (order) {
    url += `&order=${order}`;
  }
  if (timeRange) {
    url += `&time_range=${timeRange}`;
  }
  console.log('url = ', url);
  return request<HYPERDOT_API.ListDashboardResponse>(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    ...(options || {}),
  });
}

export async function listDashboardPopularTags(limit?: number, options?: { [key: string]: any }) {
  return request<HYPERDOT_API.ListDashboardPopularTagsResponse>(
    `/apis/v1/dashboard/tag/populars?limit=${limit ? limit : 10}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      ...(options || {}),
    },
  );
}

export async function listUserDashboard(
  page: number,
  pageSize: number,
  userId: number,
  options?: { [key: string]: any },
) {
  return request<HYPERDOT_API.ListDashboardResponse>(
    `/apis/v1/dashboard?user_id=${userId}&page=${page}&page_size=${pageSize}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      ...(options || {}),
    },
  );
}

export async function createDashboard(
  body: HYPERDOT_API.Dashboard,
  options?: { [key: string]: any },
) {
  return request<HYPERDOT_API.CreateDashboardResponse>('/apis/v1/dashboard', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

export async function updateDashboard(
  body: HYPERDOT_API.Dashboard,
  options?: { [key: string]: any },
) {
  return request<HYPERDOT_API.UpdateDashboardResponse>('/apis/v1/dashboard', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

export async function updateFavoriteDashboard(
  star: boolean,
  body: HYPERDOT_API.UserDashboardFavorites,
  options?: { [key: string]: any },
) {
  let url = '/apis/v1/dashboard/favorite';
  if (!star) {
    url = '/apis/v1/dashboard/unfavorite';
  }
  return request<HYPERDOT_API.UpdateUserDashboadFavoritesResponse>(url, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

export async function updateFavoriteQuery(
  star: boolean,
  body: HYPERDOT_API.UserQueryFavorites,
  options?: { [key: string]: any },
) {
  let url = '/apis/v1/query/favorite';
  if (!star) {
    url = '/apis/v1/query/unfavorite';
  }
  return request<HYPERDOT_API.UpdateUserQueryFavoritesResponse>(url, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}
