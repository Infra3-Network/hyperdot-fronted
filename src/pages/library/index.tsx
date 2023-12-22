import { listDashboard, listQuery } from '@/services/hyperdot/api';
import { GridContent } from '@ant-design/pro-layout';
import { Col, Empty, message, Row, Segmented, Card } from 'antd';
import React from 'react';
import { history, useModel } from 'umi';
import AllList from '@/components/AllList';
import QueryList from '@/components/QueryList';
import DashboardList from '@/components/DashboardList';

import styles from './index.less';

/**
 * Functional component representing a list of all items in the library.
 * @function
 * @param {object} props - Component props.
 * @param {HYPERDOT_API.CurrentUser} props.currentUser - Current user information.
 * @returns {JSX.Element} - JSX element representing the LibraryAllList component.
 */
const LibraryAllList = ({
  currentUser,
}: {
  currentUser: HYPERDOT_API.CurrentUser;
}): JSX.Element => {
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

/**
 * Functional component representing a list of queries in the library.
 * @function
 * @param {object} props - Component props.
 * @param {HYPERDOT_API.CurrentUser} props.currentUser - Current user information.
 * @returns {JSX.Element} - JSX element representing the LibraryQueryList component.
 */
const LibraryQueryList = ({
  currentUser,
}: {
  currentUser: HYPERDOT_API.CurrentUser;
}): JSX.Element => {
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

/**
 * Functional component representing a list of dashboards in the library.
 * @function
 * @param {object} props - Component props.
 * @param {HYPERDOT_API.CurrentUser} props.currentUser - Current user information.
 * @returns {JSX.Element} - JSX element representing the LibraryDashboardList component.
 */
const LibraryDashboardList = ({
  currentUser,
}: {
  currentUser: HYPERDOT_API.CurrentUser;
}): JSX.Element => {
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

/**
 * Functional component representing a list in the library.
 * @function
 * @param {object} props - Component props.
 * @param {string | number} props.selectSegment - Selected segment identifier.
 * @param {HYPERDOT_API.CurrentUser} props.currentUser - Current user information.
 * @returns {JSX.Element} - JSX element representing the LibraryList component.
 */
const LibraryList = ({
  selectSegment,
  currentUser,
}: {
  selectSegment: string | number;
  currentUser: HYPERDOT_API.CurrentUser;
}): JSX.Element => {
  if (selectSegment === 'All') {
    return <LibraryAllList currentUser={currentUser} />;
  } else if (selectSegment === 'Queries') {
    return <LibraryQueryList currentUser={currentUser} />;
  } else if (selectSegment === 'Dashboards') {
    return <LibraryDashboardList currentUser={currentUser} />;
  } else {
    return <></>;
  }
};

/**
 * Functional component representing a library segment.
 * @function
 * @param {object} props - Component props.
 * @param {string | number} props.selectSegment - Selected segment identifier.
 * @param {React.Dispatch<React.SetStateAction<string | number>>} props.setSelectSegment - State setter for the selected segment.
 * @returns {JSX.Element} - JSX element representing the LibrarySegment component.
 */
const LibrarySegement = ({
  selectSegment,
  setSelectSegment,
}: {
  selectSegment: string | number;
  setSelectSegment: React.Dispatch<React.SetStateAction<string | number>>;
}): JSX.Element => (
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

    <Col />
  </Row>
);

/**
 * Functional component representing a library page.
 * @function
 * @returns {JSX.Element} - JSX element representing the LibraryPage component.
 */
const LibraryPage = (): JSX.Element => {
  const { currentUser } = useModel('@@initialState', (model) => ({
    currentUser: model.initialState?.currentUser,
  }));
  const [selectSegment, setSelectSegment] = React.useState<string | number>('Queries');

  if (!currentUser) {
    history.push('/user/login');
    return <></>;
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
