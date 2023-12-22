import React, { useState, useRef, useLayoutEffect } from 'react';
import { GridContent } from '@ant-design/pro-layout';
import { Menu } from 'antd';
import BaseView from './components/base';
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

/**
 * Functional component representing the user settings page.
 */
const Settings: React.FC = () => {
  // Map of menu items and their corresponding keys
  const menuMap: Record<string, React.ReactNode> = {
    base: 'Profile',
    account: 'Account',
  };

  // Initial configuration state for settings
  const [initConfig, setInitConfig] = useState<SettingsState>({
    mode: 'inline',
    selectKey: 'base',
  });

  // State for the current user
  const [user, setUser] = useState<HYPERDOT_API.CurrentUser>();

  // Reference to the main content div
  const dom = useRef<HTMLDivElement>();

  // Fetches initial state data on component mount
  React.useEffect(() => {
    getInitialState()
      .then((res) => {
        setUser(res.currentUser);
      })
      .catch((_) => {
        history.push('/user/login');
        return;
      });
  }, []);

  // Handles resizing and adjusts the mode accordingly
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

  // Listens for resize events and adjusts the mode accordingly
  useLayoutEffect(() => {
    if (dom.current) {
      window.addEventListener('resize', resize);
      resize();
    }
    return () => {
      window.removeEventListener('resize', resize);
    };
  }, [dom.current]);

  // Returns the menu items
  const getMenu = () => {
    return Object.keys(menuMap).map((item) => <Item key={item}>{menuMap[item]}</Item>);
  };

  // Renders the content based on the selected menu item
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
      default:
        return null;
    }
  };

  // Renders the settings page content
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
            {/* Menu for selecting settings sections */}
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
            {/* Title and content of the selected settings section */}
            <div className={styles.title}>{menuMap[initConfig.selectKey]}</div>
            {renderChildren(user, setUser)}
          </div>
        </div>
      )}
    </GridContent>
  );
};

export default Settings;
