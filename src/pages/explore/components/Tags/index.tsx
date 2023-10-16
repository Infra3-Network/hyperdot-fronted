import { NumberOutlined, TagOutlined } from '@ant-design/icons';
import { Card, Col, Row, Avatar, List } from 'antd';
import React from 'react';

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
  {
    title: 'Ant Design Title 5',
  },
  {
    title: 'Ant Design Title 6',
  },
  {
    title: 'Ant Design Title 7',
  },
  {
    title: 'Ant Design Title 8',
  },
  {
    title: 'Ant Design Title 9',
  },
  {
    title: 'Ant Design Title 10',
  },
];

type Props = {
  name: string;
  tags: Map<string, number>;
};

const Tags = (props: Props) => {
  console.log(props.tags);
  // convert props.tags to sorted array: first sort by value and if value equal then sort by key
  const tagsArray = Array.from(props.tags, ([name, count]) => ({ name, count }));
  tagsArray.sort((a, b) => {
    if (a.count > b.count) {
      return -1;
    } else if (a.count < b.count) {
      return 1;
    } else {
      if (a.name > b.name) {
        return 1;
      } else {
        return -1;
      }
    }
  });

  console.log(tagsArray);

  return (
    <>
      <Card>
        <Row gutter={[0, 12]}>
          <Col span={24}>
            <span>Popular {props.name} tags</span>
          </Col>
          <Col span={24}>
            <List
              itemLayout="horizontal"
              dataSource={data}
              renderItem={(item, index) => (
                <List.Item>
                  <List.Item.Meta
                    avatar={<TagOutlined />}
                    title={<a href="https://ant.design">{item.title}</a>}
                    // description="Ant Design, a design language for background applications, is refined by Ant UED Team"
                  />
                  <div>
                    <span>
                      <NumberOutlined />
                    </span>
                    <span>56789</span>
                  </div>
                </List.Item>
              )}
            />
          </Col>
        </Row>
      </Card>
    </>
  );
};

export default Tags;
