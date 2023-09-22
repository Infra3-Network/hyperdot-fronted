import { HYPERDOT_CHART } from '@/components/Charts/typings';

declare namespace HYPERDOT_API {
  type BaseResponse = {
    success: boolean;
    errorMessage?: string;
    errorCode?: int;
    data?: any;
  };

  type CurrentUser = {
    id: number;
    provider: string;
    uid?: string;
    username?: string;
    email?: string;
    // userid?: string;
    // email?: string;
    // signature?: string;
    // title?: string;
    // group?: string;
    // tags?: { key?: string; label?: string }[];
    // notifyCount?: number;
    // unreadCount?: number;
    // country?: string;
    // access?: string;
    // geographic?: {
    //   province?: { label?: string; key?: string };
    //   city?: { label?: string; key?: string };
    // };
    // address?: string;
    // phone?: string;
  };

  type LoginParams = {
    userId?: string;
    email?: string;
    provider: string;
    password?: string;
    autoLogin?: boolean;
  };

  type LoginResult = {
    success: boolean;
    errorMessage?: string;
    errorCode?: int;
    data?: any;
  };

  type UserQuery = {
    id?: number;
    userId?: number;
    name?: string;
    query: string;
    queryEngine: string;
    isPrivacy?: boolean;
    unsaved?: boolean;
    charts?: HYPERDOT_CHART.ChartParams[];
  };

  type UserQueryResponse = {
    success: boolean;
    errorMessage?: string;
    errorCode?: int;
    data?: UserQuery;
  };
}
