import { updateFavoriteQuery } from '@/services/hyperdot/api';
import { formatTimeAgo } from '@/utils';
import { StarFilled, StarOutlined } from '@ant-design/icons';

import { List, message, Space } from 'antd';
import React from 'react';
import { Link } from 'umi';
import UserAvatar from '../UserAvatar';

import styles from './index.less';

type ContentProps = {
  query: HYPERDOT_API.ListQueryData;
};

const Content = (props: ContentProps) => {
  const query = props.query;
  return (
    <>
      <div className={styles.listContent}>
        <div className={styles.listContentItem}>
          <span>
            <Link to={'/account/center/' + query.user_id}>@{query.username}</Link>
          </span>
        </div>
        <div className={styles.listContentItem}>
          <span>updated {formatTimeAgo(query.updated_at)}</span>
        </div>
      </div>
    </>
  );
};

type Props = {
  currentUser: HYPERDOT_API.CurrentUser;
  data: HYPERDOT_API.ListQueryData[];
  total: number;
  pageSize: number;
  onChange: (page: number, pageSize: number) => void;
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

  const handleStarClick = (index: number) => {
    if (!starArray[index]) {
      message.error('Unkown error: star not found', 3);
    }
    const userId = props.data[index].user_id;
    const queryId = props.data[index].id;
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
    const userId = props.data[index].user_id;
    const queryId = props.data[index].id;
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
              {starArray[index] && starArray[index].stared ? (
                <StarFilled onClick={() => handleUnstarClick(index)} />
              ) : (
                <StarOutlined onClick={() => handleStarClick(index)} />
              )}
              {starArray[index] && starArray[index].stars}
            </Space>
          }
        >
          <List.Item.Meta
            avatar={<UserAvatar size={26} username={item.username} icon_url={item.icon_url} />}
            title={<Link to={'/creations/queries/' + item.id}>{item.name}</Link>}
          />
          <Content query={item} />
        </List.Item>
      )}
    />
  );
};

export default QueryList;
