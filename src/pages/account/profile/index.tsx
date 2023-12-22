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

/**
 * Props for the List component.
 */
type ListProps = {
  /**
   * The current user object for the authenticated user.
   */
  currentUser: HYPERDOT_API.CurrentUser;

  /**
   * The user object for the guest user, if applicable.
   * This can be undefined if there is no guest user.
   */
  guestUser?: HYPERDOT_API.CurrentUser;
};

/**
 * Functional component representing a list of queries.
 * @param props - The properties for the Queries component.
 */
const Queries = (props: ListProps) => {
  // Number of items to display per page
  const pageSize = 3;

  // Current page number
  const [page, setPage] = React.useState(1);

  // Data to be displayed in the list
  const [data, setData] = React.useState<HYPERDOT_API.ListQueryData[]>([]);

  // Total number of items
  const [total, setTotal] = React.useState(0);

  // Determine the fetch method based on the presence of a guest user
  const fetchMethod = props.guestUser ? listBrowseQuery : listQuery;

  /**
   * Handles the change in page or page size.
   * @param p - The new page number.
   * @param ps - The new page size.
   */
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

  // Initial data fetch on component mount
  React.useEffect(() => {
    handleChange(page, pageSize);
  }, []);

  /**
   * Handles the change in page or page size and updates the current page.
   * @param p - The new page number.
   * @param ps - The new page size.
   */
  const onChange = (p: number, ps: number) => {
    handleChange(p, ps);
    setPage(p);
  };

  return (
    <>
      {/* Render the QueryList component if there is data to display */}
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

/**
 * Functional component representing a list of dashboards.
 * @param props - The properties for the Dashboards component.
 */
const Dashboards = (props: ListProps) => {
  // Number of dashboards to display per page
  const pageSize = 3;

  // Current page number
  const [page, setPage] = React.useState(1);

  // Data to be displayed in the list
  const [data, setData] = React.useState<HYPERDOT_API.Dashboard[]>([]);

  // Total number of dashboards
  const [total, setTotal] = React.useState(0);

  // Determine the fetch method based on the presence of a guest user
  const fetchMethod = props.guestUser ? listBrowseDashboard : listDashboard;

  /**
   * Handles the change in page or page size.
   * @param p - The new page number.
   * @param ps - The new page size.
   */
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

  // Initial data fetch on component mount
  React.useEffect(() => {
    handleChange(page, pageSize);
  }, []);

  /**
   * Handles the change in page or page size and updates the current page.
   * @param p - The new page number.
   * @param ps - The new page size.
   */
  const onChange = (p: number, ps: number) => {
    handleChange(p, ps);
    setPage(p);
  };

  return (
    <>
      {/* Render the DashboardList component if there is data to display */}
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

/**
 * Functional component representing social links and bio for a user.
 * @param user - The current user for whom social links and bio are displayed.
 */
const Social = (user: HYPERDOT_API.CurrentUser) => {
  return (
    <Row>
      {/* Display user bio if available */}
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

      {/* Display user Twitter link if available */}
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

      {/* Display user GitHub link if available */}
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

      {/* Display user Telegram link if available */}
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

      {/* Display user Discord link if available */}
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
                href={'https://discord.com/users/' + user.discord}
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

/**
 * Functional component representing statistics for a user.
 * @param user - The current user for whom statistics are displayed.
 */
const Statistics = (user: HYPERDOT_API.CurrentUser) => {
  return (
    <>
      {/* Display user stars statistics */}
      <Row className={styles.horner}>
        <Col span={24}>
          <span id="profile-statistics-stars-container">
            {formatNumberWithCommas(user.stars)} stars <StarFilled />{' '}
          </span>
        </Col>

        {/* Display user queries statistics */}
        <Col span={24}>
          <span id="profile-statistics-queries-container">
            {formatNumberWithCommas(user.queries)} queries <CodeOutlined />{' '}
          </span>
        </Col>

        {/* Display user dashboards statistics */}
        <Col span={24}>
          <span id="profile-statistics-dashboards-container">
            {formatNumberWithCommas(user.dashboards)} dashboards <DashboardOutlined />{' '}
          </span>
        </Col>
      </Row>
    </>
  );
};

/**
 * Functional component representing user introduction with username, social links, and statistics.
 * @param user - The current user for whom introduction is displayed.
 */
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

/**
 * Functional component representing a user icon.
 * @param user - The current user for whom the icon is displayed.
 */
const UserIcon = (user: HYPERDOT_API.CurrentUser) => {
  if (user.icon_url) {
    return <Avatar size={128} src={'/apis/v1/file?file=' + user.icon_url} />;
  }

  return <Avatar size={128}>{user.username}</Avatar>;
};

/**
 * Functional component representing the user profile page.
 * Retrieves and displays information about the current user or a specified guest user.
 */
const Profile = () => {
  // Extracts userId from route parameters
  let { userId } = useParams<any>();
  userId = Number(userId);

  // State for guest user, current user, and loading status for guest user
  const [guestUser, setGuestUser] = React.useState<HYPERDOT_API.CurrentUser | undefined>();
  const [currentUser, setCurrentUser] = React.useState<HYPERDOT_API.CurrentUser | undefined>();
  const [loadingGuest, setLoadingGuest] = React.useState<boolean>(false);

  // Fetches user data on component mount
  React.useEffect(() => {
    // Fetch data for a specific user if userId is provided
    if (userId) {
      setLoadingGuest(true);

      // Fetch data for the accessed user
      getUser(userId)
        .then((res) => {
          if (!res.success) {
            message.error(res.errorMessage);
            return;
          }
          setCurrentUser(res.data);

          // Fetch initial state for guest user
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
      // Fetch data for the current user if no userId is provided
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

  // Render the profile content if user data is available and guest user loading is complete
  return (
    <>
      {currentUser && !loadingGuest ? (
        <GridContent contentWidth={'Fixed'}>
          <Row gutter={[0, 0]} justify="center" align="top">
            {/* Display user icon */}
            <Col span={4}>
              <UserIcon {...currentUser} />
            </Col>

            {/* Display user introduction */}
            <Col span={16}>
              <Introduce {...currentUser} />
            </Col>

            {/* Display user dashboards */}
            <Col span={24} style={{ marginTop: '48px' }}>
              <Card title={currentUser.username + ' dashboards'}>
                <Dashboards currentUser={currentUser} guestUser={guestUser} />
              </Card>
            </Col>

            {/* Display user queries */}
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
