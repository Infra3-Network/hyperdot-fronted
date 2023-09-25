import { LikeOutlined, MessageOutlined, StarOutlined } from '@ant-design/icons';

import { Avatar, List, Space } from 'antd';
import React from 'react';
// import { styles } from './style.less'

import styles from './index.less';

const data = Array.from({ length: 23 }).map((_, i) => ({
  href: 'https://ant.design',
  title: `ant design part ${i}`,
  avatar: `https://xsgames.co/randomusers/avatar.php?g=pixel&key=${i}`,
  description:
    'Ant Design, a design language for background applications, is refined by Ant UED Team.',
  content:
    'We supply a series of design principles, practical patterns and high quality design resources (Sketch and Axure), to help people create their product prototypes beautifully and efficiently.',
}));

const IconText = ({ icon, text }: { icon: React.FC; text: string }) => (
  <Space>
    {React.createElement(icon)}
    {text}
  </Space>
);

const ListContent = ({ user, updateAt }: any) => (
  <div className={styles.listContent}>
    <div className={styles.listContentItem}>
      <span>
        <a href="">@{user}</a>
      </span>
    </div>
    <div className={styles.listContentItem}>
      <span>updated {updateAt} ago</span>
    </div>
  </div>
);

const ContentList: React.FC = () => (
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
    dataSource={data}
    // footer={
    //     <div>
    //         <b>ant design</b> footer part
    //     </div>
    // }
    renderItem={(item) => (
      <List.Item
        key={item.title}
        actions={
          [
            // <IconText icon={StarOutlined} text="156" key="list-vertical-star-o" />,
            // <IconText icon={LikeOutlined} text="156" key="list-vertical-like-o" />,
            // <IconText icon={MessageOutlined} text="2" key="list-vertical-message" />,
          ]
        }
        extra={
          <IconText icon={StarOutlined} text="156" key="list-vertical-star-o" />

          // <img
          //     width={272}
          //     alt="logo"
          //     src="https://gw.alipayobjects.com/zos/rmsportal/mqaQswcyDLcXyDKnZfES.png"
          // />
        }
      >
        <List.Item.Meta
          avatar={<Avatar src={item.avatar} />}
          title={<a href={item.href}>{item.title}</a>}
          // description={item.description}
        />
        <ListContent user={'neo'} updateAt={'6 months'} />
      </List.Item>
    )}
  />
);

export default ContentList;
