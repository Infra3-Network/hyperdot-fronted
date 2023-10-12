import { formatTimeAgo } from '@/utils';
import { StarOutlined } from '@ant-design/icons';

import { List, Space } from 'antd';
import React from 'react';
import { Link } from 'umi';
import UserAvatar from '../UserAvatar';

import styles from './index.less';

const IconText = ({ icon, text }: { icon: React.FC; text: string }) => (
  <Space>
    {React.createElement(icon)}
    {text}
  </Space>
);

type ContentProps = {
  dashboard: HYPERDOT_API.Dashboard;
};

const Content = (props: ContentProps) => {
  const dashboard = props.dashboard;
  return (
    <>
      <div className={styles.listContent}>
        <div className={styles.listContentItem}>
          <span>
            <Link to={'/account/center/' + dashboard.user_id}>@{dashboard.username}</Link>
          </span>
        </div>
        <div className={styles.listContentItem}>
          <span>updated {dashboard.updated_at && formatTimeAgo(dashboard.updated_at)}</span>
        </div>
      </div>
    </>
  );
};

type Props = {
  data: HYPERDOT_API.Dashboard[];
  total: number;
  pageSize: number;
  onChange: (page: number, pageSize: number) => void;
};

const DashboardList = (props: Props) => (
  <List
    itemLayout="vertical"
    size="large"
    pagination={{
      onChange: props.onChange,
      size: 'small',
      pageSize: props.pageSize,
      total: props.total,

      style: { textAlign: 'center' },
    }}
    dataSource={props.data}
    renderItem={(item) => (
      <List.Item
        key={item.id}
        actions={[]}
        extra={
          <IconText
            icon={StarOutlined}
            text={item.stars ? item.stars.toString() : '0'}
            key="list-vertical-star-o"
          />
        }
      >
        <List.Item.Meta
          avatar={<UserAvatar size={26} username={item.username} icon_url={item.icon_url} />}
          title={<Link to={'/creations/dashboards/' + item.id}>{item.name}</Link>}
        />
        <Content dashboard={item} />
      </List.Item>
    )}
  />
);

export default DashboardList;
