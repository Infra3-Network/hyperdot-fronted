import { history } from 'umi';

/**
 * @see https://umijs.org/zh-CN/plugins/plugin-access
 * */
export default function access(
  initialState: { currentUser?: HYPERDOT_API.CurrentUser } | undefined,
) {
  return {
    canAdmin: true,
  };
  // get location url
  const location = history.location.pathname;
  // if location match /user/login, return true
  if (location === '/user/reigster') {
    return {
      canRegister: true,
    };
  }
  const { currentUser } = initialState ?? {};
  return {
    canAccess: currentUser,
  };
  // return {
  //   canAdmin: currentUser && currentUser.access === 'admin',
  // };
}
