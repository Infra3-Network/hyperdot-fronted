import { Row, Col, Input, Card, Radio } from 'antd';
import React from 'react';
import styles from './index.less';
type Props = {
  order: string;
  setOrder: React.Dispatch<React.SetStateAction<string>>;
  favoritesTimeRange: string;
  setFavoritesTimeRange: React.Dispatch<React.SetStateAction<string>>;
  trendingTimeRange: string;
  setTrendingTimeRange: React.Dispatch<React.SetStateAction<string>>;
  onParamChange: (type: string, newValue: any) => void;
  name: string;
};

const Rank = (props: Props) => {
  return (
    <Card>
      <Row gutter={[0, 12]}>
        <Col span={24}>
          <span>Rank {props.name} by</span>
        </Col>
        <Col span={24}>
          <Radio.Group
            size="small"
            onChange={(e) => {
              props.setOrder(e.target.value);
              props.onParamChange('order', e.target.value);
            }}
            value={props.order}
            className={styles.rankContainer}
          >
            <Radio.Button value="favorites">⭐ Favorites</Radio.Button>
            <Radio.Button value="trending">🔥 Trending</Radio.Button>
            <Radio.Button value="new">🎊 New</Radio.Button>
          </Radio.Group>
        </Col>

        {props.order == 'favorites' && (
          <>
            <Col span={24}>⭐ Favroites Time range</Col>
            <Col span={24}>
              <Radio.Group
                size="small"
                buttonStyle="solid"
                value={props.favoritesTimeRange}
                onChange={(e) => {
                  props.setFavoritesTimeRange(e.target.value);
                  props.onParamChange('favoritesTimeRange', e.target.value);
                }}
                className={styles.timeContainer}
              >
                <Radio.Button value="24h">24 hours</Radio.Button>
                <Radio.Button value="7d">7 days</Radio.Button>
                <Radio.Button value="30d">30 days</Radio.Button>
                <Radio.Button id="rank-alltime-btn" value="all">
                  All time
                </Radio.Button>
              </Radio.Group>
            </Col>
          </>
        )}

        {props.order == 'trending' && (
          <>
            <Col span={24}>🔥 Trending Time range</Col>
            <Col span={24}>
              <Radio.Group
                size="small"
                buttonStyle="solid"
                onChange={(e) => {
                  props.setTrendingTimeRange(e.target.value);
                  props.onParamChange('trendingTimeRange', e.target.value);
                }}
                value={props.trendingTimeRange}
                className={styles.timeContainer}
              >
                <Radio.Button value="1h">1 hour</Radio.Button>
                <Radio.Button value="4h">4 hours</Radio.Button>
                <Radio.Button value="24h">24 hours</Radio.Button>
              </Radio.Group>
            </Col>
          </>
        )}

        <Col span={24}>Search for dashboards</Col>
        <Col span={24}>
          <Input placeholder="NFT..." />
        </Col>
      </Row>
    </Card>
  );
};

export default Rank;
