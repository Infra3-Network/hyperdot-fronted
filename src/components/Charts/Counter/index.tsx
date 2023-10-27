import { GridContent, WaterMark } from '@ant-design/pro-layout';
import {
  Card,
  Table,
  Row,
  Col,
  Statistic,
  Input,
  Select,
  Space,
  message,
  Empty,
  Radio,
} from 'antd';
import { type ChartProps } from '../types';
import { styles } from './index.less';
import { getColumns } from '../utils';

import hyperdotlogo from './hyperdot-logo.png';
import { ArrowDownOutlined, ArrowUpOutlined } from '@ant-design/icons';
import React from 'react';

type Props = {
  type: string;
  props: ChartProps;
  index: number; // which index of charts array.
};

type CounterChartProps = {
  data: any[];
  column?: string;
  rowNumber?: number;
  title?: string;
  prefix?: string;
  suffix?: string;
  color?: string;
  increment?: boolean;
};

export const CounterChart = (props: CounterChartProps) => {
  // if column is empty, we use fisrt column
  let col = props.column ? props.column : '';
  // if rowNumber is empty, we use first row
  const rowNumber = props.rowNumber ? props.rowNumber : 0;

  if (
    rowNumber < 0 ||
    rowNumber >= props.data.length ||
    Object.keys(props.data[rowNumber]).length <= 0
  ) {
    // message.error('Row number is out of range');
    return <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />;
  }

  const row = props.data[rowNumber];
  const keys = Object.keys(row);
  if (keys.find((key) => key === col) === undefined) {
    if (col != '') {
      message.error('Column is not found');
      return (
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description={
            <span>
              Customize <a href="#API">Description</a>
            </span>
          }
        />
      );
    }
    col = keys[0];
  }

  const value = row[col];

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
            {props.increment ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
            <span>{props.prefix}</span>
          </>
        }
        suffix={props.suffix}
        title={props.title}
        value={value}
        valueStyle={{ color: props.color }}
        precision={2}
      />
    </div>
  );
};

export const CounterChartTemplate = (props: Props) => {
  const columns = getColumns(props.props.data);
  columns.splice(0, 0, { value: '', label: '' });
  const config = props.props.params.config as CounterChartProps;
  const params = props.props.params;
  const manager = props.props.manager;
  const [counterProps, setCounterProps] = React.useState<CounterChartProps>(
    config
      ? {
          data: props.props.data.rows,
          column: config.column,
          rowNumber: config.rowNumber,
          title: config.title,
          prefix: config.prefix,
          suffix: config.suffix,
          color: config.color,
          increment: config.increment,
        }
      : {
          data: props.props.data.rows,
          column: columns[0].value,
          rowNumber: 0,
        },
  );

  if (!config) {
    manager.update(
      {
        ...params,
        config: counterProps,
      },
      props.index,
    );
  }

  return (
    <Row gutter={[0, 24]}>
      <Col span={24}>
        <Card>
          <CounterChart {...counterProps} />
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
                          defaultValue={params.name}
                          bordered={true}
                          onChange={(e) => {
                            manager.update(
                              {
                                ...params,
                                name: e.target.value,
                              },
                              props.index,
                            );
                          }}
                        />
                      </Col>

                      <Col span={6}>
                        <div>Counter title</div>
                      </Col>
                      <Col span={16}>
                        <Input
                          defaultValue={counterProps.title}
                          bordered={true}
                          onChange={(e) => {
                            setCounterProps({
                              ...counterProps,
                              title: e.target.value,
                            });

                            manager.update(
                              {
                                ...params,
                                config: {
                                  ...counterProps,
                                  title: e.target.value,
                                },
                              },
                              props.index,
                            );
                          }}
                        />
                      </Col>

                      <Col span={6}>
                        <div>Column</div>
                      </Col>

                      <Col span={18}>
                        <Select
                          options={columns}
                          style={{ width: '89%' }}
                          defaultValue={counterProps.column}
                          bordered={true}
                          onChange={(e) => {
                            setCounterProps({
                              ...counterProps,
                              column: e,
                            });

                            manager.update(
                              {
                                ...params,
                                config: {
                                  ...counterProps,
                                  column: e,
                                },
                              },
                              props.index,
                            );
                          }}
                        />
                      </Col>

                      <Col span={6}>
                        <div>Row number</div>
                      </Col>
                      <Col span={16}>
                        <Input
                          defaultValue={counterProps.rowNumber}
                          bordered={true}
                          onChange={(e) => {
                            const newValue = parseInt(e.target.value);
                            if (!newValue) {
                              message.error('Row number must be a number');
                              return;
                            }

                            if (newValue < 0 || newValue >= counterProps.data.length) {
                              message.error('Row number is out of range');
                              return;
                            }

                            setCounterProps({
                              ...counterProps,
                              rowNumber: parseInt(e.target.value),
                            });

                            manager.update(
                              {
                                ...params,
                                config: {
                                  ...counterProps,
                                  rowNumber: parseInt(e.target.value),
                                },
                              },
                              props.index,
                            );
                          }}
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
                          defaultValue={counterProps.prefix}
                          bordered={true}
                          onChange={(e) => {
                            setCounterProps({
                              ...counterProps,
                              prefix: e.target.value,
                            });

                            manager.update(
                              {
                                ...params,
                                config: {
                                  ...counterProps,
                                  prefix: e.target.value,
                                },
                              },
                              props.index,
                            );
                          }}
                        />
                      </Col>

                      <Col span={6}>
                        <div>Suffix</div>
                      </Col>
                      <Col span={16}>
                        <Input
                          placeholder={'M'}
                          defaultValue={counterProps.suffix}
                          bordered={true}
                          onChange={(e) => {
                            setCounterProps({
                              ...counterProps,
                              suffix: e.target.value,
                            });

                            manager.update(
                              {
                                ...params,
                                config: {
                                  ...counterProps,
                                  suffix: e.target.value,
                                },
                              },
                              props.index,
                            );
                          }}
                        />
                      </Col>

                      <Col span={6}>
                        <div>Value color</div>
                      </Col>
                      <Col span={16}>
                        <Input
                          placeholder={''}
                          defaultValue={counterProps.color}
                          bordered={true}
                          onChange={(e) => {
                            setCounterProps({
                              ...counterProps,
                              color: e.target.value,
                            });

                            manager.update(
                              {
                                ...params,
                                config: {
                                  ...counterProps,
                                  color: e.target.value,
                                },
                              },
                              props.index,
                            );
                          }}
                        />
                      </Col>

                      <Col span={6}>
                        <div>Status</div>
                      </Col>
                      <Col span={16}>
                        <Radio.Group
                          defaultValue={counterProps.increment ? 'increment' : 'decrement'}
                          onChange={(e) => {
                            if (e.target.value === 'increment') {
                              setCounterProps({
                                ...counterProps,
                                increment: true,
                              });

                              manager.update(
                                {
                                  ...params,
                                  config: {
                                    ...counterProps,
                                    increment: true,
                                  },
                                },
                                props.index,
                              );
                            } else {
                              setCounterProps({
                                ...counterProps,
                                increment: false,
                              });

                              manager.update(
                                {
                                  ...params,
                                  config: {
                                    ...counterProps,
                                    increment: false,
                                  },
                                },
                                props.index,
                              );
                            }
                          }}
                        >
                          <Radio.Button type={'primary'} value="increment">
                            Increment
                          </Radio.Button>
                          <Radio.Button type={'primary'} value="decrement">
                            Decrement
                          </Radio.Button>
                        </Radio.Group>
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
