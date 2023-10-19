declare namespace HYPERDOT_API {
  type BaseResponse = {
    success: boolean;
    errorMessage?: string;
    errorCode?: int;
    data?: any;
  };

  type QueryEngineDatasetMetadata = {
    id: string;
    title: string;
    description: string;
  };
  type QueryEngine = {
    name: string;
    datasets: Map<string, QueryEngineDatasetMetadata>;
  };

  type QueryEngineDataset = {
    chains: Map<string, any>;
  };

  type GetSystemQueryEngineDatasetResponse = {
    success: boolean;
    errorMessage?: string;
    errorCode?: int;
    data: QueryEngineDataset;
  };

  type ListSystemQueryEnginesResponse = {
    success: boolean;
    errorMessage?: string;
    errorCode?: int;
    data: QueryEngine[];
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
    location: string;
    encrypted_password?: string;
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

  type GetUserResponse = {
    success: boolean;
    errorMessage?: string;
    errorCode?: int;
    data?: CurrentUser;
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

  type CreateAccountRequest = {
    provider: string;
    username: string;
    email: string;
    password: string;
  };

  type CreateAccountResponse = {
    success: boolean;
    errorMessage?: string;
    errorCode?: int;
  };

  type UpdateUserResponse = {
    success: boolean;
    errorMessage?: string;
    errorCode?: int;
    data: CurrentUser;
  };

  type UploadUserAvatarResponse = {
    success: boolean;
    errorMessage?: string;
    errorCode?: int;
    data: any;
  };

  type UserQuery = {
    id?: number;
    user_id?: number;
    name?: string;
    query: string;
    query_engine: string;
    is_privacy?: boolean;
    unsaved?: boolean;
    charts?: Chart[];
  };

  type UserQueryResponse = {
    success: boolean;
    errorMessage?: string;
    errorCode?: int;
    data: UserQuery;
  };

  type ListQueryData = {
    id: number;
    user_id: number;
    name: string;
    icon_url: string;
    description: string;
    is_privacy: boolean;
    query: string;
    query_engine: string;
    stars: number;
    stared: boolean;
    charts: any;
    created_at: string;
    updated_at: string;
    deleted_at: string;
    uid: string;
    username: string;
    email: any;
    favorites_count: number;
  };

  type ListQueryResponse = {
    success: boolean;
    errorMessage?: string;
    errorCode?: int;
    data: {
      queries: ListQueryData[];
      total: number;
    };
  };

  type UpdateUserPasswordRequest = {
    current_password: string;
    new_password: string;
  };

  type Chart = {
    // query table
    query_name?: string;
    query_description?: string;
    query?: string;
    query_engine?: string;
    is_privacy?: boolean;
    unsaved?: boolean;
    query_stars?: number;
    query_created_at?: string;
    query_updated_at?: string;
    // chart table
    id?: number;
    index?: number;
    query_id?: number;
    chart_id?: number;
    user_id?: number;
    name?: string;
    type?: string;
    config?: any;
    closeable?: boolean;
  };

  type ListCurrentUserChartResponse = {
    success: boolean;
    errorMessage?: string;
    errorCode?: int;
    data: {
      charts: Chart[];
      total: number;
    };
  };

  type GetCurrentUserChartResponse = {
    success: boolean;
    errorMessage?: string;
    errorCode?: int;
    data: Chart;
  };

  type DashboardPanel = {
    id: number;
    user_id: number;
    dashboard_id: number;
    query_id: number;
    chart_id: number;
    name: string;
    description: string;
    type: number;
    text: string;
    width: string;
    height: string;
    x_pos: number;
    y_pos: number;
    created_at: string;
    updated_at: string;
  };

  type Dashboard = {
    id?: number;
    user_id?: number;
    username?: string;
    icon_url?: string;
    name?: string;
    description?: string;
    is_privacy?: boolean;
    stars?: number;
    stared?: boolean;
    favorites_count?: number;
    panels?: HYPERDOT_API.DashboardPanel[];
    tags?: string;
    created_at?: string;
    updated_at?: string;
    deleted_at?: string;
  };

  type GetDashboardResponse = {
    success: boolean;
    errorMessage?: string;
    errorCode?: int;
    data: Dashboard;
  };

  type ListDashboardResponse = {
    success: boolean;
    errorMessage?: string;
    errorCode?: int;
    data: {
      dashboards: Dashboard[];
      total: number;
    };
  };

  type ListDashboardPopularTagsResponse = {
    success: boolean;
    errorMessage?: string;
    errorCode?: int;
    data: Map<string, number>;
  };

  type CreateDashboardResponse = {
    success: boolean;
    errorMessage?: string;
    errorCode?: int;
    data: Dashboard;
  };

  type UpdateDashboardResponse = {
    success: boolean;
    errorMessage?: string;
    errorCode?: int;
    data: Dashboard;
  };

  type UserDashboardFavorites = {
    user_id?: number;
    dashboard_id?: number;
    dashboard_user_id?: number;
    stared?: boolean;
    created_at?: string;
    updated_at?: string;
  };

  type UpdateUserDashboadFavoritesResponse = {
    success: boolean;
    errorMessage?: string;
    errorCode?: int;
    data: UserDashboardFavorites;
  };

  type UserQueryFavorites = {
    user_id?: number;
    query_id?: number;
    query_user_id?: number;
    stared?: boolean;
    created_at?: string;
    updated_at?: string;
  };

  type UpdateUserQueryFavoritesResponse = {
    success: boolean;
    errorMessage?: string;
    errorCode?: int;
    data: UserQueryFavorites;
  };
}
