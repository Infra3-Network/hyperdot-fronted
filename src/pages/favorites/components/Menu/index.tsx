import { CodeOutlined, DashboardOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Menu } from 'antd';
import { useState } from 'react';
import { history, Link } from 'umi';

const items: MenuProps['items'] = [
  {
    label: (
      <Link to="/favorites/dashboards" key={'dashboards'}>
        Dashboards
      </Link>
    ),
    key: 'dashboards',
    icon: <DashboardOutlined />,
    disabled: false,
  },
  {
    label: (
      <Link to="/favorites/queries" key={'queries'}>
        Queries
      </Link>
    ),
    key: 'queries',
    icon: <CodeOutlined />,
    disabled: false,
  },
];

/**
 * React functional component representing the ExploreMenu.
 * @function
 * @returns {JSX.Element} - JSX element representing the ExploreMenu.
 */
const ExploreMenu: React.FC = (): JSX.Element => {
  const path = history.location.pathname.split('/').slice(-1)[0];
  const [current, setCurrent] = useState(path);

  const onClick: MenuProps['onClick'] = (e) => {
    setCurrent(e.key);
  };

  return (
    <>
      <Menu
        style={{ background: 'transparent' }}
        onClick={onClick}
        selectedKeys={[current]}
        mode="horizontal"
        items={items}
      />
    </>
  );
};

export default ExploreMenu;
