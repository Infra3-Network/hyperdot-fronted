import QueryList from '@/components/QueryList';
import { listQuery } from '@/services/hyperdot/api';
import { Card, Col, message, Row } from 'antd';
import React from 'react';
import ExploreMenu from '../components/Menu';
import Rank from '../components/Rank';
import Tags from '../components/Tags';

type Props = {};

const Queries = (props: Props) => {
  const pageSize = 10;
  const [page, setPage] = React.useState(1);
  const [total, setTotal] = React.useState(0);
  const [data, setData] = React.useState<HYPERDOT_API.ListQueryData[]>([]);
  React.useEffect(() => {
    listQuery(page, pageSize)
      .then((res) => {
        if (res.data == undefined) {
          return;
        }
        setData(res.data.queries);
        setTotal(res.data.total);
      })
      .catch((err) => {
        message.error(err);
      });
  }, []);

  const onChange = (p: number, ps: number) => {
    setPage(p);
    listQuery(p, ps)
      .then((res) => {
        if (res.data == undefined) {
          return;
        }
        setData(res.data.queries);
        setTotal(res.data.total);
      })
      .catch((err) => {
        message.error(err);
      });
  };

  return (
    <Row gutter={[24, 24]}>
      <Col span={24}>
        <ExploreMenu />
      </Col>
      <Col span={18}>
        <Card bordered={false}>
          <QueryList
            {...{
              data,
              total,
              pageSize,
              onChange,
            }}
          />
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
