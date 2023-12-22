import {
  Row,
  Col,
  Select,
  Input,
  Table,
  message,
  Card,
  Radio,
  Tooltip,
  Space,
  Slider as AntSlider,
} from 'antd';

import React, { useEffect } from 'react';

import { Line, Area, Column, Pie } from '@ant-design/charts';
import { QuestionCircleOutlined } from '@ant-design/icons';
import { TabManager } from './tabmanager';
import { WaterMark } from '@ant-design/pro-layout';
import { type ChartProps } from '@/components/Charts/types';

/**
 * Properties for a chart node.
 * @interface ChartNodeProps
 * @property {string} name - Name of the chart node.
 * @property {React.ReactNode} icon - React node representing the icon for the chart node.
 * @property {(props: ChartProps) => React.ReactNode} children - Function returning React node representing the children of the chart node.
 */
export interface ChartNodeProps {
  name: string;
  icon: React.ReactNode;
  children: (props: ChartProps) => React.ReactNode;
}

/**
 * Gets columns from query data to be used in a chart.
 * @function
 * @param {any} queryData - Data from the query.
 * @returns {Array} - Array of columns.
 */
const getColumns = (queryData: any) => {
  return queryData.schemas.map((value: any) => {
    return {
      value: value.name,
      label: value.name,
    };
  });
};

/**
 * Configuration interface for an Area Chart.
 * @interface AreaChartConfig
 * @property {any} data - Data for the chart.
 * @property {string} xField - X-axis field.
 * @property {string} yField - Y-axis field.
 * @property {string | undefined} seriesField - Series field for the chart.
 * @property {any | undefined} areaStyle - Style for the chart area.
 * @property {any | undefined} xAxis - Configuration for the X-axis.
 * @property {any | undefined} yAxis - Configuration for the Y-axis.
 */
interface AreaChartConfig {
  data: any;
  xField: string;
  yField: string;
  seriesField?: string;
  areaStyle?: any;
  xAxis?: any;
  yAxis?: any;
}

/**
 * React functional component representing an Area Chart tab.
 * @function
 * @param {QE.ChartTabProps} props - Props containing chart tab information.
 * @returns {JSX.Element} - JSX element representing the AreaChartTab component.
 */
