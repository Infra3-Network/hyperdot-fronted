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
import { Avatar, Card, Col, Divider, Row } from 'antd';
import React from 'react';
import styles from './index.less';
import { formatNumberWithCommas } from '@/utils';
import { getUser, listQuery, listUserQuery } from '@/services/hyperdot/api';
import ContentList from '@/components/List';

type Props = {};

const Queries = (user: HYPERDOT_API.CurrentUser) => {
  const [data, setData] = React.useState<HYPERDOT_API.ListQueryData[]>([]);
  React.useEffect(() => {
    listUserQuery(1, 10, user.id)
      .then((res) => {
        if (res.data == undefined) {
          return;
        }
        setData(res.data);
      })
      .catch((err) => {});
  }, []);
  return <>{data && <ContentList data={data} />}</>;
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
            <span>
              Looking for cooperation opportunities in Data Analytics, WEB3/WEB2 Development.
            </span>
          </div>
        </Col>
      )}

      {user.twitter && (
        <Col span={12}>
          <div className={styles.introduce}>
            <span>
              <TwitterOutlined />
            </span>
            <span>@superamscom</span>
          </div>
        </Col>
      )}

      {user.github && (
        <Col span={12}>
          <div className={styles.introduce}>
            <span>
              <MyIcon type="icon-github" />
            </span>
            <span>@superamscom</span>
          </div>
        </Col>
      )}

      {user.telgram && (
        <Col span={12}>
          <div className={styles.introduce}>
            <span>
              <MyIcon type="icon-telgram" />
            </span>
            <span>@superamscom</span>
          </div>
        </Col>
      )}

      {user.discord && (
        <Col span={12}>
          <div className={styles.introduce}>
            <span>
              <MyIcon type="icon-discord" />
            </span>
            <span>@superamscom</span>
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
    return (
      <Avatar
        style={{ width: '128px', height: '128px', borderRadius: '50%', objectFit: 'cover' }}
        src="https://prod-dune-media.s3.eu-west-1.amazonaws.com/profile_img_fed5a1a7-edb3-4209-a33b-0f65ef1ce9ad_anjsy.png"
      />
    );
  }

  return (
    <Avatar
      size={'large'}
      style={{
        width: '128px',
        height: '128px',
        verticalAlign: 'middle',
        textAlign: 'center',
        backgroundColor: '#7265e6',
      }}
    >
      {user.username}
    </Avatar>
  );
};

const Profile = (props: Props) => {
  let { userId } = useParams<any>();
  userId = Number(userId);
  const [user, setUser] = React.useState<HYPERDOT_API.CurrentUser>();
  React.useEffect(() => {
    if (userId) {
      getUser(userId)
        .then((res) => {
          setUser(res.data);
        })
        .catch((err) => {
          console.log(err);
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

          <Col span={18} style={{ marginTop: '48px' }}>
            <div className={styles.separator}>
              <span className={styles.textLeft}>左侧文本</span>
              <hr className={styles.line} />
              <span className={styles.textRight}>右侧文本</span>
            </div>
          </Col>

          <Col span={18} style={{ marginTop: '48px' }}>
            <Card title={user.username + ' dashboards'}>
              <Queries {...user} />
            </Card>
          </Col>

          <Col span={18} style={{ marginTop: '48px' }}>
            <Card title={user.username + ' queries'}></Card>
          </Col>
        </Row>
      ) : null}
    </>
  );
};

export default Profile;
