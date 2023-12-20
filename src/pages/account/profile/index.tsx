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
import {
  getUser,
  listBrowseDashboard,
  listBrowseQuery,
  listDashboard,
  listQuery,
} from '@/services/hyperdot/api';
import QueryList from '@/components/QueryList';
import DashboardList from '@/components/DashboardList';
import { GridContent } from '@ant-design/pro-layout';

type ListProps = {
  currentUser: HYPERDOT_API.CurrentUser;
  guestUser: HYPERDOT_API.CurrentUser | undefined;
};

const Queries = (props: ListProps) => {
  const pageSize = 3;
  const [page, setPage] = React.useState(1);
  const [data, setData] = React.useState<HYPERDOT_API.ListQueryData[]>([]);
  const [total, setTotal] = React.useState(0);

  const fetchMethod = props.guestUser ? listBrowseQuery : listQuery;
  const handleChange = (p: number, ps: number) => {
    fetchMethod({
      page: p,
      pageSize: ps,
      userId: props.currentUser.id,
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
      {data && data.length > 0 && (
        <QueryList
          {...{
            currentUser: props.currentUser,
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

const Dashboards = (props: ListProps) => {
  const pageSize = 3;
  const [page, setPage] = React.useState(1);
  const [data, setData] = React.useState<HYPERDOT_API.Dashboard[]>([]);
  const [total, setTotal] = React.useState(0);

  const fetchMethod = props.guestUser ? listBrowseDashboard : listDashboard;
  const handleChange = (p: number, ps: number) => {
    fetchMethod({
      page: p,
      pageSize: ps,
      userId: props.currentUser.id,
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
      {data && data.length > 0 && (
        <DashboardList
          {...{
            currentUser: props.currentUser,
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

export const Social = (user: HYPERDOT_API.CurrentUser) => {
  return (
    <Row>
      {user.bio && (
        <Col span={24}>
          <div style={{ alignItems: 'start' }}>
            <span style={{ marginRight: '2px' }}>
              <BookOutlined />
            </span>
            <span id="profile-bio-container">{user.bio}</span>
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
                <span id="profile-twitter-container">@{user.twitter}</span>
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
                <span id="profile-github-container">@{user.github}</span>
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
                <span id="profile-telgram-container">@{user.telgram}</span>
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
                <span id="profile-discord-container">@{user.discord}</span>
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
          <span id="profile-statistics-stars-container">
            {formatNumberWithCommas(user.stars)} stars <StarFilled />{' '}
          </span>
        </Col>
        <Col span={24}>
          <span id="profile-statistics-queries-container">
            {formatNumberWithCommas(user.queries)} queries <CodeOutlined />{' '}
          </span>
        </Col>
        <Col span={24}>
          <span id="profile-statistics-dashboards-container">
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

const Profile = () => {
  let { userId } = useParams<any>();
  userId = Number(userId);
  const [guestUser, setGuestUser] = React.useState<HYPERDOT_API.CurrentUser | undefined>();
  const [currentUser, setCurrentUser] = React.useState<HYPERDOT_API.CurrentUser | undefined>();
  const [loadingGuest, setLoadingGuest] = React.useState<boolean>(false);
  React.useEffect(() => {
    if (userId) {
      setLoadingGuest(true);
      // accessed user
      getUser(userId)
        .then((res) => {
          if (!res.success) {
            message.error(res.errorMessage);
            return;
          }
          setCurrentUser(res.data);

          // guest user
          getInitialState()
            .then((initRes) => {
              setGuestUser(initRes.currentUser);
            })
            .catch((err) => {
              history.push('/user/login');
              return;
            })
            .finally(() => {
              setLoadingGuest(false);
            });
        })
        .catch((err) => {
          message.error(err);
        });
      return;
    } else {
      // current user
      getInitialState()
        .then((initRes) => {
          setCurrentUser(initRes.currentUser);
        })
        .catch((err) => {
          history.push('/user/login');
          return;
        });
    }
  }, []);

  return (
    <>
      {currentUser && !loadingGuest ? (
        <GridContent contentWidth={'Fixed'}>
          <Row gutter={[0, 0]} justify="center" align="top">
            <Col span={4}>
              <UserIcon {...currentUser} />
            </Col>
            <Col span={16}>
              <Introduce {...currentUser} />
            </Col>

            <Col span={24} style={{ marginTop: '48px' }}>
              <Card title={currentUser.username + ' dashboards'}>
                <Dashboards currentUser={currentUser} guestUser={guestUser} />
              </Card>
            </Col>

            <Col span={24} style={{ marginTop: '48px' }}>
              <Card title={currentUser.username + ' queries'}>
                <Queries currentUser={currentUser} guestUser={guestUser} />
              </Card>
            </Col>
          </Row>
        </GridContent>
      ) : null}
    </>
  );
};

export default Profile;
