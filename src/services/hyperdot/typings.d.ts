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
    bio?: string;
    icon_url?: string;
    twitter?: string;
    github?: string;
    telgram?: string;
    discord?: string;
    stars: number;
    queries: number;
    dashboards: number;
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
    user_id?: number;
    name?: string;
    query: string;
    query_engine: string;
    is_privacy?: boolean;
    unsaved?: boolean;
    charts?: HYPERDOT_CHART.ChartParams[];
  };

  type UserQueryResponse = {
    success: boolean;
    errorMessage?: string;
    errorCode?: int;
    data?: UserQuery;
  };

  type ListQueryData = {
    id: number;
    user_id: number;
    name: string;
    description: string;
    is_privacy: boolean;
    query: string;
    query_engine: string;
    stars: number;
    charts: any;
    created_at: string;
    updated_at: string;
    deleted_at: string;
    uid: string;
    username: string;
    email: any;
  };

  type ListQueryResponse = {
    success: boolean;
    errorMessage?: string;
    errorCode?: int;
    data?: ListQueryData[];
  };
}
