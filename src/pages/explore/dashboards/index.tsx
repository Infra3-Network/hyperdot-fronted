import { getInitialState } from '@/app';
import DashboardList from '@/components/DashboardList';
import Rank from '@/components/ListRank';
import Tags from '@/components/ListTag';
import { listDashboard, listDashboardPopularTags } from '@/services/hyperdot/api';
import { GridContent } from '@ant-design/pro-layout';
import { Card, Col, message, Row } from 'antd';
import React from 'react';
import { history } from 'umi';
import ExploreMenu from '../components/Menu';

/**
 * React functional component representing the Dashboards.
 * @function
 * @returns {JSX.Element} - JSX element representing the Dashboards.
 */
const Dashboards = (): JSX.Element => {
  const pageSize = 10;
  const [currentUser, setCurrentUser] = React.useState<HYPERDOT_API.CurrentUser | undefined>(
    undefined,
  );
  const [page, setPage] = React.useState(1);
  const [total, setTotal] = React.useState(0);
  const [order, setOrder] = React.useState('favorites');
  const [favoritesTimeRange, setFavoritesTimeRange] = React.useState('all');
  const [trendingTimeRange, setTrendingTimeRange] = React.useState('4h');
  const [data, setData] = React.useState<HYPERDOT_API.Dashboard[]>([]);
  const [popularTags, setPopularTags] = React.useState<Map<string, number> | undefined>(undefined);

  const handleParamChange = (type: string, newValue: any) => {
    const queries = {
      page: page,
      pageSize: pageSize,
      order: order,
      timeRange: order == 'favorites' ? favoritesTimeRange : trendingTimeRange,
      userId: undefined,
    };

    if (type == 'page') {
      queries.page = newValue;
    }

    if (type == 'order') {
      queries.order = newValue;
      switch (newValue) {
        case 'favorites':
          queries.timeRange = favoritesTimeRange;
        case 'trending':
          queries.timeRange = trendingTimeRange;
        case 'new':
          queries.timeRange = 'all';
      }
    }

    if (type == 'favoritesTimeRange') {
      queries.order = 'favorites';
      queries.timeRange = newValue;
    }

    if (type == 'trendingTimeRange') {
      queries.order = 'trending';
      queries.timeRange = newValue;
    }

    listDashboard(queries)
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

  React.useEffect(() => {
    getInitialState().then((res) => {
      if (!res.currentUser) {
        history.push('/user/login');
        return;
      }

      setCurrentUser(res.currentUser);
    });
    handleParamChange('page', page);

    listDashboardPopularTags()
      .then((res) => {
        if (!res.success) {
          message.error(res.errorMessage);
          return;
        }

        setPopularTags(res.data);
      })
      .catch((err) => {
        message.error(err);
      });
  }, []);

  const onChange = (p: number, ps: number) => {
    handleParamChange('page', p);
    setPage(p);
  };

  return (
    <GridContent contentWidth={'Fixed'}>
      <Row gutter={[24, 24]}>
        <Col span={24}>
          <ExploreMenu />
        </Col>

        <Col span={15}>
          <Card>
            {currentUser && data && (
              <DashboardList
                {...{
                  currentUser: currentUser,
                  data: data,
                  total: total,
                  pageSize: pageSize,
                  onChange: onChange,
                }}
              />
            )}
          </Card>
        </Col>

        <Col span={8}>
          <Row gutter={[0, 32]}>
            <Col span={24}>
              <Rank
                name="dashboards"
                {...{
                  order,
                  setOrder,
                  favoritesTimeRange,
                  setFavoritesTimeRange,
                  trendingTimeRange,
                  setTrendingTimeRange,
                  onParamChange: handleParamChange,
                }}
              />
            </Col>
            <Col span={24}>{popularTags && <Tags name="dashboard" tags={popularTags} />}</Col>
          </Row>
        </Col>
      </Row>
    </GridContent>
  );
};

export default Dashboards;
