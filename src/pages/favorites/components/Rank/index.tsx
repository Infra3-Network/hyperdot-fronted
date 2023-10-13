import { Row, Col, Input, Card, Radio } from 'antd';
import React from 'react';
import styles from './index.less';
type Props = {
  name: string;
};

const Rank = (props: Props) => {
  return (
    <Card>
      <Row gutter={[0, 12]}>
        <Col span={24}>
          <span>Rank {props.name} by</span>
        </Col>
        <Col span={24}>
          <Radio.Group
            size="small"
            onChange={() => {}}
            defaultValue="a"
            className={styles.rankContainer}
          >
            <Radio.Button value="a">⭐ Favorites</Radio.Button>
            <Radio.Button value="b">🔥 Trending</Radio.Button>
            <Radio.Button value="c">🎊 New</Radio.Button>
          </Radio.Group>
        </Col>
        <Col span={24}>Search for dashboards</Col>
        <Col span={24}>
          <Input placeholder="NFT..." />
        </Col>
        <Col span={24}>Time range</Col>
        <Col span={24}>
          <Radio.Group
            size="small"
            buttonStyle="solid"
            onChange={() => {}}
            defaultValue="a"
            className={styles.timeContainer}
          >
            <Radio.Button value="a">1 hour</Radio.Button>
            <Radio.Button value="b">4 hours</Radio.Button>
            <Radio.Button value="c">24 hours</Radio.Button>
          </Radio.Group>
        </Col>
      </Row>
    </Card>
  );
};

export default Rank;
