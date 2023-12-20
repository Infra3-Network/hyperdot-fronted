import { deleteDashboard, updateFavoriteDashboard } from '@/services/hyperdot/api';
import { formatTimeAgo } from '@/utils';
import { SmallDashOutlined, StarFilled, StarOutlined } from '@ant-design/icons';

import { List, message, Space, Tag, type MenuProps, Dropdown } from 'antd';
import React from 'react';
import { Link } from 'umi';
import UserAvatar from '../UserAvatar';

import styles from './index.less';

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
  currentUser: HYPERDOT_API.CurrentUser;
  data: HYPERDOT_API.Dashboard[];
  total: number;
  pageSize: number;
  onChange: (page: number, pageSize: number) => void;
  editable?: boolean;
  setData?: React.Dispatch<React.SetStateAction<HYPERDOT_API.Dashboard[]>>;
};

type StarState = {
  stared: boolean;
  id: number;
  stars: number;
};

const ListMenuComponent = ({
  index,
  data,
  setData,
}: {
  index: number;
  data: HYPERDOT_API.Dashboard;
  setData: React.Dispatch<React.SetStateAction<HYPERDOT_API.Dashboard[]>>;
}) => {
  const onClick: MenuProps['onClick'] = ({ key }) => {
    if (key == 'remove') {
      if (!data.id) {
        message.error('Unkown error: dashboard has no id', 3);
        return;
      }
      deleteDashboard(data.id, {})
        .then((res) => {
          if (!res.success) {
            message.error(res.errorMessage);
            return;
          }
          // remove by index in data
          setData((prev) => {
            return prev.filter((v, i) => i != index);
          });
          message.success('Dashboard deleted');
        })
        .catch((err) => {
          message.error(err);
        });
    }
  };

  const items: MenuProps['items'] = [
    {
      key: 'remove',
      label: 'Remove',
    },
  ];

  return (
    <Dropdown placement={'bottom'} menu={{ items, onClick }}>
      <Tag>
        <SmallDashOutlined />
      </Tag>
    </Dropdown>
  );
};

const StarComponent = ({
  data,
  data_index,
  editable,
  starArray,
  setStarArray,
}: {
  data: HYPERDOT_API.Dashboard[];
  data_index: number;
  editable: boolean | undefined;
  starArray: StarState[];
  setStarArray: React.Dispatch<React.SetStateAction<StarState[]>>;
}) => {
  const handleStarClick = (index: number) => {
    if (!starArray[index]) {
      message.error('Unkown error: star not found', 3);
    }
    const userId = data[index].user_id;
    const dashboardId = data[index].id;
    if (!userId || !dashboardId) {
      message.error('Unkown error: dashboard has no user_id or id', 3);
      return;
    }

    updateFavoriteDashboard(true, {
      dashboard_user_id: userId,
      dashboard_id: dashboardId,
    }).then((res) => {
      const nextStarArray = starArray.map((v, i) => {
        if (i == index) {
          return {
            id: v.id,
            stared: true,
            stars: v.stars + 1,
          };
        } else {
          return v;
        }
      });
      setStarArray(nextStarArray);
      return;
    });
  };

  const handleUnstarClick = (index: number) => {
    if (!starArray[index]) {
      message.error('Unkown error: star not found', 3);
    }
    const userId = data[index].user_id;
    const dashboardId = data[index].id;
    if (!userId || !dashboardId) {
      message.error('Unkown error: dashboard has no user_id or id', 3);
      return;
    }

    updateFavoriteDashboard(false, {
      dashboard_user_id: userId,
      dashboard_id: dashboardId,
    }).then((res) => {
      const nextStarArray = starArray.map((v, i) => {
        if (i == index) {
          return {
            id: v.id,
            stared: false,
            stars: v.stars - 1,
          };
        } else {
          return v;
        }
      });
      setStarArray(nextStarArray);
      return;
    });
  };

  if (editable) {
    return (
      <Tag>
        <Space>
          {starArray[data_index] && starArray[data_index].stared ? (
            <StarFilled onClick={() => handleUnstarClick(data_index)} />
          ) : (
            <StarOutlined onClick={() => handleStarClick(data_index)} />
          )}
          {starArray[data_index] && starArray[data_index].stars}
        </Space>
      </Tag>
    );
  } else {
    return (
      <Space>
        {starArray[data_index] && starArray[data_index].stared ? (
          <StarFilled onClick={() => handleUnstarClick(data_index)} />
        ) : (
          <StarOutlined onClick={() => handleStarClick(data_index)} />
        )}
        {starArray[data_index] && starArray[data_index].stars}
      </Space>
    );
  }
};

const DashboardList = (props: Props) => {
  const initStarArray = props.data.map((v) => {
    if (v.id) {
      return {
        id: v.id,
        stared: v.stared ? v.stared : false,
        stars: v.favorites_count ? v.favorites_count : 0,
      };
    } else {
      return {
        id: -1,
        stared: false,
        stars: 0,
      };
    }
  });
  const [starArray, setStarArray] = React.useState<StarState[]>([]);
  React.useEffect(() => {
    setStarArray(initStarArray);
  }, [props.data]);

  return (
    <List
      id="dashboard-list"
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
      renderItem={(item, index) => (
        <List.Item
          key={item.id}
          actions={[]}
          extra={
            <Space>
              <StarComponent
                data={props.data}
                data_index={index}
                editable={props.editable}
                starArray={starArray}
                setStarArray={setStarArray}
              />
              {props.editable && props.setData && (
                <ListMenuComponent index={index} data={item} setData={props.setData} />
              )}
            </Space>
          }
        >
          <List.Item.Meta
            avatar={<UserAvatar size={26} username={item.username} icon_url={item.icon_url} />}
            title={
              <Link id={`dashboard-list-link-${item.id}`} to={'/explore/dashboards/' + item.id}>
                {item.name}
              </Link>
            }
          />
          <Content dashboard={item} />
        </List.Item>
      )}
    />
  );
};

export default DashboardList;
