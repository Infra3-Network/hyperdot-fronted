import DashboardList from '@/components/DashboardList';
import { listDashboard, listFavoriteDashboard } from '@/services/hyperdot/api';
import { Card, Col, message, Row } from 'antd';
import React from 'react';
import ExploreMenu from '../components/Menu';
import Rank from '../components/Rank';
import Tags from '../components/Tags';

type Props = {};

const Dashboards = (props: Props) => {
  const pageSize = 10;
  const [page, setPage] = React.useState(1);
  const [total, setTotal] = React.useState(0);
  const [data, setData] = React.useState<HYPERDOT_API.Dashboard[]>([]);
  React.useEffect(() => {
    listFavoriteDashboard(page, pageSize)
      .then((res) => {
        if (!res.success) {
          message.error(res.errorMessage);
          return;
        }

        setData(res.data.dashboards);
        setTotal(res.data.total);
      })
      .catch((err) => {
        message.error(err);
      });
  }, []);

  const onChange = (p: number, ps: number) => {
    setPage(p);
    listFavoriteDashboard(p, ps)
      .then((res) => {
        if (!res.success) {
          message.error(res.errorMessage);
          return;
        }

        setData(res.data.dashboards);
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
          {data && data.length > 0 && (
            <DashboardList
              {...{
                data: data,
                total: total,
                pageSize: pageSize,
                onChange: onChange,
              }}
            />
          )}
        </Card>
      </Col>

      <Col span={6}>
        <Row gutter={[0, 32]}>
          <Col span={24}>
            <Rank name="dashboards" />
          </Col>
          <Col span={24}>
            <Tags name="dashboard" />
          </Col>
        </Row>
      </Col>
    </Row>
  );
};

export default Dashboards;
