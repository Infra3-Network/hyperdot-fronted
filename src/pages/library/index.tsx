import { listDashboard, listQuery } from '@/services/hyperdot/api';
import { GridContent } from '@ant-design/pro-layout';
import { Col, Empty, message, Row, Segmented, Card } from 'antd';
import React from 'react';
import { history, useModel } from 'umi';
import AllList from '@/components/AllList';
import QueryList from '@/components/QueryList';
import DashboardList from '@/components/DashboardList';

import styles from './index.less';
type Props = {};

const LibraryAllList = ({ currentUser }: { currentUser: HYPERDOT_API.CurrentUser }) => {
  const pageSize = 8;
  const [page, setPage] = React.useState(1);
  const [data, setData] = React.useState<any[]>([]);
  const [total, setTotal] = React.useState(0);

  const handleChange = (p: number, ps: number) => {
    listQuery({
      page: p,
      pageSize: ps,
      userId: currentUser.id,
    })
      .then((res) => {
        if (!res.success) {
          message.error(res.errorMessage);
          return;
        }

        listDashboard({
          page: p,
          pageSize: ps,
          userId: currentUser.id,
        })
          .then((dashboardRes) => {
            if (!dashboardRes.success) {
              message.error(res.errorMessage);
              return;
            }

            const mergedData = [...res.data.queries, ...dashboardRes.data.dashboards];
            setData(mergedData);
            setTotal(res.data.total + dashboardRes.data.total);
          })
          .catch((err) => {
            message.error(err);
          });
      })
      .catch((err) => {
        message.error(err);
      });
  };

  React.useEffect(() => {
    handleChange(page, pageSize);
  }, []);

  const onChange = (p: number, ps: number) => {
    handleChange(p, ps);
    setPage(p);
  };

  return (
    <>
      {data && data.length > 0 ? (
        <Card className={styles.listContent}>
          <AllList
            {...{
              currentUser: currentUser,
              data,
              total,
              pageSize,
              onChange,
              editable: true,
              setData,
            }}
          />
        </Card>
      ) : (
        <Card
          className={styles.listContent}
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <Empty description={<span>No queries found</span>} />
        </Card>
      )}
    </>
  );
};

const LibraryQueryList = ({ currentUser }: { currentUser: HYPERDOT_API.CurrentUser }) => {
  const pageSize = 8;
  const [page, setPage] = React.useState(1);
  const [data, setData] = React.useState<HYPERDOT_API.ListQueryData[]>([]);
  const [total, setTotal] = React.useState(0);

  const handleChange = (p: number, ps: number) => {
    listQuery({
      page: p,
      pageSize: ps,
      userId: currentUser.id,
    })
      .then((res) => {
        if (!res.success) {
          message.error(res.errorMessage);
          return;
        }

        setData(res.data.queries);
        setTotal(res.data.total);
      })
      .catch((err) => {
        message.error(err);
      });
  };

  React.useEffect(() => {
    handleChange(page, pageSize);
  }, []);

  const onChange = (p: number, ps: number) => {
    handleChange(p, ps);
    setPage(p);
  };

  return (
    <>
      {data && data.length > 0 ? (
        <Card className={styles.listContent}>
          <QueryList
            {...{
              currentUser: currentUser,
              data,
              total,
              pageSize,
              onChange,
              editable: true,
              setData,
            }}
          />
        </Card>
      ) : (
        <Card
          className={styles.listContent}
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <Empty description={<span>No queries found</span>} />
        </Card>
      )}
    </>
  );
};

const LibraryDashboardList = ({ currentUser }: { currentUser: HYPERDOT_API.CurrentUser }) => {
  const pageSize = 8;
  const [page, setPage] = React.useState(1);
  const [data, setData] = React.useState<HYPERDOT_API.Dashboard[]>([]);
  const [total, setTotal] = React.useState(0);

  const handleChange = (p: number, ps: number) => {
    listDashboard({
      page: p,
      pageSize: ps,
      userId: currentUser.id,
    })
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
    handleChange(page, pageSize);
  }, []);

  const onChange = (p: number, ps: number) => {
    handleChange(p, ps);
    setPage(p);
  };

  return (
    <>
      {data && data.length > 0 ? (
        <Card className={styles.listContent}>
          <DashboardList
            {...{
              currentUser: currentUser,
              data,
              total,
              pageSize,
              onChange,
              editable: true,
              setData,
            }}
          />
        </Card>
      ) : (
        <Card
          className={styles.listContent}
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <Empty description={<span>No queries found</span>} />
        </Card>
      )}
    </>
  );
};

const LibraryList = ({
  selectSegment,
  currentUser,
}: {
  selectSegment: string | number;
  currentUser: HYPERDOT_API.CurrentUser;
}) => {
  if (selectSegment === 'All') {
    return <LibraryAllList currentUser={currentUser} />;
  } else if (selectSegment === 'Queries') {
    return <LibraryQueryList currentUser={currentUser} />;
  } else if (selectSegment === 'Dashboards') {
    return <LibraryDashboardList currentUser={currentUser} />;
  } else {
    return null;
  }
};

const LibrarySegement = ({
  selectSegment,
  setSelectSegment,
}: {
  selectSegment: string | number;
  setSelectSegment: React.Dispatch<React.SetStateAction<string | number>>;
}) => (
  <Row justify={'space-between'}>
    <Col>
      <Segmented
        defaultValue={'Queries'}
        value={selectSegment}
        options={['Queries', 'Dashboards']}
        onChange={(value) => {
          setSelectSegment(value);
        }}
      />
    </Col>

    <Col></Col>
  </Row>
);

const LibraryPage = (props: Props) => {
  const { currentUser } = useModel('@@initialState', (model) => ({
    currentUser: model.initialState?.currentUser,
  }));
  const [selectSegment, setSelectSegment] = React.useState<string | number>('Queries');

  if (!currentUser) {
    history.push('/user/login');
    return null;
  }

  return (
    <GridContent contentWidth={'Fixed'}>
      <Row gutter={[0, 24]}>
        <Col span={24}>
          <LibrarySegement selectSegment={selectSegment} setSelectSegment={setSelectSegment} />
        </Col>

        <Col span={24}>
          <LibraryList selectSegment={selectSegment} currentUser={currentUser} />
        </Col>
      </Row>
    </GridContent>
  );
};

export default LibraryPage;
