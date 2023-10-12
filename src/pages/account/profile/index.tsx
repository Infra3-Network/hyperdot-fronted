import { getInitialState } from '@/app';
import MyIcon from '@/components/Icons';
import {
  BookOutlined,
  CodeOutlined,
  DashboardOutlined,
  StarFilled,
  TwitterOutlined,
} from '@ant-design/icons';
import { history, useParams } from 'umi';
import { Avatar, Card, Col, message, Row } from 'antd';
import React from 'react';
import styles from './index.less';
import { formatNumberWithCommas } from '@/utils';
import { getUser, listQuery, listUserDashboard, listUserQuery } from '@/services/hyperdot/api';
import QueryList from '@/components/QueryList';
import DashboardList from '@/components/DashboardList';

type Props = {};

const Queries = (user: HYPERDOT_API.CurrentUser) => {
  const pageSize = 3;
  const [page, setPage] = React.useState(1);
  const [total, setTotal] = React.useState(0);
  const [data, setData] = React.useState<HYPERDOT_API.ListQueryData[]>([]);
  React.useEffect(() => {
    listQuery(page, pageSize, user.id)
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
    <>
      {data && (
        <QueryList
          {...{
            data,
            total,
            pageSize,
            onChange,
          }}
        />
      )}
    </>
  );
};

const Dashboards = (user: HYPERDOT_API.CurrentUser) => {
  const pageSize = 3;
  const [page, setPage] = React.useState(1);
  const [data, setData] = React.useState<HYPERDOT_API.Dashboard[]>([]);
  const [total, setTotal] = React.useState(0);
  React.useEffect(() => {
    listUserDashboard(1, 10, user.id)
      .then((res) => {
        if (res.data == undefined) {
          return;
        }
        setData(res.data.dashboards);
        setTotal(res.data.total);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const onChange = (p: number, ps: number) => {
    setPage(p);
    listUserDashboard(p, ps, user.id)
      .then((res) => {
        if (res.data == undefined) {
          return;
        }
        setData(res.data.dashboards);
        setTotal(res.data.total);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  return (
    <>
      {data && (
        <DashboardList
          {...{
            data,
            total,
            pageSize,
            onChange,
          }}
        />
      )}
    </>
  );
};

const Social = (user: HYPERDOT_API.CurrentUser) => {
  return (
    <Row>
      {user.bio && (
        <Col span={24}>
          <div style={{ alignItems: 'start' }}>
            <span style={{ marginRight: '2px' }}>
              <BookOutlined />
            </span>
            <span>{user.bio}</span>
          </div>
        </Col>
      )}

      {user.twitter && (
        <Col span={12}>
          <div className={styles.introduce}>
            <span>
              <TwitterOutlined />
            </span>
            <span>
              <a
                target="_blank"
                rel="noopener noreferrer"
                href={'https://twitter.com/' + user.twitter}
              >
                @{user.twitter}
              </a>
            </span>
          </div>
        </Col>
      )}

      {user.github && (
        <Col span={12}>
          <div className={styles.introduce}>
            <span>
              <MyIcon type="icon-github" />
            </span>
            <span>
              <a
                target="_blank"
                rel="noopener noreferrer"
                href={'https://github.com/' + user.github}
              >
                @{user.github}
              </a>
            </span>
          </div>
        </Col>
      )}

      {user.telgram && (
        <Col span={12}>
          <div className={styles.introduce}>
            <span>
              <MyIcon type="icon-telgram" />
            </span>
            <span>
              <a target="_blank" rel="noopener noreferrer" href={'https://t.me/' + user.telgram}>
                @{user.telgram}
              </a>
            </span>
          </div>
        </Col>
      )}

      {user.discord && (
        <Col span={12}>
          <div className={styles.introduce}>
            <span>
              <MyIcon type="icon-discord" />
            </span>
            <span>
              <a
                target="_blank"
                rel="noopener noreferrer"
                href={'https://discord.com/users' + user.discord}
              >
                @{user.discord}
              </a>
            </span>
          </div>
        </Col>
      )}
    </Row>
  );
};

// const formatNumberWithCommas = (num: number): string => {
//   return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
// }

const Statistics = (user: HYPERDOT_API.CurrentUser) => {
  return (
    <>
      <Row className={styles.horner}>
        <Col span={24}>
          <span>
            {formatNumberWithCommas(user.stars)} stars <StarFilled />{' '}
          </span>
        </Col>
        <Col span={24}>
          <span>
            {formatNumberWithCommas(user.queries)} queries <CodeOutlined />{' '}
          </span>
        </Col>
        <Col span={24}>
          <span>
            {formatNumberWithCommas(user.dashboards)} dashboards <DashboardOutlined />{' '}
          </span>
        </Col>
      </Row>
    </>
  );
};

const Introduce = (user: HYPERDOT_API.CurrentUser) => {
  return (
    <>
      <Row justify={'center'} align="top">
        <Col span={24}>
          <h1> {user.username} </h1>
        </Col>

        <Col span={24}>
          <Row>
            <Col span={16}>
              <Social {...user} />
            </Col>

            <Col span={5}>
              <Statistics {...user} />
            </Col>
          </Row>
        </Col>
      </Row>
    </>
  );
};

const UserIcon = (user: HYPERDOT_API.CurrentUser) => {
  if (user.icon_url) {
    return <Avatar size={128} src={'/apis/v1/file?file=' + user.icon_url} />;
  }

  return <Avatar size={128}>{user.username}</Avatar>;
};

const Profile = (props: Props) => {
  let { userId } = useParams<any>();
  userId = Number(userId);
  const [user, setUser] = React.useState<HYPERDOT_API.CurrentUser>();
  React.useEffect(() => {
    if (userId) {
      getUser(userId)
        .then((res) => {
          if (!res.success) {
            message.error(res.errorMessage);
            return;
          }
          setUser(res.data);
        })
        .catch((err) => {
          message.error(err);
        });
      return;
    }

    getInitialState()
      .then((res) => {
        setUser(res.currentUser);
      })
      .catch((err) => {
        history.push('/user/login');
        return;
      });
  }, []);

  return (
    <>
      {user ? (
        <Row gutter={[0, 0]} justify="center" align="top">
          <Col span={3}>
            <UserIcon {...user} />
          </Col>
          <Col span={16}>
            <Introduce {...user} />
          </Col>
          {/* <Col span={3}>
            <Horner />
          </Col> */}

          {/* <Col span={18} style={{ marginTop: '48px' }}>
            <div className={styles.separator}>
              <span className={styles.textLeft}>左侧文本</span>
              <hr className={styles.line} />
              <span className={styles.textRight}>右侧文本</span>
            </div>
          </Col> */}

          <Col span={18} style={{ marginTop: '48px' }}>
            <Card title={user.username + ' dashboards'}>
              <Dashboards {...user} />
            </Card>
          </Col>

          <Col span={18} style={{ marginTop: '48px' }}>
            <Card title={user.username + ' queries'}>
              <Queries {...user} />
            </Card>
          </Col>
        </Row>
      ) : null}
    </>
  );
};

export default Profile;
