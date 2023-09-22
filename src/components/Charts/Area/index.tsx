import { Row, Col, Select, Input, Card, Radio, Tooltip, Space, Slider as AntSlider } from 'antd';

import React, { useEffect } from 'react';

import { Area } from '@ant-design/charts';
import { QuestionCircleOutlined } from '@ant-design/icons';
import { WaterMark } from '@ant-design/pro-layout';
import { ChartManager, ChartParams, type ChartProps } from '../types';
import { getColumns } from '../utils';

const handleCloumnSelect = (
  setParams: React.Dispatch<React.SetStateAction<HYPERDOT_CHART.ChartParams>>,
  value: any,
  col: string,
) => {
  if (col == 'x') {
    setParams((prev) => {
      const newConfig = { ...prev, xField: value };

      return {
        ...prev,
        config: newConfig,
      };
    });
  }
  if (col == 'y') {
    setParams((prev) => {
      const newConfig = { ...prev, yField: value };

      return {
        ...prev,
        config: newConfig,
      };
    });
  }

  if (col == 's') {
    setParams((prev) => {
      const newConfig = { ...prev, seriesField: value };

      return {
        ...prev,
        config: newConfig,
      };
    });
  }
};

const handleAxisChange = (
  setParams: React.Dispatch<React.SetStateAction<HYPERDOT_CHART.ChartParams>>,
  setConfig: React.Dispatch<React.SetStateAction<HYPERDOT_CHART.AreaChartConfig>>,
  col: string,
  field: string,
  value: any,
) => {
  if (col === 'x') {
    setConfig((prev) => {
      const newXAxis = prev.xAxis ? prev.xAxis : {};
      switch (field) {
        case 'top':
          newXAxis.top = value;
          break;
        case 'position':
          newXAxis.position = value;
          break;
        case 'range':
          console.log(value);
          newXAxis.range = value;
          break;
      }
      const newConfig = {
        ...prev,
        xAxis: newXAxis,
      };
      setParams((prevParams) => {
        return {
          ...prevParams,
          config: newConfig,
        };
      });
      return newConfig;
    });
  }

  if (col === 'y') {
    setConfig((prev) => {
      const newYAxis = prev.yAxis ? prev.yAxis : {};
      switch (field) {
        case 'top':
          newYAxis.top = value;
          break;
        case 'position':
          newYAxis.position = value;
          break;
        case 'range':
          newYAxis.range = value;
          break;
      }
      const newConfig = {
        ...prev,
        yAxis: newYAxis,
      };
      setParams((prevParams) => {
        return {
          ...prevParams,
          config: newConfig,
        };
      });
      return newConfig;
    });
  }
};

