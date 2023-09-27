import {
  BookOutlined,
  CodeOutlined,
  DashboardOutlined,
  StarFilled,
  TwitterOutlined,
} from '@ant-design/icons';
import { Avatar, Card, Col, Divider, Row } from 'antd';
import React from 'react';
import styles from './index.less';
type Props = {};

const Introduce = (props: Props) => {
  return (
    <>
      <Row>
        <Col span={24}>
          <h1> springzhang </h1>
        </Col>
        <Col span={24}>
          <span>
            <BookOutlined />
          </span>
          <span>
            Looking for cooperation opportunities in Data Analytics, WEB3/WEB2 Development.
          </span>
        </Col>

        <Col span={12}>
          <span>
            <TwitterOutlined />
          </span>
          <span>@superamscom</span>
        </Col>

        <Col span={12}>
          <span>
            <TwitterOutlined />
          </span>
          <span>@superamscom</span>
        </Col>

        <Col span={12}>
          <span>
            <TwitterOutlined />
          </span>
          <span>@superamscom</span>
        </Col>

        <Col span={12}>
          <span>
            <TwitterOutlined />
          </span>
          <span>@superamscom</span>
        </Col>

        <Col span={12}>
          <span>
            <TwitterOutlined />
          </span>
          <span>@superamscom</span>
        </Col>

        <Col span={12}>
          <span>
            <TwitterOutlined />
          </span>
          <span>@superamscom</span>
        </Col>
      </Row>
    </>
  );
};

const Horner = (props: Props) => {
  return (
    <>
      <Row style={{ marginTop: '42px' }}>
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
  return (
    <>
      <Row gutter={[0, 0]}>
        <Col span={3} offset={5}>
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
        <Col>
          <Horner />
        </Col>

        <Col span={18} offset={3} style={{ marginTop: '48px' }}>
          <div className={styles.separator}>
            <span className={styles.textLeft}>左侧文本</span>
            <hr className={styles.line} />
            <span className={styles.textRight}>右侧文本</span>
          </div>
        </Col>

        <Col span={18} offset={3} style={{ marginTop: '48px' }}>
          <Card title="springzhang dashboards"></Card>
        </Col>

        <Col span={18} offset={3} style={{ marginTop: '48px' }}>
          <Card title="springzhang queries"></Card>
        </Col>
      </Row>
    </>
  );
};

export default Profile;
