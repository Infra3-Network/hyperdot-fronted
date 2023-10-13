// https://umijs.org/config/
import { defineConfig } from 'umi';
import { join } from 'path';
import defaultSettings from './defaultSettings';
import proxy from './proxy';
import MonacoWebpackPlugin from 'monaco-editor-webpack-plugin';
const { REACT_APP_ENV } = process.env;

const chainWebpack = (config: any) => {
  // config.plugin('monaco-editor').use(MonacoWebpackPlugin, [
  //   {
  //     languages: ["mysql"]
  //   }
  // ]);
  config.module
    .rule('svg')
    .test(/\.svg(\?v=\d+\.\d+\.\d+)?$/)
    .use([
      {
        loader: 'babel-loader',
      },
      {
        loader: '@svgr/webpack',
        options: {
          babel: false,
          icon: true,
        },
      },
    ]);

  return config;
};

export default defineConfig({
  chainWebpack,
  hash: true,
  antd: {},
  dva: {
    hmr: true,
  },
  define: {
    REACT_APP_ENV: REACT_APP_ENV,
  },
  layout: {
    // https://umijs.org/zh-CN/plugins/plugin-layout
    locale: true,
    siderWidth: 208,
    ...defaultSettings,
  },
  // https://umijs.org/zh-CN/plugins/plugin-locale
  locale: {
    // default zh-CN
    default: 'zh-CN',
    antd: true,
    // default true, when it is true, will use `navigator.language` overwrite default
    baseNavigator: true,
  },
  dynamicImport: {
    loading: '@ant-design/pro-layout/es/PageLoading',
  },
  targets: {
    ie: 11,
  },
  // umi routes: https://umijs.org/docs/routing
  routes: [
    {
      path: '/user',
      layout: false,
      routes: [
        {
          path: '/user/login',
          layout: false,
          name: 'login',
          component: './user/Login',
        },
        {
          path: '/user',
          redirect: '/user/login',
        },
        {
          name: 'register-result',
          icon: 'smile',
          path: '/user/register-result',
          component: './user/register-result',
        },
        {
          name: 'register',
          icon: 'smile',
          path: '/user/register',
          component: './user/register',
        },
        {
          component: '404',
        },
      ],
    },
    {
      path: '/explore',
      name: 'Discovery',
      icon: 'dashboard',
      routes: [
        {
          path: '/explore',
          icon: 'smile',
          redirect: '/explore/dashboards',
        },
        {
          name: 'Queries',
          icon: 'smile',
          path: '/explore/queries',
          component: './explore/queries',
          hideInMenu: true,
        },
        {
          name: 'Dashboards',
          icon: 'smile',
          path: '/explore/dashboards',
          component: './explore/dashboards',

          hideInMenu: true,
        },
      ],
    },
    {
      path: 'creations',
      name: 'Creations',
      icon: 'dashboard',
      hideInMenu: true,
      routes: [
        {
          name: 'Query detail',
          path: 'queries/:id',
          component: './creations/queries/details',
          hideInMenu: true,
        },
        {
          name: 'New Query',
          icon: 'smile',
          path: 'queries',
          component: './creations/queries',
          hideInMenu: true,
        },

        {
          name: 'Dashboard',
          icon: 'smile',
          path: 'dashboards/:id',
          component: './creations/dashboard',
          hideInMenu: true,
        },
      ],
    },
    {
      path: 'favorites',
      name: 'Favorites',
      icon: 'dashboard',
      hideInMenu: false,
      routes: [
        {
          path: '/favorites',
          icon: 'smile',
          redirect: '/favorites/dashboards',
        },
        {
          name: 'Favorite Queries',
          icon: 'smile',
          path: '/favorites/queries',
          component: './favorites/queries',
          hideInMenu: true,
        },
        {
          name: 'Favorite Dashboards',
          icon: 'smile',
          path: '/favorites/dashboards',
          component: './favorites/dashboards',

          hideInMenu: true,
        },
      ],
    },
    {
      path: 'library',
      name: 'Library',
      icon: 'dashboard',
      hideInMenu: false,
      routes: [
        {
          name: 'Query detail',
          path: 'queries/:id',
          component: './creations/queries/details',
          hideInMenu: true,
        },
        {
          name: 'New Query',
          icon: 'smile',
          path: 'queries',
          component: './creations/queries',
          hideInMenu: true,
        },

        {
          name: 'New Dashboard',
          icon: 'smile',
          path: 'new-dashboard',
          component: './creations/dashboard',
          hideInMenu: true,
        },
      ],
    },
    // {
    //   path: '/dashboard',
    //   name: 'dashboard',
    //   icon: 'dashboard',
    //   routes: [
    //     {
    //       path: '/dashboard',
    //       redirect: '/dashboard/analysis',
    //     },
    //     {
    //       name: 'analysis',
    //       icon: 'smile',
    //       path: '/dashboard/analysis',
    //       component: './dashboard/analysis',
    //     },
    //     {
    //       name: 'monitor',
    //       icon: 'smile',
    //       path: '/dashboard/monitor',
    //       component: './dashboard/monitor',
    //     },
    //     {
    //       name: 'workplace',
    //       icon: 'smile',
    //       path: '/dashboard/workplace',
    //       component: './dashboard/workplace',
    //     },
    //   ],
    // },
    // {
    //   path: '/form',
    //   icon: 'form',
    //   name: 'form',
    //   routes: [
    //     {
    //       path: '/form',
    //       redirect: '/form/basic-form',
    //     },
    //     {
    //       name: 'basic-form',
    //       icon: 'smile',
    //       path: '/form/basic-form',
    //       component: './form/basic-form',
    //     },
    //     {
    //       name: 'step-form',
    //       icon: 'smile',
    //       path: '/form/step-form',
    //       component: './form/step-form',
    //     },
    //     {
    //       name: 'advanced-form',
    //       icon: 'smile',
    //       path: '/form/advanced-form',
    //       component: './form/advanced-form',
    //     },
    //   ],
    // },
    // {
    //   path: '/list',
    //   icon: 'table',
    //   name: 'list',
    //   routes: [
    //     {
    //       path: '/list/search',
    //       name: 'search-list',
    //       component: './list/search',
    //       routes: [
    //         {
    //           path: '/list/search',
    //           redirect: '/list/search/articles',
    //         },
    //         {
    //           name: 'articles',
    //           icon: 'smile',
    //           path: '/list/search/articles',
    //           component: './list/search/articles',
    //         },
    //         {
    //           name: 'projects',
    //           icon: 'smile',
    //           path: '/list/search/projects',
    //           component: './list/search/projects',
    //         },
    //         {
    //           name: 'applications',
    //           icon: 'smile',
    //           path: '/list/search/applications',
    //           component: './list/search/applications',
    //         },
    //       ],
    //     },
    //     {
    //       path: '/list',
    //       redirect: '/list/table-list',
    //     },
    //     {
    //       name: 'table-list',
    //       icon: 'smile',
    //       path: '/list/table-list',
    //       component: './list/table-list',
    //     },
    //     {
    //       name: 'basic-list',
    //       icon: 'smile',
    //       path: '/list/basic-list',
    //       component: './list/basic-list',
    //     },
    //     {
    //       name: 'card-list',
    //       icon: 'smile',
    //       path: '/list/card-list',
    //       component: './list/card-list',
    //     },
    //   ],
    // },
    // {
    //   path: '/profile',
    //   name: 'profile',
    //   icon: 'profile',
    //   routes: [
    //     {
    //       path: '/profile',
    //       redirect: '/profile/basic',
    //     },
    //     {
    //       name: 'basic',
    //       icon: 'smile',
    //       path: '/profile/basic',
    //       component: './profile/basic',
    //     },
    //     {
    //       name: 'advanced',
    //       icon: 'smile',
    //       path: '/profile/advanced',
    //       component: './profile/advanced',
    //     },
    //   ],
    // },
    // {
    //   name: 'result',
    //   icon: 'CheckCircleOutlined',
    //   path: '/result',
    //   routes: [
    //     {
    //       path: '/result',
    //       redirect: '/result/success',
    //     },
    //     {
    //       name: 'success',
    //       icon: 'smile',
    //       path: '/result/success',
    //       component: './result/success',
    //     },
    //     {
    //       name: 'fail',
    //       icon: 'smile',
    //       path: '/result/fail',
    //       component: './result/fail',
    //     },
    //   ],
    // },
    // {
    //   name: 'exception',
    //   icon: 'warning',
    //   path: '/exception',
    //   routes: [
    //     {
    //       path: '/exception',
    //       redirect: '/exception/403',
    //     },
    //     {
    //       name: '403',
    //       icon: 'smile',
    //       path: '/exception/403',
    //       component: './exception/403',
    //     },
    //     {
    //       name: '404',
    //       icon: 'smile',
    //       path: '/exception/404',
    //       component: './exception/404',
    //     },
    //     {
    //       name: '500',
    //       icon: 'smile',
    //       path: '/exception/500',
    //       component: './exception/500',
    //     },
    //   ],
    // },
    {
      name: 'account',
      icon: 'user',
      path: '/account',
      hideInMenu: true,
      routes: [
        {
          path: '/account',
          redirect: '/account/center',
        },
        {
          name: 'user_center',
          icon: 'smile',
          path: '/account/center/:userId',
          component: './account/profile',
          hideInMenu: true,
        },
        {
          name: 'center',
          icon: 'smile',
          path: '/account/center',
          component: './account/profile',
          hideInMenu: true,
        },
        {
          name: 'settings',
          icon: 'smile',
          path: '/account/settings',
          component: './account/settings',
          hideInMenu: true,
        },
      ],
    },
    // {
    //   name: 'editor',
    //   icon: 'highlight',
    //   path: '/editor',
    //   routes: [
    //     {
    //       path: '/editor',
    //       redirect: '/editor/flow',
    //     },
    //     {
    //       name: 'flow',
    //       icon: 'smile',
    //       path: '/editor/flow',
    //       component: './editor/flow',
    //     },
    //     {
    //       name: 'mind',
    //       icon: 'smile',
    //       path: '/editor/mind',
    //       component: './editor/mind',
    //     },
    //     {
    //       name: 'koni',
    //       icon: 'smile',
    //       path: '/editor/koni',
    //       component: './editor/koni',
    //     },
    //   ],
    // },
    {
      path: '/',
      redirect: '/explore',
    },
    {
      component: '404',
    },
  ],
  access: {},
  // Theme for antd: https://ant.design/docs/react/customize-theme-cn
  theme: {
    // 如果不想要 configProvide 动态设置主题需要把这个设置为 default
    // 只有设置为 variable， 才能使用 configProvide 动态设置主色调
    // https://ant.design/docs/react/customize-theme-variable-cn
    'root-entry-name': 'variable',
  },
  // esbuild is father build tools
  // https://umijs.org/plugins/plugin-esbuild
  esbuild: {},
  title: false,
  ignoreMomentLocale: true,
  proxy: proxy[REACT_APP_ENV || 'dev'],
  manifest: {
    basePath: '/',
  },
  // Fast Refresh 热更新
  fastRefresh: {},
  openAPI: [
    {
      requestLibPath: "import { request } from 'umi'",
      // 或者使用在线的版本
      // schemaPath: "https://gw.alipayobjects.com/os/antfincdn/M%24jrzTTYJN/oneapi.json"
      schemaPath: join(__dirname, 'oneapi.json'),
      mock: false,
    },
    {
      requestLibPath: "import { request } from 'umi'",
      schemaPath: 'https://gw.alipayobjects.com/os/antfincdn/CA1dOm%2631B/openapi.json',
      projectName: 'swagger',
    },
  ],
  nodeModulesTransform: {
    type: 'none',
  },
  mfsu: {},
  webpack5: {},
  exportStatic: {},
});
