import { Request, Response } from 'express';
import queryData from './query.data.json';
const waitTime = (time: number = 100) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, time);
  });
};

async function getFakeCaptcha(req: Request, res: Response) {
  await waitTime(2000);
  return res.json('captcha-xxx');
}

const { ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION } = process.env;

/**
 * 当前用户的权限，如果为空代表没登录
 * current user access， if is '', user need login
 * 如果是 pro 的预览，默认是有权限的
 */
let access = ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION === 'site' ? 'admin' : '';

const getAccess = () => {
  return true;
};

// 代码中会兼容本地 service mock 以及部署站点的静态数据
export default {
  'GET /apis/v1/user': (_: Request, res: Response) => {
    if (!getAccess()) {
      res.status(401).send({
        data: {
          isLogin: false,
        },
        errorCode: '401',
        errorMessage: 'please login',
        success: true,
      });
      return;
    }
    res.send({
      success: true,
      errorMessage: '',
      errorCode: 0,
      data: {
        id: '1',
        uid: '',
        username: 'momo',
        encrypted_password: '$2a$10$2ElaYKIEpUwZncBUxp7CAeQQjiMoVztuMOAxsiIjPcZziKFcgHUMq',
        email: 'momo@outlook.com',
        bio: 'Peace and Love',
        icon_url: '',
        twitter: 'momo',
        github: 'momo',
        telgram: 'momo',
        discord: 'momo',
        location: 'San Fancisico. CA',
        confirmed_at: null,
        created_at: '2023-11-14T10:04:24.424828+08:00',
        updated_at: '2023-12-20T10:08:48.630839+08:00',
        stars: 100,
        queries: 100,
        dashboards: 100,
      },
    });
  },

  'POST /apis/v1/user/auth/login': (_: Request, res: Response) => {
    res.send({
      data: {
        algorithm: 'HS256',
        token:
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxLCJwcm92aWRlciI6InBhc3N3b3JkIiwidXNlcm5hbWUiOiJtb21vIiwiaXNzIjoiaHlwZXJkb3QiLCJzdWIiOiJoeXBlcmRvdC1mcm9udGVkIiwiZXhwIjoxNzAzMDQyNzI4fQ.ASqgjTvDxVdAgvrbn8VGP4hoireWwj3fgNgwiTFk7Pw',
      },
      success: true,
    });
  },

  'POST /apis/v1/user/auth/createAccount': (_: Request, res: Response) => {
    res.send({ success: true });
  },

  'GET /apis/v1/system/engines': (_: Request, res: Response) => {
    res.send({
      data: [
        {
          name: 'Bigquery',
          datasets: {
            Bigquery: {
              id: 'raw',
              title: 'Raw',
              description: 'Raw blockchain crypto data',
            },
          },
        },
      ],
      success: true,
    });
  },

  'POST /apis/v1/query/run': (_: Request, res: Response) => {
    res.send(queryData);
  },

  'POST /apis/v1/query': (_: Request, res: Response) => {
    res.send({
      success: true,
      errorMessage: '',
      errorCode: 0,
      data: {
        id: 1,
        user_id: 1,
        name: 'unsaved',
        description: '',
        query:
          'SELECT\r\n  author_ss58 AS `Author`,\r\n  number AS `Block Number`,\r\n  `hash` AS `Block Hash`,\r\n  block_time AS `Block Time`,\r\nFROM\r\n  `bigquery-public-data.crypto_polkadot.blocks0`\r\nWHERE\r\n  DATE(block_time) \u003e= "2023-11-02"\r\n  AND DATE(block_time) \u003c= "2023-11-09"\r\nLIMIT 100',
        query_engine: 'bigquery',
        is_privacy: false,
        unsaved: true,
        stars: 0,
        charts: null,
        created_at: '2023-12-19T14:48:29.27016655+08:00',
        updated_at: '2023-12-19T14:48:29.270166625+08:00',
      },
    });
  },

  'GET /apis/v1/query': (_: Request, res: Response) => {
    res.send({
      data: {
        queries: [
          {
            created_at: '2023-12-18T14:44:30.69144+08:00',
            description: '',
            email: 'momo@outlook.com',
            favorites_count: 0,
            icon_url: '',
            id: 1,
            is_privacy: false,
            name: 'Test1',
            query:
              'SELECT\r\n  author_ss58 AS `Author`,\r\n  number AS `Block Number`,\r\n  `hash` AS `Block Hash`,\r\n  block_time AS `Block Time`,\r\nFROM\r\n  `bigquery-public-data.crypto_polkadot.blocks0`\r\nWHERE\r\n  DATE(block_time) \u003e= "2023-11-02"\r\n  AND DATE(block_time) \u003c= "2023-11-09"\r\nLIMIT 100',
            query_engine: 'bigquery',
            stared: null,
            stars: 0,
            unsaved: false,
            updated_at: '2023-12-18T14:44:44.954313+08:00',
            user_id: 1,
            username: 'momo1',
          },
          {
            created_at: '2023-12-19T14:38:36.193029+08:00',
            description: '',
            email: 'momo@outlook.com',
            favorites_count: 0,
            icon_url: '',
            id: 2,
            is_privacy: false,
            name: 'Test2',
            query:
              'SELECT\r\n  author_ss58 AS `Author`,\r\n  number AS `Block Number`,\r\n  `hash` AS `Block Hash`,\r\n  block_time AS `Block Time`,\r\nFROM\r\n  `bigquery-public-data.crypto_polkadot.blocks0`\r\nWHERE\r\n  DATE(block_time) \u003e= "2023-11-02"\r\n  AND DATE(block_time) \u003c= "2023-11-09"\r\nLIMIT 100',
            query_engine: 'bigquery',
            stared: null,
            stars: 0,
            unsaved: true,
            updated_at: '2023-12-19T14:38:36.193029+08:00',
            user_id: 1,
            username: 'momo',
          },
        ],
        total: 2,
      },
      success: true,
    });
  },

  'GET /apis/v1/query/1': (_: Request, res: Response) => {
    res.send({
      success: true,
      errorMessage: '',
      errorCode: 0,
      data: {
        id: 1,
        user_id: 1,
        name: 'Test1',
        description: '',
        query:
          'SELECT\r\n  author_ss58 AS `Author`,\r\n  number AS `Block Number`,\r\n  `hash` AS `Block Hash`,\r\n  block_time AS `Block Time`,\r\nFROM\r\n  `bigquery-public-data.crypto_polkadot.blocks0`\r\nWHERE\r\n  DATE(block_time) \u003e= "2023-11-02"\r\n  AND DATE(block_time) \u003c= "2023-11-09"\r\nLIMIT 100',
        query_engine: 'bigquery',
        is_privacy: false,
        unsaved: true,
        stars: 0,
        charts: [],
        created_at: '2023-12-19T14:48:29.270166+08:00',
        updated_at: '2023-12-19T14:48:29.270166+08:00',
      },
    });
  },

  'GET /apis/v1/query/2': (_: Request, res: Response) => {
    res.send({
      success: true,
      errorMessage: '',
      errorCode: 0,
      data: {
        id: 2,
        user_id: 1,
        name: 'Test2',
        description: '',
        query:
          'SELECT\r\n  author_ss58 AS `Author`,\r\n  number AS `Block Number`,\r\n  `hash` AS `Block Hash`,\r\n  block_time AS `Block Time`,\r\nFROM\r\n  `bigquery-public-data.crypto_polkadot.blocks0`\r\nWHERE\r\n  DATE(block_time) \u003e= "2023-11-02"\r\n  AND DATE(block_time) \u003c= "2023-11-09"\r\nLIMIT 100',
        query_engine: 'bigquery',
        is_privacy: false,
        unsaved: true,
        stars: 0,
        charts: [],
        created_at: '2023-12-19T14:48:29.270166+08:00',
        updated_at: '2023-12-19T14:48:29.270166+08:00',
      },
    });
  },

  'POST /apis/v1/dashboard': (_: Request, res: Response) => {
    res.send({
      success: true,
      errorMessage: '',
      errorCode: 0,
      data: {
        id: 1,
        user_id: 1,
        name: 'test',
        description: 'test',
        is_privacy: false,
        tags: '',
        panels: [],
        created_At: '2023-12-19T17:27:54.404957+08:00',
        updated_At: '2023-12-19T17:27:54.405+08:00',
        deleted_at: '0001-01-01T08:05:43+08:05',
      },
    });
  },

  'GET /apis/v1/dashboard': (_: Request, res: Response) => {
    res.send({
      data: {
        dashboards: [
          {
            created_at: '2023-12-19T17:27:54.404957+08:00',
            deleted_at: '0001-01-01T08:05:43+08:05',
            description: 'bbb',
            email: 'momo@outlook.com',
            favorites_count: 0,
            icon_url: '',
            id: 1,
            is_privacy: false,
            name: 'Test1',
            stared: null,
            tags: '',
            updated_at: '2023-12-19T17:27:54.405+08:00',
            user_id: 1,
            username: 'momo',
          },
          {
            created_at: '2023-11-14T10:19:55.530011+08:00',
            deleted_at: '0001-01-01T08:06:26+08:05',
            description: '11-02 ~ 11-09',
            email: 'yuanchang.xu@outlook.com',
            favorites_count: 0,
            icon_url: '',
            id: 2,
            is_privacy: false,
            name: 'Test2',
            stared: null,
            tags: '',
            updated_at: '2023-11-14T10:30:54.803191+08:00',
            user_id: 2,
            username: 'Jackson',
          },
        ],
        total: 2,
      },
      success: true,
    });
  },

  'GET /apis/v1/dashboard/1': (_: Request, res: Response) => {
    res.send({
      success: true,
      errorMessage: '',
      errorCode: 0,
      data: {
        id: 1,
        user_id: 1,
        name: 'Test1',
        description: 'Test1',
        is_privacy: false,
        tags: '',
        panels: [],
        created_At: '2023-12-19T16:38:10.141447+08:00',
        updated_At: '2023-12-19T16:38:10.141503+08:00',
        deleted_at: '0001-01-01T08:05:43+08:05',
      },
    });
  },

  'GET /apis/v1/dashboard/2': (_: Request, res: Response) => {
    res.send({
      success: true,
      errorMessage: '',
      errorCode: 0,
      data: {
        id: 2,
        user_id: 1,
        name: 'Test2',
        description: 'Test2',
        is_privacy: false,
        tags: '',
        panels: [],
        created_At: '2023-12-19T16:38:10.141447+08:00',
        updated_At: '2023-12-19T16:38:10.141503+08:00',
        deleted_at: '0001-01-01T08:05:43+08:05',
      },
    });
  },

  // GET POST 可省略
  'GET /api/users': [
    {
      key: '1',
      name: 'John Brown',
      age: 32,
      address: 'New York No. 1 Lake Park',
    },
    {
      key: '2',
      name: 'Jim Green',
      age: 42,
      address: 'London No. 1 Lake Park',
    },
    {
      key: '3',
      name: 'Joe Black',
      age: 32,
      address: 'Sidney No. 1 Lake Park',
    },
  ],
  'POST /api/login/account': async (req: Request, res: Response) => {
    const { password, username, type } = req.body;
    await waitTime(2000);
    if (password === 'ant.design' && username === 'admin') {
      res.send({
        status: 'ok',
        type,
        currentAuthority: 'admin',
      });
      access = 'admin';
      return;
    }
    if (password === 'ant.design' && username === 'user') {
      res.send({
        status: 'ok',
        type,
        currentAuthority: 'user',
      });
      access = 'user';
      return;
    }
    if (type === 'mobile') {
      res.send({
        status: 'ok',
        type,
        currentAuthority: 'admin',
      });
      access = 'admin';
      return;
    }

    res.send({
      status: 'error',
      type,
      currentAuthority: 'guest',
    });
    access = 'guest';
  },
  'POST /api/login/outLogin': (req: Request, res: Response) => {
    access = '';
    res.send({ data: {}, success: true });
  },

  'GET /apis/500': (req: Request, res: Response) => {
    res.status(500).send({
      timestamp: 1513932555104,
      status: 500,
      error: 'error',
      message: 'error',
      path: '/base/category/list',
    });
  },
  'GET /api/404': (req: Request, res: Response) => {
    res.status(404).send({
      timestamp: 1513932643431,
      status: 404,
      error: 'Not Found',
      message: 'No message available',
      path: '/base/category/list/2121212',
    });
  },
  'GET /api/403': (req: Request, res: Response) => {
    res.status(403).send({
      timestamp: 1513932555104,
      status: 403,
      error: 'Forbidden',
      message: 'Forbidden',
      path: '/base/category/list',
    });
  },
  'GET /api/401': (req: Request, res: Response) => {
    res.status(401).send({
      timestamp: 1513932555104,
      status: 401,
      error: 'Unauthorized',
      message: 'Unauthorized',
      path: '/base/category/list',
    });
  },

  'GET  /api/login/captcha': getFakeCaptcha,
};
