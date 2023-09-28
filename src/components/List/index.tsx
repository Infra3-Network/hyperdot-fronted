import { LikeOutlined, MessageOutlined, StarOutlined } from '@ant-design/icons';

import { Avatar, List, Space } from 'antd';
import React from 'react';
import { Link } from 'umi';
// import { styles } from './style.less'

import styles from './index.less';

// const data = Array.from({ length: 23 }).map((_, i) => ({
//   href: 'https://ant.design',
//   title: `ant design part ${i}`,
//   avatar: `https://xsgames.co/randomusers/avatar.php?g=pixel&key=${i}`,
//   description:
//     'Ant Design, a design language for background applications, is refined by Ant UED Team.',
//   content:
//     'We supply a series of design principles, practical patterns and high quality design resources (Sketch and Axure), to help people create their product prototypes beautifully and efficiently.',
// }));

const IconText = ({ icon, text }: { icon: React.FC; text: string }) => (
  <Space>
    {React.createElement(icon)}
    {text}
  </Space>
);

const formatTimeAgo = (timestamp: string): string => {
  if (!timestamp) {
    return 'unkown';
  }

  const now = new Date();
  const date = new Date(timestamp);
  const timeDifference = now.getTime() - date.getTime();

  // 辅助函数，将时间差转换为不同单位
  function getTimeAgo(timeDiff: number, unit: string): string {
    const rounded = Math.round(timeDiff);
    return `${rounded} ${unit}${rounded !== 1 ? 's' : ''} ago`;
  }

  if (timeDifference < 60000) {
    // 不到一分钟
    return getTimeAgo(timeDifference / 1000, 'second');
  } else if (timeDifference < 3600000) {
    // 不到一小时
    return getTimeAgo(timeDifference / 60000, 'minute');
  } else if (timeDifference < 86400000) {
    // 不到一天
    return getTimeAgo(timeDifference / 3600000, 'hour');
  } else if (timeDifference < 2592000000) {
    // 不到一个月 (30 天)
    return getTimeAgo(timeDifference / 86400000, 'day');
  } else if (timeDifference < 31536000000) {
    // 不到一年 (365 天)
    return getTimeAgo(timeDifference / 2592000000, 'month');
  } else {
    // 大于一年
    return getTimeAgo(timeDifference / 31536000000, 'year');
  }
};

const ListContent = (data: HYPERDOT_API.ListQueryData) => {
  return (
    <>
      <div className={styles.listContent}>
        <div className={styles.listContentItem}>
          <span>
            <a href="">@{data.username}</a>
          </span>
        </div>
        <div className={styles.listContentItem}>
          <span>updated {formatTimeAgo(data.updated_at)}</span>
        </div>
      </div>
    </>
  );
};

type Props = {
  data: HYPERDOT_API.ListQueryData[];
};

const ContentList: React.FC = (props: Props) => (
  <List
    itemLayout="vertical"
    size="large"
    pagination={{
      onChange: (page) => {
        console.log(page);
      },
      size: 'small',
      pageSize: 10,
      style: { textAlign: 'center' },
    }}
    dataSource={props.data}
    // footer={
    //     <div>
    //         <b>ant design</b> footer part
    //     </div>
    // }
    renderItem={(item) => (
      <List.Item
        key={item.id}
        actions={
          [
            // <IconText icon={StarOutlined} text="156" key="list-vertical-star-o" />,
            // <IconText icon={LikeOutlined} text="156" key="list-vertical-like-o" />,
            // <IconText icon={MessageOutlined} text="2" key="list-vertical-message" />,
          ]
        }
        extra={
          <IconText
            icon={StarOutlined}
            text={item.stars ? item.stars : 0}
            key="list-vertical-star-o"
          />

          // <img
          //     width={272}
          //     alt="logo"
          //     src="https://gw.alipayobjects.com/zos/rmsportal/mqaQswcyDLcXyDKnZfES.png"
          // />
        }
      >
        <List.Item.Meta
          avatar={<Avatar src={''} />}
          title={<Link to={'/creations/queries/' + item.id}>{item.name}</Link>}
          // description={item.description}
        />
        <ListContent {...item} />
      </List.Item>
    )}
  />
);

export default ContentList;
