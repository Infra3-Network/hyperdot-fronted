import ContentList from '@/components/List';
import { Card, Col, Row } from 'antd';
import React from 'react';

type Props = {};

const Queries = (props: Props) => {
  return (
    <Row gutter={[24, 0]}>
      <Col span={18}>
        <Card
          // className={styles.listCard}
          bordered={false}
          // title="基本列表"
          style={{ marginTop: 24 }}
          bodyStyle={{ padding: '0 32px 40px 32px' }}
          // extra={extraContent}
        >
          <ContentList />
        </Card>
      </Col>

      <Col span={6}>
        <Row gutter={[0, 32]}>
          <Col span={24}>Rank</Col>
          <Col span={24}>Popular query tags</Col>
        </Row>
      </Col>
    </Row>
  );
};

export default Queries;
