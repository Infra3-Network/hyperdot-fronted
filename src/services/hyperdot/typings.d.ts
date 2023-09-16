declare namespace HYPERDOT_API {
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
}
