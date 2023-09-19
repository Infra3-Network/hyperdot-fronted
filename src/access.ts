/**
 * @see https://umijs.org/zh-CN/plugins/plugin-access
 * */
export default function access(
  initialState: { currentUser?: HYPERDOT_API.CurrentUser } | undefined,
) {
  const { currentUser } = initialState ?? {};
  return {
    canAccess: currentUser,
  };
  // return {
  //   canAdmin: currentUser && currentUser.access === 'admin',
  // };
}