export const AreaChart = (props: ChartProps) => {
  const manager = props.manager;
  const params = props.params;
  const data = props.data;
  const config = params.config as HYPERDOT_CHART.AreaChartConfig;
  const schemas: any[] = data.schemas;
  const x = config ? config.xField : schemas.length < 1 ? '' : (schemas[0].name as string);
  const y = config ? config.yField : schemas.length < 2 ? '' : (schemas[1].name as string);
  const seriesField = config
    ? config.seriesField
      ? config.seriesField
      : ''
    : schemas.length < 3
    ? ''
    : (schemas[2].name as string);
  const defaultConfig = {
    data: data.rows,
    xField: x,
    yField: y,
    seriesField: seriesField,
    xAxis: {
      top: false,
      position: 'bottom',
      range: [0, 1],
    },
    yAxis: {
      top: false,
      position: 'right',
      range: [0, 1],
    },
    areaStyle: () => {
      return {
        fill: 'l(270) 0:#ffffff 0.5:#7ec2f3 1:#1890ff',
      };
    },
  };

  const defaultState = {
    id: params.id,
    name: params.name ? params.name : 'Area Chart',
    config: config
      ? {
          ...config,
          data: data.rows,
        }
      : defaultConfig,
  };

  const [state, setState] = React.useState<any>(defaultState);
  // const [title, setTitle] = React.useState<string>(name ? name : 'Area Chart');
  // const [areaConfig, setConfig] = React.useState<HYPERDOT_CHART.AreaChartConfig>(
  //   config
  //     ? {
  //         ...config,
  //         data: data.rows,
  //       }
  //     : defaultConfig,
  // );

  useEffect(() => {
    if (config != undefined) {
      // initial tabs by using defaultConfig
      //   props.setTabProps({ ...TabManager.updateConfig(props.tabProps, props.id, defaultConfig) });
      // } else {
      // config changes, reset data
      config.data = data.rows;
      setState((prev: any) => {
        return { ...prev, config: config };
      });
    }
  }, [config, data]);

  const columns = getColumns(data);

  const handleNameChange = (event: any) => {
    if (params.id == undefined) {
      return;
    }

    const oldChart = manager.get(params.id);
    if (!oldChart) {
      return;
    }

    const v = event.target.value;
    setState((prev: any) => {
      return {
        ...prev,
        name: v,
      };
    });

    manager.update({
      ...oldChart,
      name: v,
    });
  };

  return (
    <>
      <Row gutter={24}>
        <Col span={24}>
          <Card>
            <WaterMark content={'Hyperdot'}>
              <Area
                {...{
                  data,
                  ...state.config,
                }}
              />
            </WaterMark>
          </Card>
        </Col>
      </Row>

      <Row gutter={24} style={{ paddingTop: '12px' }}>
        <Col span={24}>
          <Card bordered={false}>
            <Row gutter={16}>
              <Col span={8}>
                {/* Chart options */}
                <Card>
                  <Card type="inner" title={'Chart options'}>
                    <Row gutter={[0, 2]} style={{ margin: '0' }}>
                      <Col span={24}>
                        <Row>
                          <Col span={6}>
                            <div>Title</div>
                          </Col>

                          <Col span={16}>
                            <Input
                              defaultValue={params.name}
                              bordered={true}
                              onPressEnter={(e) => {
                                handleNameChange(e);
                              }}
                            />
                          </Col>
                        </Row>
                      </Col>
                    </Row>
                  </Card>
                </Card>
              </Col>

              {/* Result data */}
              <Col span={8}>
                <Card>
                  <Card type="inner" title="Result data">
                    <Row gutter={[0, 12]}>
                      <Col span={24}>
                        <Row>
                          <Col span={6}>X column</Col>

                          <Col span={18}>
                            <Select
                              defaultValue={x}
                              bordered={true}
                              style={{ width: '100%' }}
                              options={columns}
                              onSelect={(value) => {
                                handleCloumnSelect(setParams, value, 'x');
                              }}
                            />
                          </Col>
                        </Row>
                      </Col>

                      <Col span={24}>
                        <Row>
                          <Col span={6}>Y column</Col>

                          <Col span={18}>
                            <Select
                              defaultValue={y}
                              bordered={true}
                              style={{ width: '100%' }}
                              options={columns}
                              onSelect={(value) => {
                                handleCloumnSelect(setParams, value, 'y');
                              }}
                            />
                          </Col>
                        </Row>
                      </Col>

                      <Col span={24}>
                        <Row>
                          <Col span={6}>Series column</Col>
                          <Col span={18}>
                            <Select
                              defaultValue={seriesField}
                              bordered={true}
                              style={{ width: '100%' }}
                              options={columns}
                              onSelect={(value) => {
                                handleCloumnSelect(setParams, value, 's');
                              }}
                            />
                          </Col>
                        </Row>
                      </Col>
                    </Row>
                  </Card>
                </Card>
              </Col>

              {/* X/Y-axis options */}
              <Col span={8}>
                {/* X-axis */}
                <Card>
                  <Row gutter={[0, 12]}>
                    <Col span={24}>
                      <Card type="inner" title="X-axis options">
                        <Row gutter={[0, 12]}>
                          {/* top */}
                          <Col span={24}>
                            <Space size={'middle'}>
                              <div>
                                <span style={{ marginRight: '2px' }}>Top</span>
                                <span>
                                  <Tooltip title="Whether to render it on the top layer of the canvas to prevent certain graphics from obscuring the axis, ensuring that the axis is displayed above the graphics.">
                                    <QuestionCircleOutlined />
                                  </Tooltip>
                                </span>
                              </div>
                              <Radio.Group
                                value={state.config.xAxis ? state.config.xAxis.top : false}
                                onChange={(e) => {
                                  handleAxisChange(
                                    setParams,
                                    setConfig,
                                    'x',
                                    'top',
                                    e.target.value,
                                  );
                                }}
                              >
                                <Radio value={true}>true</Radio>
                                <Radio value={false}>false</Radio>
                              </Radio.Group>
                            </Space>
                          </Col>

                          {/* position */}
                          <Col span={24}>
                            <Space size={'middle'}>
                              <div>
                                <span style={{ marginRight: '2px' }}>Position</span>
                                <span>
                                  <Tooltip title="For Cartesian coordinates, set the position of the coordinate axes. ">
                                    <QuestionCircleOutlined />
                                  </Tooltip>
                                </span>
                              </div>
                              <Select
                                onChange={(value) => {
                                  handleAxisChange(setParams, setConfig, 'x', 'position', value);
                                }}
                                defaultValue={
                                  state.config.xAxis ? state.config.xAxis.position : 'bottom'
                                }
                                options={[
                                  { value: 'top', label: 'top' },
                                  { value: 'bottom', label: 'bottom' },
                                  { value: 'left', label: 'left' },
                                  { value: 'right', label: 'right' },
                                ]}
                              />
                            </Space>
                          </Col>

                          {/* range */}
                          <Col span={24}>
                            <span style={{ marginRight: '2px' }}>Range</span>
                            <span>
                              <Tooltip title="Adjusting the range of icon display.">
                                <QuestionCircleOutlined />
                              </Tooltip>
                            </span>
                            <AntSlider
                              range
                              defaultValue={state.config.xAxis ? state.config.xAxis.range : [0, 1]}
                              min={0}
                              max={1}
                              step={0.1}
                              onChange={(v) => {
                                handleAxisChange(setParams, setConfig, 'x', 'range', v);
                              }}
                            />
                          </Col>
                        </Row>
                      </Card>
                    </Col>

                    {/* Y-axis */}
                    <Col span={24}>
                      <Card type="inner" title="Y-axis options">
                        <Row gutter={[0, 12]}>
                          {/* top */}
                          <Col span={24}>
                            <Space size={'middle'}>
                              <div>
                                <span style={{ marginRight: '2px' }}>Top</span>
                                <span>
                                  <Tooltip title="Whether to render it on the top layer of the canvas to prevent certain graphics from obscuring the axis, ensuring that the axis is displayed above the graphics.">
                                    <QuestionCircleOutlined />
                                  </Tooltip>
                                </span>
                              </div>
                              <Radio.Group
                                value={state.config.yAxis ? state.config.yAxis.top : false}
                                onChange={(e) => {
                                  handleAxisChange(
                                    setParams,
                                    setConfig,
                                    'y',
                                    'top',
                                    e.target.value,
                                  );
                                }}
                              >
                                <Radio value={true}>true</Radio>
                                <Radio value={false}>false</Radio>
                              </Radio.Group>
                            </Space>
                          </Col>

                          {/* position */}
                          <Col span={24}>
                            <Space size={'middle'}>
                              <div>
                                <span style={{ marginRight: '2px' }}>Position</span>
                                <span>
                                  <Tooltip title="For Cartesian coordinates, set the position of the coordinate axes. ">
                                    <QuestionCircleOutlined />
                                  </Tooltip>
                                </span>
                              </div>
                              <Select
                                onChange={(value) => {
                                  handleAxisChange(setParams, setConfig, 'y', 'position', value);
                                }}
                                defaultValue={
                                  state.config.yAxis ? state.config.yAxis.position : 'right'
                                }
                                options={[
                                  { value: 'top', label: 'top' },
                                  { value: 'bottom', label: 'bottom' },
                                  { value: 'left', label: 'left' },
                                  { value: 'right', label: 'right' },
                                ]}
                              />
                            </Space>
                          </Col>

                          {/* range */}
                          <Col span={24}>
                            <span style={{ marginRight: '2px' }}>Range</span>
                            <span>
                              <Tooltip title="Adjusting the range of icon display.">
                                <QuestionCircleOutlined />
                              </Tooltip>
                            </span>
                            <AntSlider
                              range
                              defaultValue={state.config.yAxis ? state.config.yAxis.range : [0, 1]}
                              min={0}
                              max={1}
                              step={0.1}
                              onChange={(v) => {
                                handleAxisChange(setParams, setConfig, 'y', 'range', v);
                              }}
                            />
                          </Col>
                        </Row>
                      </Card>
                    </Col>
                  </Row>
                </Card>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
    </>
  );
};