export const AreaChartTab = (props: QE.ChartTabProps) => {
  const config = props.config as AreaChartConfig;
  const queryData = props.queryData;
  const schemas: any[] = queryData.schemas;

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
    data: queryData.rows,
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
  const [title, setTtile] = React.useState<string>(props.name ? props.name : 'Chart');
  const [areaConfig, setConfig] = React.useState<AreaChartConfig>(
    config
      ? {
          ...config,
          data: queryData.rows,
        }
      : defaultConfig,
  );

  useEffect(() => {
    if (config == undefined) {
      // initial tabs by using defaultConfig
      props.setTabProps({ ...TabManager.updateConfig(props.tabProps, props.id, defaultConfig) });
    } else {
      // config changes, reset data
      config.data = queryData.rows;
      setConfig(config);
    }
  }, [config, queryData]);

  const handleCloumnSelect = (value: any, col: string) => {
    if (col == 'x') {
      setConfig((prev) => {
        const newConfig = { ...prev, xField: value };
        props.setTabProps({ ...TabManager.updateConfig(props.tabProps, props.id, newConfig) });
        return newConfig;
      });
    }
    if (col == 'y') {
      setConfig((prev) => {
        const newConfig = { ...prev, yField: value };
        props.setTabProps({ ...TabManager.updateConfig(props.tabProps, props.id, newConfig) });
        return newConfig;
      });
    }
    if (col == 's') {
      setConfig((prev) => {
        const newConfig = { ...prev, seriesField: value };
        props.setTabProps({ ...TabManager.updateConfig(props.tabProps, props.id, newConfig) });
        return newConfig;
      });
    }
  };

  const columns = getColumns(queryData);

  const handleAreaTitleChange = (e: any) => {
    if (!e.target.value) {
      return;
    }
    setTtile(e.target.value);
    props.setTabProps({ ...TabManager.updateName(props.tabProps, props.id, e.target.value) });
  };

  const handleAxisChange = (col: string, field: string, value: any) => {
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
        return {
          ...prev,
          xAxis: newXAxis,
        };
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
        return {
          ...prev,
          xAxis: newYAxis,
        };
      });
    }
  };

  return (
    <>
      <Row gutter={24}>
        <Col span={24}>
          <Card>
            <WaterMark content={'Hyperdot'}>
              <Line {...areaConfig} />
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
                              defaultValue={title}
                              bordered={true}
                              onPressEnter={handleAreaTitleChange}
                              onMouseLeave={handleAreaTitleChange}
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
                                handleCloumnSelect(value, 'x');
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
                                handleCloumnSelect(value, 'y');
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
                                handleCloumnSelect(value, 's');
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
                                value={areaConfig.xAxis ? areaConfig.xAxis.top : false}
                                onChange={(e) => {
                                  handleAxisChange('x', 'top', e.target.value);
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
                                  handleAxisChange('x', 'position', value);
                                }}
                                defaultValue={
                                  areaConfig.xAxis ? areaConfig.xAxis.position : 'bottom'
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
                              defaultValue={areaConfig.xAxis ? areaConfig.xAxis.range : [0, 1]}
                              min={0}
                              max={1}
                              step={0.1}
                              onChange={(v) => {
                                handleAxisChange('x', 'range', v);
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
                                value={areaConfig.yAxis ? areaConfig.yAxis.top : false}
                                onChange={(e) => {
                                  handleAxisChange('y', 'top', e.target.value);
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
                                  handleAxisChange('y', 'position', value);
                                }}
                                defaultValue={
                                  areaConfig.yAxis ? areaConfig.yAxis.position : 'right'
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
                              defaultValue={areaConfig.yAxis ? areaConfig.yAxis.range : [0, 1]}
                              min={0}
                              max={1}
                              step={0.1}
                              onChange={(v) => {
                                handleAxisChange('y', 'range', v);
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

/**
 * Configuration interface for a Line Chart.
 * @interface LineChartConfig
 * @property {any} data - Data for the chart.
 * @property {string} xField - X-axis field.
 * @property {string} yField - Y-axis field.
 * @property {string | undefined} seriesField - Series field for the chart.
 * @property {any | undefined} areaStyle - Style for the chart area.
 * @property {any | undefined} xAxis - Configuration for the X-axis.
 * @property {any | undefined} yAxis - Configuration for the Y-axis.
 */
interface LineChartConfig {
  data: any;
  xField: string;
  yField: string;
  seriesField?: string;
  areaStyle?: any;
  xAxis?: any;
  yAxis?: any;
}

/**
 * React functional component representing a Line Chart.
 * @function
 * @param {QE.ChartTabProps} props - Props containing chart tab information.
 * @returns {JSX.Element} - JSX element representing the LineChart component.
 */
export const LineChart = (props: QE.ChartTabProps) => {
  const config = props.config as LineChartConfig;
  const queryData = props.queryData;
  const schemas: any[] = queryData.schemas;

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
    data: queryData.rows,
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

  const [title, setTtile] = React.useState<string>(props.name ? props.name : 'Chart');
  const [lineConfig, setConfig] = React.useState<LineChartConfig>(
    config
      ? {
          ...config,
          data: queryData.rows,
        }
      : defaultConfig,
  );

  useEffect(() => {
    if (config == undefined) {
      props.setTabProps({ ...TabManager.updateConfig(props.tabProps, props.id, defaultConfig) });
    } else {
      config.data = queryData.rows;
      setConfig(config);
    }
  }, [config, queryData]);

  const handleCloumnSelect = (value: any, col: string) => {
    if (col == 'x') {
      setConfig((prev) => {
        const newConfig = { ...prev, xField: value };
        props.setTabProps({ ...TabManager.updateConfig(props.tabProps, props.id, newConfig) });
        return newConfig;
      });
    }
    if (col == 'y') {
      setConfig((prev) => {
        const newConfig = { ...prev, yField: value };
        props.setTabProps({ ...TabManager.updateConfig(props.tabProps, props.id, newConfig) });
        return newConfig;
      });
    }
    if (col == 's') {
      setConfig((prev) => {
        const newConfig = { ...prev, seriesField: value };
        props.setTabProps({ ...TabManager.updateConfig(props.tabProps, props.id, newConfig) });
        return newConfig;
      });
    }
  };

  const columns = getColumns(queryData);

  const handleAreaTitleChange = (e: any) => {
    if (!e.target.value) {
      return;
    }
    setTtile(e.target.value);
    props.setTabProps({ ...TabManager.updateName(props.tabProps, props.id, e.target.value) });
  };

  const handleAxisChange = (col: string, field: string, value: any) => {
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
        return {
          ...prev,
          xAxis: newXAxis,
        };
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
        return {
          ...prev,
          xAxis: newYAxis,
        };
      });
    }
  };

  return (
    <>
      <Row gutter={24}>
        <Col span={24}>
          <Card>
            <WaterMark content={'Hyperdot'}>
              <Area {...lineConfig} />
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
                              defaultValue={title}
                              bordered={true}
                              onPressEnter={handleAreaTitleChange}
                              onMouseLeave={handleAreaTitleChange}
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
                                handleCloumnSelect(value, 'x');
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
                                handleCloumnSelect(value, 'y');
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
                                handleCloumnSelect(value, 's');
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
                                value={lineConfig.xAxis ? lineConfig.xAxis.top : false}
                                onChange={(e) => {
                                  handleAxisChange('x', 'top', e.target.value);
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
                                  handleAxisChange('x', 'position', value);
                                }}
                                defaultValue={
                                  lineConfig.xAxis ? lineConfig.xAxis.position : 'bottom'
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
                              defaultValue={lineConfig.xAxis ? lineConfig.xAxis.range : [0, 1]}
                              min={0}
                              max={1}
                              step={0.1}
                              onChange={(v) => {
                                handleAxisChange('x', 'range', v);
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
                                value={lineConfig.yAxis ? lineConfig.yAxis.top : false}
                                onChange={(e) => {
                                  handleAxisChange('y', 'top', e.target.value);
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
                                  handleAxisChange('y', 'position', value);
                                }}
                                defaultValue={
                                  lineConfig.yAxis ? lineConfig.yAxis.position : 'right'
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
                              defaultValue={lineConfig.yAxis ? lineConfig.yAxis.range : [0, 1]}
                              min={0}
                              max={1}
                              step={0.1}
                              onChange={(v) => {
                                handleAxisChange('y', 'range', v);
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

/**
 * React functional component representing a Bar Chart tab.
 * @function
 * @param {QE.ChartTabProps} props - Props containing chart tab information.
 * @returns {JSX.Element} - JSX element representing the BarChartTab component.
 */
export const BarChartTab = (props: QE.ChartTabProps) => {
  const schemas: any[] = props.queryData.schemas;
  if (schemas.length < 2) {
    message.error('Line chart need at least 2 columns');
    return null;
  }
  const xField: any = () => {
    return schemas[0].name;
  };

  const yField: any = () => {
    return schemas[1].name;
  };

  const data: any = props.queryData.rows;
  const config = {
    data,
    xField: xField(),
    yField: yField(),
    label: {
      // 可手动配置 label 数据标签位置
      // position: 'middle',
      // 'top', 'bottom', 'middle',
      // 配置样式
      style: {
        fill: '#FFFFFF',
        opacity: 0.6,
      },
    },
    xAxis: {
      label: {
        autoHide: true,
        autoRotate: false,
      },
    },
  };

  return <Column {...config} />;
};

/**
 * React functional component representing a Pie Chart tab.
 * @function
 * @param {QE.ChartTabProps} props - Props containing chart tab information.
 * @returns {JSX.Element} - JSX element representing the PieChartTab component.
 */
export const PieChartTab = (props: QE.ChartTabProps) => {
  const schemas: any[] = props.queryData.schemas;
  if (schemas.length < 2) {
    message.error('Line chart need at least 2 columns');
    return null;
  }
  const xField: any = () => {
    return schemas[0].name;
  };

  const yField: any = () => {
    return schemas[1].name;
  };

  const data: any = props.queryData.rows;
  const config = {
    appendPadding: 10,
    data,
    angleField: xField(),
    colorField: yField(),
    radius: 0.9,
    label: {
      type: 'inner',
      offset: '-30%',
      content: ({ percent }: any) => `${(percent * 100).toFixed(0)}%`,
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
  return <Pie {...config} />;
};

/**
 * React functional component representing a Query Result Table tab.
 * @function
 * @param {QE.ChartTabProps} props - Props containing chart tab information.
 * @returns {JSX.Element} - JSX element representing the QueryResultTableTab component.
 */
export const QueryResultTableTab = (props: QE.ChartTabProps) => {
  const queryData = props.queryData;
  const columns = () => {
    const res: any[] = [];
    for (const i in queryData.schemas) {
      res.push({
        title: queryData.schemas[i].name,
        dataIndex: queryData.schemas[i].name,
        key: queryData.schemas[i].name,
      });
    }
    return res;
  };

  const data = () => {
    const res: any[] = [];
    for (const i in queryData.rows) {
      res.push({
        key: i,
        ...queryData.rows[i],
      });
    }
    return res;
  };
  return <Table columns={columns()} dataSource={data()} />;
};
