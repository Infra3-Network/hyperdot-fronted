import React, { useState, useRef, useLayoutEffect } from 'react';
import { GridContent } from '@ant-design/pro-layout';
import { Menu } from 'antd';
import BaseView from './components/base';
import BindingView from './components/binding';
import NotificationView from './components/notification';
import styles from './style.less';
import AccountView from './components/account';
import { getInitialState } from '@/app';
import { history } from 'umi';

const { Item } = Menu;

type SettingsStateKeys = 'base' | 'account' | 'binding' | 'notification';
type SettingsState = {
  mode: 'inline' | 'horizontal';
  selectKey: SettingsStateKeys;
};

const Settings: React.FC = () => {
  const menuMap: Record<string, React.ReactNode> = {
    base: 'Profile',
    account: 'Account',
    // binding: '账号绑定',
    // notification: '新消息通知',
  };

  const [initConfig, setInitConfig] = useState<SettingsState>({
    mode: 'inline',
    selectKey: 'base',
  });

  const [user, setUser] = useState<HYPERDOT_API.CurrentUser>();
  const dom = useRef<HTMLDivElement>();
  React.useEffect(() => {
    getInitialState()
      .then((res) => {
        setUser(res.currentUser);
      })
      .catch((err) => {
        history.push('/user/login');
        return;
      });
  }, []);

  const resize = () => {
    requestAnimationFrame(() => {
      if (!dom.current) {
        return;
      }
      let mode: 'inline' | 'horizontal' = 'inline';
      const { offsetWidth } = dom.current;
      if (dom.current.offsetWidth < 641 && offsetWidth > 400) {
        mode = 'horizontal';
      }
      if (window.innerWidth < 768 && offsetWidth > 400) {
        mode = 'horizontal';
      }
      setInitConfig({ ...initConfig, mode: mode as SettingsState['mode'] });
    });
  };

  useLayoutEffect(() => {
    if (dom.current) {
      window.addEventListener('resize', resize);
      resize();
    }
    return () => {
      window.removeEventListener('resize', resize);
    };
  }, [dom.current]);

  const getMenu = () => {
    return Object.keys(menuMap).map((item) => <Item key={item}>{menuMap[item]}</Item>);
  };

  const renderChildren = (
    userProps: HYPERDOT_API.CurrentUser,
    setUserProps: React.Dispatch<React.SetStateAction<HYPERDOT_API.CurrentUser | undefined>>,
  ) => {
    const { selectKey } = initConfig;
    console.log(selectKey);
    switch (selectKey) {
      case 'base':
        return <BaseView user={userProps} setUser={setUserProps} />;
      case 'account':
        if (!user) {
          return null;
        }
        return <AccountView user={user} />;
      case 'binding':
        return <BindingView />;
      case 'notification':
        return <NotificationView />;
      default:
        return null;
    }
  };

  return (
    <GridContent contentWidth={'Fixed'}>
      {user && (
        <div
          className={styles.main}
          ref={(ref) => {
            if (ref) {
              dom.current = ref;
            }
          }}
        >
          <div className={styles.leftMenu}>
            <Menu
              mode={initConfig.mode}
              selectedKeys={[initConfig.selectKey]}
              onClick={({ key }) => {
                setInitConfig({
                  ...initConfig,
                  selectKey: key as SettingsStateKeys,
                });
              }}
            >
              {getMenu()}
            </Menu>
          </div>
          <div className={styles.right}>
            <div className={styles.title}>{menuMap[initConfig.selectKey]}</div>
            {renderChildren(user, setUser)}
          </div>
        </div>
      )}
    </GridContent>
  );
};
export default Settings;
