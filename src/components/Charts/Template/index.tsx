import {
  Row,
  Col,
  Select,
  Input,
  Card,
  Radio,
  Tooltip,
  Space,
  Slider as AntSlider,
  Empty,
} from 'antd';

import React, { useEffect } from 'react';

import { Area, Line, Bar, Scatter, Pie } from '@ant-design/charts';
import { QuestionCircleOutlined } from '@ant-design/icons';
import { WaterMark } from '@ant-design/pro-layout';
import { type ChartProps } from '../types';
import { getColumns } from '../utils';

type TemplateChartProps = {
  props: ChartProps;
  type: string;
  index: number; // which index of charts array.
};

const hasChartOptions = (t: string): boolean => {
  return t == 'area' || t == 'line' || t == 'scatter' || t == 'bar' || t == 'pie';
};

const hasResultDataControl = (t: string): boolean => {
  return t == 'area' || t == 'line' || t == 'scatter' || t == 'bar' || t == 'pie';
};

const hasXCloumnSelected = (t: string): boolean => {
  return t == 'area' || t == 'line' || t == 'scatter' || t == 'bar';
};

const hasYCloumnSelected = (t: string): boolean => {
  return t == 'area' || t == 'line' || t == 'scatter' || t == 'bar';
};

const hasSColumnSelected = (t: string): boolean => {
  return t == 'area' || t == 'line' || t == 'bar';
};

const hasColorColumnSelected = (t: string): boolean => {
  return t == 'scatter' || t == 'pie';
};

const hasAngleColumnSelected = (t: string): boolean => {
  return t == 'pie';
};

const hasRegressionLine = (t: string): boolean => {
  return t == 'scatter';
};

const hasAxisControl = (t: string): boolean => {
  return t == 'area' || t == 'line' || t == 'scatter' || t == 'bar';
};

const hasAxis = (t: string): boolean => {
  return t == 'area' || t == 'line' || t == 'scatter' || t == 'bar';
};

const hasAxisTop = (t: string): boolean => {
  return t == 'area' || t == 'line';
};

const hasAxisPosition = (t: string): boolean => {
  return t == 'area' || t == 'line' || t == 'bar';
};

const hasAxisRange = (t: string): boolean => {
  return t == 'area' || t == 'line' || t == 'bar';
};

const generateState = (type: string, props: ChartProps): any => {
  const params = props.params;
  const data = props.data;
  const config = params.config;
  const schemas: any[] = data.schemas;
  if (type == 'area' || type == 'line') {
    const x = config ? config.xField : schemas.length < 1 ? '' : (schemas[0].name as string);
    const y = config ? config.yField : schemas.length < 2 ? '' : (schemas[1].name as string);
    const seriesField = config ? (config.seriesField ? config.seriesField : '') : '';
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

    return {
      ...params,
      name: params.name ? params.name : 'Area Chart',
      config: config
        ? {
            ...config,
            data: data.rows,
          }
        : defaultConfig,
    };
  }

  if (type == 'bar') {
    const x = config ? config.xField : schemas.length < 1 ? '' : (schemas[0].name as string);
    const y = config ? config.yField : schemas.length < 2 ? '' : (schemas[1].name as string);
    const seriesField = config ? (config.seriesField ? config.seriesField : '') : '';
    const defaultConfig = {
      data: data.rows,
      xField: x,
      yField: y,
      seriesField: seriesField,
      isStack: true,
      label: {
        // 可手动配置 label 数据标签位置
        position: 'middle',
        // 'left', 'middle', 'right'
        // 可配置附加的布局方法
        layout: [
          // 柱形图数据标签位置自动调整
          {
            type: 'interval-adjust-position',
          }, // 数据标签防遮挡
          {
            type: 'interval-hide-overlap',
          }, // 数据标签文颜色自动调整
          {
            type: 'adjust-color',
          },
        ],
      },
      scrollbar: {
        type: 'vertical',
      },
    };
    return {
      ...params,
      name: params.name ? params.name : 'Area Chart',
      config: config
        ? {
            ...config,
            data: data.rows,
          }
        : defaultConfig,
    };
  }

  if (type == 'scatter') {
    const x = config ? config.xField : schemas.length < 1 ? '' : (schemas[0].name as string);
    const y = config ? config.yField : schemas.length < 2 ? '' : (schemas[1].name as string);
    const colorField = config
      ? config.colorField
        ? config.colorField
        : ''
      : schemas.length < 3
      ? ''
      : (schemas[2].name as string);
    const defaultConfig = {
      data: data.rows,
      xField: x,
      yField: y,
      colorField: colorField,
      size: 5,
      regressionLine: {
        type: 'linear', // linear, exp, loess, log, poly, pow, quad
      },
      yAxis: {
        nice: true,
        line: {
          style: {
            stroke: '#aaa',
          },
        },
      },
      xAxis: {
        min: -100,
        grid: {
          line: {
            style: {
              stroke: '#eee',
            },
          },
        },
        line: {
          style: {
            stroke: '#aaa',
          },
        },
      },
    };
    return {
      ...params,
      name: params.name ? params.name : 'Scatter Chart',
      config: config
        ? {
            ...config,
            data: data.rows,
          }
        : defaultConfig,
    };
  }

  if (type == 'pie') {
    const x = config ? config.xField : schemas.length < 1 ? '' : (schemas[0].name as string);
    const y = config ? config.yField : schemas.length < 2 ? '' : (schemas[1].name as string);

    // console.log('pie schemas ', schemas, config, x, y)
    const defaultConfig = {
      appendPadding: 5,
      data: data.rows,
      angleField: x,
      colorField: y,
      radius: 0.8,
      label: {
        type: 'inner',
        style: {
          fontSize: 14,
          textAlign: 'center',
        },
      },
      interactions: [
        {
          type: 'element-active',
        },
      ],
    };
    // convert data.rows by x and y

    // console.log('pie defualtConfig', defaultConfig)
    return {
      ...params,
      name: params.name ? params.name : 'Pie Chart',
      config: config
        ? {
            ...config,
            data: data.rows,
          }
        : defaultConfig,
    };
  }

  return undefined;
};

