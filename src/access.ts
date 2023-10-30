import { history } from 'umi';

const guestCanAccessRouteMap = new Map([
  [
    '/explore/dashboards',
    {
      allow: true,
      regexp: /^\/explore\/dashboards(?:\/(\d+))?$/, // match id
    },
  ],
  [
    '/user/login',
    {
      allow: true,
    },
  ],
  [
    '/user/register',
    {
      allow: true,
    },
  ],
]);

export const guestCanAccess = (location: string) => {
  console.log('canAccess ', history.location);

  // first match
  if (guestCanAccessRouteMap.has(location) && guestCanAccessRouteMap.get(location)) {
    return true;
  }

  for (const [key, value] of guestCanAccessRouteMap) {
    if (value.regexp && value.allow && new RegExp(value.regexp).test(location)) {
      return true;
    }
  }

  return false;
};

/**
 * @see https://umijs.org/zh-CN/plugins/plugin-access
 * */
export default function access(
  initialState: { currentUser?: HYPERDOT_API.CurrentUser } | undefined,
) {
  // get location url
  const location = history.location.pathname;
  if (guestCanAccess(location)) {
    return {
      canAccess: true,
    };
  }

  const { currentUser } = initialState ?? {};
  return {
    canAccess: currentUser || guestCanAccess(location),
  };
  // return {
  //   canAdmin: currentUser && currentUser.access === 'admin',
  // };
}
