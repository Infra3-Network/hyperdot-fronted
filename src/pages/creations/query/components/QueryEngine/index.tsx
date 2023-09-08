import { Select, Alert, List } from 'antd';

import { AppstoreOutlined } from '@ant-design/icons';

import styles from './index.less';

const data = [
  {
    title: 'Ant Design Title 1',
  },
  {
    title: 'Ant Design Title 2',
  },
  {
    title: 'Ant Design Title 3',
  },
  {
    title: 'Ant Design Title 4',
  },
];

const QueryEngine = () => {
  return (
    <div>
      <Select
        className={styles.engineSelect}
        showSearch
        placeholder="Select a person"
        optionFilterProp="children"
        // onChange={onChange}
        // onSearch={onSearch}
        // filterOption={filterOption}
        options={[
          {
            value: 'jack',
            label: 'Jack',
          },
          {
            value: 'lucy',
            label: 'Lucy',
          },
          {
            value: 'tom',
            label: 'Tom',
          },
        ]}
      />

      <Alert
        className={styles.alert}
        message="Informational Notes"
        description="Selecting a supported Data Engine will show the chain supported by that Data Engine."
        type="info"
        showIcon
      />

      <List
        itemLayout="horizontal"
        dataSource={data}
        split={false}
        renderItem={(item, index) => (
          <List.Item>
            {/*<List.Item.Meta*/}
            {/*  avatar={<Avatar src={`https://xsgames.co/randomusers/avatar.php?g=pixel&key=${index}`}/>}*/}
            {/*  title={<a href="https://ant.design">{item.title}</a>}*/}
            {/*  description="Ant Design, a design language for background applications, is refined by Ant UED Team"*/}
            {/*/>*/}
            <a className={styles.engineTagLink}>
              <div className={styles.engineTagIcon}>
                <AppstoreOutlined />
              </div>
              <div className={styles.engineTagContent}>
                <p>{item.title}</p>
                <p>TODO...</p>
              </div>
            </a>
          </List.Item>
        )}
      />
    </div>
  );
};

export default QueryEngine;
