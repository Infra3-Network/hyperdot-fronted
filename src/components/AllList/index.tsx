import hyperdot from '@/services/hyperdot';
import { deleteQuery, updateFavoriteQuery } from '@/services/hyperdot/api';
import { formatTimeAgo } from '@/utils';
import { SmallDashOutlined, StarFilled, StarOutlined } from '@ant-design/icons';

import { List, type MenuProps, message, Space, Dropdown, Tag, Button } from 'antd';
import React from 'react';
import { Link } from 'umi';
import UserAvatar from '../UserAvatar';

import styles from './index.less';

const Content = ({ data }: { data: any }) => {
  return (
    <>
      <div className={styles.listContent}>
        <div className={styles.listContentItem}>
          <span>
            <Link to={'/account/center/' + data.user_id}>@{data.username}</Link>
          </span>
        </div>
        <div className={styles.listContentItem}>
          <span>updated {formatTimeAgo(data.updated_at)}</span>
        </div>
      </div>
    </>
  );
};

const ListMenuComponent = ({
  index,
  data,
  setData,
}: {
  index: number;
  data: HYPERDOT_API.ListQueryData;
  setData: React.Dispatch<React.SetStateAction<any[]>>;
}) => {
  const onClick: MenuProps['onClick'] = ({ key }) => {
    if (key == 'remove') {
      deleteQuery(data.id, {})
        .then((res) => {
          if (!res.success) {
            message.error(res.errorMessage);
            return;
          }
          // remove by index in data
          setData((prev) => {
            return prev.filter((v, i) => i != index);
          });
          message.success('Query deleted');
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
  data: any[];
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
    const queryId = data[index].id;
    if (!userId || !queryId) {
      message.error('Unkown error: query has no user_id or id', 3);
      return;
    }

    updateFavoriteQuery(true, {
      query_user_id: userId,
      query_id: queryId,
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
    const queryId = data[index].id;
    if (!userId || !queryId) {
      message.error('Unkown error: query has no user_id or id', 3);
      return;
    }

    updateFavoriteQuery(false, {
      query_user_id: userId,
      query_id: queryId,
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

const ItemLink = ({ data }: { data: any }) => {
  console.log('library ', Object.keys(data));
  const isDashboard = Object.keys(data).find((k) => k === 'panels');
  return (
    <Link to={isDashboard ? '/creations/dashboards/' + data.id : '/creations/queries/' + data.id}>
      {data.name}
    </Link>
  );
};

type Props = {
  currentUser: HYPERDOT_API.CurrentUser;
  data: any[];
  total: number;
  pageSize: number;
  onChange: (page: number, pageSize: number) => void;
  editable?: boolean;
  setData?: React.Dispatch<React.SetStateAction<any[]>>;
};

type StarState = {
  stared: boolean;
  id: number;
  stars: number;
};

const QueryList = (props: Props) => {
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
            title={<ItemLink data={item} />}
          />
          <Content data={item} />
        </List.Item>
      )}
    />
  );
};

export default QueryList;
