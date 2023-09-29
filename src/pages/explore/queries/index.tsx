import ContentList from '@/components/List';
import { listQuery } from '@/services/hyperdot/api';
import { Card, Col, Row } from 'antd';
import React from 'react';
import ExploreMenu from '../components/Menu';
import Rank from '../components/Rank';
import Tags from '../components/Tags';

type Props = {};

const Queries = (props: Props) => {
  const page = 1;
  const pageSize = 10;
  const [data, setData] = React.useState<HYPERDOT_API.ListQueryData[]>([]);
  React.useEffect(() => {
    listQuery(page, pageSize)
      .then((res) => {
        if (res.data == undefined) {
          return;
        }
        setData(res.data);
      })
      .catch((err) => {});
  }, []);
  return (
    <Row gutter={[24, 24]}>
      <Col span={24}>
        <ExploreMenu />
      </Col>
      <Col span={18}>
        <Card
          // className={styles.listCard}
          bordered={false}
          // title="基本列表"
          // style={{ marginTop: 24 }}
          // bodyStyle={{ padding: '0 32px 40px 32px' }}
          // extra={extraContent}
        >
          <ContentList data={data} />
        </Card>
      </Col>

      <Col span={6}>
        <Row gutter={[0, 32]}>
          <Col span={24}>
            <Rank name="queries" />
          </Col>
          <Col span={24}>
            <Tags name="query" />
          </Col>
        </Row>
      </Col>
    </Row>
  );
};

export default Queries;