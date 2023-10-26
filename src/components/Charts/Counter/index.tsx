import { GridContent, WaterMark } from '@ant-design/pro-layout';
import { Card, Table, Row, Col, Statistic, Input, Select, Space } from 'antd';
import { type ChartProps } from '../types';
import { styles } from './index.less';

import hyperdotlogo from './hyperdot-logo.png';
import { ArrowDownOutlined, ArrowUpOutlined } from '@ant-design/icons';

type Props = {
  type: string;
  props: ChartProps;
  index: number; // which index of charts array.
};

type CounterChartProps = {
  value: any;
  title?: string;
  prefix?: string;
  suffix?: string;
  color?: string;
  currentPriceLabel?: string;
  increment?: boolean;
  decrement?: boolean;
};

export const CounterChart = (props: CounterChartProps) => {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '200px',
      }}
    >
      <img
        style={{
          position: 'absolute',
          top: '10%',
          left: 0,
          bottom: 0,
          right: 0,
          opacity: '.1',
          height: '100%',
          margin: 'auto',
        }}
        src={hyperdotlogo}
        alt=""
      />

      <Statistic
        prefix={
          <>
            {props.increment && <ArrowUpOutlined />}
            {props.decrement && <ArrowDownOutlined />}
            <span>{props.prefix}</span>
          </>
        }
        suffix={props.suffix}
        title={props.title}
        value={props.value}
        valueStyle={{ color: props.color }}
        precision={2}
      />
    </div>
  );
};

export const CounterChartTemplate = (props: Props) => {
  return (
    <Row gutter={[0, 24]}>
      <Col span={24}>
        <Card>
          <CounterChart
            title={'Current price'}
            prefix={'$'}
            suffix={'M'}
            value={123.45}
            color={'#3f8600'}
            decrement={true}
          />
        </Card>
      </Col>

      <Col span={24}>
        <Card>
          <Row gutter={12}>
            <Col span={8}>
              {/* Chart options */}
              <Card type="inner" title={'Counter options'}>
                <Row gutter={[0, 12]} style={{ margin: '0' }}>
                  <Col span={24}>
                    <Row gutter={[0, 16]}>
                      <Col span={6}>
                        <div>Title</div>
                      </Col>
                      <Col span={16}>
                        <Input
                          // defaultValue={params.name}
                          bordered={true}
                          // onChange={(e) => {
                          //   handleNameChange(e);
                          // }}
                        />
                      </Col>

                      <Col span={6}>
                        <div>Column</div>
                      </Col>

                      <Col span={18}>
                        <Select
                          // defaultValue={params.name}
                          bordered={true}
                          // onChange={(e) => {
                          //   handleNameChange(e);
                          // }}
                        />
                      </Col>

                      <Col span={6}>
                        <div>Row number</div>
                      </Col>
                      <Col span={16}>
                        <Input
                          // defaultValue={params.name}
                          bordered={true}
                          // onChange={(e) => {
                          //   handleNameChange(e);
                          // }}
                        />
                      </Col>
                    </Row>
                  </Col>
                </Row>
              </Card>
            </Col>

            <Col span={8}>
              <Card type="inner" title={'Formatting'}>
                <Row gutter={[0, 12]} style={{ margin: '0' }}>
                  <Col span={24}>
                    <Row gutter={[0, 16]}>
                      <Col span={6}>
                        <div>Prefix</div>
                      </Col>
                      <Col span={16}>
                        <Input
                          placeholder={'$'}
                          // defaultValue={params.name}
                          bordered={true}
                          // onChange={(e) => {
                          //   handleNameChange(e);
                          // }}
                        />
                      </Col>

                      <Col span={6}>
                        <div>Suffix</div>
                      </Col>
                      <Col span={16}>
                        <Input
                          placeholder={'M'}
                          bordered={true}
                          // onChange={(e) => {
                          //   handleNameChange(e);
                          // }}
                        />
                      </Col>

                      <Col span={6}>
                        <div>Current price label</div>
                      </Col>
                      <Col span={16}>
                        <Input
                          placeholder={'Current price'}
                          bordered={true}
                          // onChange={(e) => {
                          //   handleNameChange(e);
                          // }}
                        />
                      </Col>

                      <Col span={6}>
                        <div>Value color</div>
                      </Col>
                      <Col span={16}>
                        <Input
                          placeholder={''}
                          bordered={true}
                          // onChange={(e) => {
                          //   handleNameChange(e);
                          // }}
                        />
                      </Col>
                    </Row>
                  </Col>
                </Row>
              </Card>
            </Col>
          </Row>
        </Card>
      </Col>
    </Row>
  );
};