const generateChartNode = (t: string, config: any, data: any[]): React.ReactNode => {
  switch (t) {
    case 'area':
      return <Area {...config} />;
    case 'line':
      return <Line {...config} />;

    case 'bar':
      return <Bar {...config} />;
    case 'scatter':
      return <Scatter {...config} />;
    case 'pie':
      return <Pie {...config} />;
    default:
      return <Empty imageStyle={{ height: 60 }} description={<span>Unsupport</span>} />;
  }
};

export const TemplateChart = (props: TemplateChartProps) => {
  const manager = props.props.manager;
  const params = props.props.params;
  const defaultState = generateState(props.type, props.props);
  const [state, setState] = React.useState<any>(defaultState);

  // initial default config
  if (!params.config) {
    manager.update(
      {
        ...params,
        config: {
          ...state.config,
        },
      },
      props.index,
    );
  }

  const columns = getColumns(props.props.data);
  columns.splice(0, 0, { value: '', label: '' });

  const handleNameChange = (event: any) => {
    const oldChart = manager.get(props.index);
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

    manager.update(
      {
        ...oldChart,
        name: v,
      },
      props.index,
    );
  };

  const handleCloumnSelect = (value: any, colField: string) => {
    const oldChart = manager.get(props.index);
    if (!oldChart) {
      return;
    }

    if (colField == 'xField') {
      setState((prev: any) => {
        const newConfig = { ...prev.config, xField: value };

        return {
          ...prev,
          config: newConfig,
        };
      });

      manager.update(
        {
          ...oldChart,
          config: {
            ...oldChart.config,
            xField: value,
          },
        },
        props.index,
      );
    }
    if (colField == 'yField') {
      setState((prev: any) => {
        const newConfig = { ...prev.config, yField: value };

        return {
          ...prev,
          config: newConfig,
        };
      });

      manager.update(
        {
          ...oldChart,
          config: {
            ...oldChart.config,
            yField: value,
          },
        },
        props.index,
      );
    }

    if (colField == 'seriesField') {
      setState((prev: any) => {
        const newConfig = { ...prev.config, seriesField: value };

        return {
          ...prev,
          config: newConfig,
        };
      });

      manager.update(
        {
          ...oldChart,
          config: {
            ...oldChart.config,
            seriesField: value,
          },
        },
        props.index,
      );
    }

    if (colField == 'colorField') {
      setState((prev: any) => {
        const newConfig = { ...prev.config, colorField: value };

        return {
          ...prev,
          config: newConfig,
        };
      });

      manager.update(
        {
          ...oldChart,
          config: {
            ...oldChart.config,
            colorField: value,
          },
        },
        props.index,
      );
    }

    if (colField == 'angleField') {
      setState((prev: any) => {
        const newConfig = { ...prev.config, angleField: value };

        return {
          ...prev,
          config: newConfig,
        };
      });

      manager.update(
        {
          ...oldChart,
          config: {
            ...oldChart.config,
            angleField: value,
          },
        },
        props.index,
      );
    }
  };

  const handleRegressionLine = (value: any) => {
    const oldChart = manager.get(props.index);
    if (!oldChart) {
      return;
    }

    setState((prev: any) => {
      const newConfig = {
        ...prev.config,
        regressionLine: {
          type: value,
        },
      };

      return {
        ...prev,
        config: newConfig,
      };
    });

    manager.update(
      {
        ...oldChart,
        config: {
          ...oldChart.config,
          regressionLine: {
            type: value,
          },
        },
      },
      props.index,
    );
  };

  const handleAxisChange = (col: string, field: string, value: any) => {
    const oldChart = manager.get(props.index);
    if (!oldChart) {
      return;
    }

    if (col === 'x') {
      setState((prev: any) => {
        const newXAxis = prev.config.xAxis ? prev.config.xAxis : {};
        switch (field) {
          case 'top':
            newXAxis.top = value;
            break;
          case 'position':
            newXAxis.position = value;
            break;
          case 'range':
            newXAxis.range = value;
            break;
        }
        const newConfig = {
          ...prev.config,
          xAxis: newXAxis,
        };

        manager.update(
          {
            ...oldChart,
            config: newConfig,
          },
          props.index,
        );

        return {
          ...prev,
          config: newConfig,
        };
      });
    }

    if (col === 'y') {
      setState((prev: any) => {
        const newYAxis = prev.config.yAxis ? prev.config.yAxis : {};
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
          ...prev.config,
          yAxis: newYAxis,
        };

        manager.update(
          {
            ...oldChart,
            config: newConfig,
          },
          props.index,
        );

        return {
          ...prev,
          config: newConfig,
        };
      });
    }
  };

  console.log(state.config);

  return (
    <>
      <Row gutter={24}>
        <Col span={24}>
          <Card>
            <WaterMark content={'Hyperdot'}>
              {state.config && generateChartNode(props.type, state.config, state.config.data)}
            </WaterMark>
          </Card>
        </Col>
      </Row>

      {hasChartOptions(props.type) && (
        <Row gutter={24} style={{ paddingTop: '12px' }}>
          <Col span={24}>
            <Card bordered={false}>
              <Row gutter={16}>
                <Col span={8}>
                  {/* Chart options */}
                  <Card>
                    <Card type="inner" title={'Chart options'}>
                      <Row gutter={[0, 12]} style={{ margin: '0' }}>
                        <Col span={24}>
                          <Row>
                            <Col span={6}>
                              <div>Title</div>
                            </Col>

                            <Col span={16}>
                              <Input
                                defaultValue={params.name}
                                bordered={true}
                                onChange={(e) => {
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
                {hasResultDataControl(props.type) && (
                  <Col span={8}>
                    <Card>
                      <Card type="inner" title="Result data">
                        <Row gutter={[0, 12]}>
                          {hasXCloumnSelected(props.type) && (
                            <Col span={24}>
                              <Row>
                                <Col span={6}>X column</Col>

                                <Col span={18}>
                                  <Select
                                    defaultValue={state.config.xField}
                                    bordered={true}
                                    style={{ width: '100%' }}
                                    options={columns}
                                    onSelect={(value) => {
                                      handleCloumnSelect(value, 'xField');
                                    }}
                                  />
                                </Col>
                              </Row>
                            </Col>
                          )}

                          {hasYCloumnSelected(props.type) && (
                            <Col span={24}>
                              <Row>
                                <Col span={6}>Y column</Col>

                                <Col span={18}>
                                  <Select
                                    defaultValue={state.config.yField}
                                    bordered={true}
                                    style={{ width: '100%' }}
                                    options={columns}
                                    onSelect={(value) => {
                                      handleCloumnSelect(value, 'yField');
                                    }}
                                  />
                                </Col>
                              </Row>
                            </Col>
                          )}

                          {hasSColumnSelected(props.type) && (
                            <Col span={24}>
                              <Row>
                                <Col span={6}>Series column</Col>
                                <Col span={18}>
                                  <Select
                                    defaultValue={state.config.seriesField}
                                    bordered={true}
                                    style={{ width: '100%' }}
                                    options={columns}
                                    onSelect={(value) => {
                                      handleCloumnSelect(value, 'seriesField');
                                    }}
                                  />
                                </Col>
                              </Row>
                            </Col>
                          )}

                          {hasColorColumnSelected(props.type) && (
                            <Col span={24}>
                              <Row>
                                <Col span={6}>Color column</Col>
                                <Col span={18}>
                                  <Select
                                    defaultValue={state.config.colorField}
                                    bordered={true}
                                    style={{ width: '100%' }}
                                    options={columns}
                                    onSelect={(value) => {
                                      handleCloumnSelect(value, 'colorField');
                                    }}
                                  />
                                </Col>
                              </Row>
                            </Col>
                          )}

                          {hasAngleColumnSelected(props.type) && (
                            <Col span={24}>
                              <Row>
                                <Col span={6}>Angle column</Col>
                                <Col span={18}>
                                  <Select
                                    defaultValue={state.config.angleField}
                                    bordered={true}
                                    style={{ width: '100%' }}
                                    options={columns}
                                    onSelect={(value) => {
                                      handleCloumnSelect(value, 'angleField');
                                    }}
                                  />
                                </Col>
                              </Row>
                            </Col>
                          )}

                          {hasRegressionLine(props.type) && (
                            <Col span={24}>
                              <Row>
                                <Col span={6}>
                                  <div>Regression Line</div>
                                </Col>

                                <Col span={18}>
                                  <Select
                                    defaultValue={state.config.regressionLine.type}
                                    bordered={true}
                                    style={{ width: '100%' }}
                                    options={[
                                      { value: 'linear', label: 'Linear' },
                                      { value: 'log', label: 'Log' },
                                      { value: 'pow', label: 'Pow' },
                                      { value: 'quad', label: 'Quad' },
                                      { value: 'exp', label: 'Exp' },
                                      { value: 'loess', label: 'Loess' },
                                      { value: 'poly', label: 'Poly' },
                                    ]}
                                    onSelect={(value) => {
                                      handleRegressionLine(value);
                                    }}
                                  />
                                </Col>
                              </Row>
                            </Col>
                          )}
                        </Row>
                      </Card>
                    </Card>
                  </Col>
                )}

                {/* X/Y-axis options */}
                {hasAxisControl(props.type) && (
                  <Col span={8}>
                    <Card>
                      <Row gutter={[0, 12]}>
                        {/* X-axis */}
                        {hasAxis(props.type) && (
                          <Col span={24}>
                            <Card type="inner" title="X-axis options">
                              <Row gutter={[0, 12]}>
                                {/* top */}
                                {hasAxisTop(props.type) && (
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
                                          handleAxisChange('x', 'top', e.target.value);
                                        }}
                                      >
                                        <Radio value={true}>true</Radio>
                                        <Radio value={false}>false</Radio>
                                      </Radio.Group>
                                    </Space>
                                  </Col>
                                )}

                                {/* position */}
                                {hasAxisPosition(props.type) && (
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
                                          handleAxisChange('x', 'position', value);
                                        }}
                                        defaultValue={
                                          state.config.xAxis
                                            ? state.config.xAxis.position
                                            : 'bottom'
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
                                )}

                                {/* range */}
                                {hasAxisRange(props.type) && (
                                  <Col span={24}>
                                    <span style={{ marginRight: '2px' }}>Range</span>
                                    <span>
                                      <Tooltip title="Adjusting the range of icon display.">
                                        <QuestionCircleOutlined />
                                      </Tooltip>
                                    </span>
                                    <AntSlider
                                      range
                                      defaultValue={
                                        state.config.xAxis ? state.config.xAxis.range : [0, 1]
                                      }
                                      min={0}
                                      max={1}
                                      step={0.1}
                                      onChange={(v) => {
                                        handleAxisChange('x', 'range', v);
                                      }}
                                    />
                                  </Col>
                                )}
                              </Row>
                            </Card>
                          </Col>
                        )}
                        {/* Y-axis */}
                        {hasAxis(props.type) && (
                          <Col span={24}>
                            <Card type="inner" title="Y-axis options">
                              <Row gutter={[0, 12]}>
                                {/* top */}
                                {hasAxisTop(props.type) && (
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
                                          handleAxisChange('y', 'top', e.target.value);
                                        }}
                                      >
                                        <Radio value={true}>true</Radio>
                                        <Radio value={false}>false</Radio>
                                      </Radio.Group>
                                    </Space>
                                  </Col>
                                )}

                                {/* position */}
                                {hasAxisPosition(props.type) && (
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
                                          handleAxisChange('y', 'position', value);
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
                                )}

                                {/* range */}
                                {hasAxisRange(props.type) && (
                                  <Col span={24}>
                                    <span style={{ marginRight: '2px' }}>Range</span>
                                    <span>
                                      <Tooltip title="Adjusting the range of icon display.">
                                        <QuestionCircleOutlined />
                                      </Tooltip>
                                    </span>
                                    <AntSlider
                                      range
                                      defaultValue={
                                        state.config.yAxis ? state.config.yAxis.range : [0, 1]
                                      }
                                      min={0}
                                      max={1}
                                      step={0.1}
                                      onChange={(v) => {
                                        handleAxisChange('y', 'range', v);
                                      }}
                                    />
                                  </Col>
                                )}
                              </Row>
                            </Card>
                          </Col>
                        )}
                      </Row>
                    </Card>
                  </Col>
                )}
              </Row>
            </Card>
          </Col>
        </Row>
      )}
    </>
  );
};
