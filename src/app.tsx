import type { Settings as LayoutSettings } from '@ant-design/pro-layout';
import { SettingDrawer } from '@ant-design/pro-layout';
import { PageLoading } from '@ant-design/pro-layout';
import type { RequestConfig, RunTimeLayoutConfig } from 'umi';
import { history, Link } from 'umi';
import RightContent from '@/components/RightContent';
import Footer from '@/components/Footer';
import { getCurrentUser } from './services/hyperdot/api';
import defaultSettings from '../config/defaultSettings';
import CreationDropdownMenu from './pages/creations/components/Menu';
import { guestCanAccess } from './access';

const isDev = process.env.NODE_ENV === 'development';
const loginPath = '/user/login';
const registerPath = '/user/register';

/** 获取用户信息比较慢的时候会展示一个 loading */
export const initialStateConfig = {
  loading: <PageLoading />,
};

/**
 * @see  https://umijs.org/zh-CN/plugins/plugin-initial-state
 * */
export async function getInitialState(): Promise<{
  settings?: Partial<LayoutSettings>;
  currentUser?: HYPERDOT_API.CurrentUser;
  loading?: boolean;
  fetchUserInfo?: () => Promise<HYPERDOT_API.CurrentUser | undefined>;
  CreationDashboardModalOpen: boolean;
}> {
  const fetchUserInfo = async () => {
    try {
      const msg = await getCurrentUser();
      return msg.data;
    } catch (error) {
      history.push(loginPath);
    }
    return undefined;
  };
  // 如果不是登录页面，执行
  if (history.location.pathname !== loginPath && history.location.pathname !== registerPath) {
    const currentUser = await fetchUserInfo();
    return {
      fetchUserInfo,
      currentUser,
      settings: defaultSettings,
    };
  }

  return {
    fetchUserInfo,
    settings: defaultSettings,
    CreationDashboardModalOpen: false,
  };
}

// ProLayout 支持的api https://procomponents.ant.design/components/layout
export const layout: RunTimeLayoutConfig = ({ initialState, setInitialState }) => {
  return {
    logo: null,
    rightContentRender: () => <RightContent />,
    disableContentMargin: false,
    waterMarkProps: {
      content: initialState?.currentUser?.name,
    },
    footerRender: () => <Footer />,
    onPageChange: () => {
      const { location } = history;
      // 如果没有登录，重定向到 login
      if (!initialState?.currentUser && !guestCanAccess(location.pathname)) {
        history.push(loginPath);
      }
    },
    links: isDev
      ? [
          // <Link key="openapi" to="/umi/plugin/openapi" target="_blank">
          //   <LinkOutlined />
          //   <span>OpenAPI 文档</span>
          // </Link>,
          // <Link to="/~docs" key="docs">
          //   <BookOutlined />
          //   <span>业务组件文档</span>
          // </Link>,
        ]
      : [],
    // headerContentRender(props, defaultDom) {
    //   console.log(props)
    //   return (
    //     <Menu mode="horizontal" items={props.route.routes} />
    //   )
    // },
    // headerContentRender: (props, dom) => {
    //   console.log(props)
    //   console.log(props.items)
    //   console.log(dom)
    // },
    headerHeight: 32,
    headerContentRender: (props, defaultDom) => {
      return (
        <div style={{ display: 'flex', justifyContent: 'start', alignItems: 'center' }}>
          {defaultDom}
          /
          <CreationDropdownMenu />
        </div>
      );
    },
    menuHeaderRender: undefined,
    menuItemRender: (item, dom) => {
      return <Link to={item.path || '/'}>{dom}</Link>;
    },

    // 自定义 403 页面
    // unAccessible: <div>unAccessible</div>,
    // 增加一个 loading 的状态
    childrenRender: (children, props) => {
      // if (initialState?.loading) return <PageLoading />;
      return (
        <>
          {children}
          {!props.location?.pathname?.includes('/login') && (
            <SettingDrawer
              disableUrlParams
              enableDarkTheme
              settings={initialState?.settings}
              onSettingChange={(settings) => {
                setInitialState((preInitialState) => ({
                  ...preInitialState,
                  settings,
                }));
              }}
            />
          )}
        </>
      );
    },
    ...initialState?.settings,
  };
};

// interface ResponseStructure {
//   success: boolean;
//   data: any;
//   errorCode?: number;
//   errorMessage?: string;
// }

export const request: RequestConfig = {
  // timeout: 1000,
  // headers: { 'X-Requested-With': 'XMLHttpRequest' },
  // errorConfig: {},
  // errorHandler: (error: any) => {
  //   console.log(error);
  // },
  requestInterceptors: [
    (url, options) => {
      const location = history.location.pathname;
      // if (guestCanAccess(location)) {
      //   console.log('canAccess', location)
      //   return {
      //     url: url,
      //     options: { ...options, interceptors: false },
      //   };
      // }
      const token = localStorage.getItem('token');
      if (token === null && location !== registerPath && location !== loginPath) {
        history.replace({
          pathname: '/user/login',
        });
        return;
      }
      const authHeader = { Authorization: `${token}` };
      return {
        url: url,
        options: { ...options, interceptors: true, headers: authHeader },
      };
    },
  ],
};
