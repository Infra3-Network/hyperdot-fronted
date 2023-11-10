import { NumberOutlined, TagOutlined } from '@ant-design/icons';
import { Card, Col, Row, List, Empty } from 'antd';

type Props = {
  name: string;
  tags: Map<string, number>;
};

const Tags = (props: Props) => {
  // convert props.tags to sorted array: first sort by value and if value equal then sort by key
  const tagsArray: { tag: string; count: number }[] = Object.keys(props.tags).map((k) => {
    return { tag: k, count: props.tags[k] };
  });

  tagsArray.sort((a, b) => {
    if (a.count > b.count) return -1;
    if (a.count < b.count) return 1;
    if (a.tag > b.tag) return 1;
    if (a.tag < b.tag) return -1;
    return 0;
  });

  return (
    <>
      <Card>
        <Row gutter={[0, 12]}>
          <Col span={24}>
            <span>Popular {props.name} tags</span>
          </Col>
          <Col span={24}>
            {tagsArray.length == 0 ? (
              <Empty description={<span>No tags</span>} />
            ) : (
              <List
                itemLayout="horizontal"
                dataSource={tagsArray}
                renderItem={(item, index) => (
                  <List.Item>
                    <List.Item.Meta
                      avatar={<TagOutlined />}
                      title={<a href="#">{item.tag}</a>}
                      // description="Ant Design, a design language for background applications, is refined by Ant UED Team"
                    />
                    <div>
                      <span>
                        <NumberOutlined />
                      </span>
                      <span>{item.count}</span>
                    </div>
                  </List.Item>
                )}
              />
            )}
          </Col>
        </Row>
      </Card>
    </>
  );
};

export default Tags;
