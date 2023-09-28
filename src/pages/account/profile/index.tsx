import { getInitialState } from '@/app';
import MyIcon from '@/components/Icons';
import {
  BookOutlined,
  CodeOutlined,
  DashboardOutlined,
  StarFilled,
  TwitterOutlined,
} from '@ant-design/icons';
import { history } from 'umi';
import { Avatar, Card, Col, Divider, Row } from 'antd';
import React from 'react';
import styles from './index.less';
type Props = {
  user_id?: number;
};

const Introduce = (props: Props) => {
  return (
    <>
      <Row>
        <Col span={24}>
          <h1> springzhang </h1>
        </Col>
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

        <Col span={12}>
          <div className={styles.introduce}>
            <span>
              <TwitterOutlined />
            </span>
            <span>@superamscom</span>
          </div>
        </Col>

        <Col span={12}>
          <div className={styles.introduce}>
            <span>
              <MyIcon type="icon-github" />
            </span>
            <span>@superamscom</span>
          </div>
        </Col>

        <Col span={12}>
          <div className={styles.introduce}>
            <span>
              <MyIcon type="icon-telgram" />
            </span>
            <span>@superamscom</span>
          </div>
        </Col>

        <Col span={12}>
          <div className={styles.introduce}>
            <span>
              <MyIcon type="icon-discord" />
            </span>
            <span>@superamscom</span>
          </div>
        </Col>
      </Row>
    </>
  );
};

const Horner = (props: Props) => {
  return (
    <>
      <Row className={styles.horner}>
        <Col span={24}>
          <span>
            12,662 stars <StarFilled />{' '}
          </span>
        </Col>
        <Col span={24}>
          <span>
            1,279 queries <CodeOutlined />{' '}
          </span>
        </Col>
        <Col span={24}>
          <span>
            56 dashboards <DashboardOutlined />{' '}
          </span>
        </Col>
      </Row>
    </>
  );
};

const Profile = (props: Props) => {
  const [user, setUser] = React.useState<HYPERDOT_API.CurrentUser>();
  React.useEffect(() => {
    if (props.user_id) {
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

  console.log(user);

  return (
    <>
      {user ? (
        <Row gutter={[0, 0]} justify="center" align="bottom">
          <Col span={3}>
            <div>
              <img
                style={{ width: '128px', height: '128px', borderRadius: '50%', objectFit: 'cover' }}
                src="https://prod-dune-media.s3.eu-west-1.amazonaws.com/profile_img_fed5a1a7-edb3-4209-a33b-0f65ef1ce9ad_anjsy.png"
              />
            </div>
          </Col>
          <Col span={8}>
            <Introduce />
          </Col>
          <Col span={2}>
            <Horner />
          </Col>

          <Col span={18} style={{ marginTop: '48px' }}>
            <div className={styles.separator}>
              <span className={styles.textLeft}>左侧文本</span>
              <hr className={styles.line} />
              <span className={styles.textRight}>右侧文本</span>
            </div>
          </Col>

          <Col span={18} style={{ marginTop: '48px' }}>
            <Card title="springzhang dashboards"></Card>
          </Col>

          <Col span={18} style={{ marginTop: '48px' }}>
            <Card title="springzhang queries"></Card>
          </Col>
        </Row>
      ) : null}
    </>
  );
};

export default Profile;
