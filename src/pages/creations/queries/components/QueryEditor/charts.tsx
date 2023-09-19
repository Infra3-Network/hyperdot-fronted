import { Button, Row, Col, Select, Input, Table, message } from 'antd';
import React, { useEffect } from 'react';
import { Line, Area, Scatter, Column, Pie } from '@ant-design/charts';
import {
  AreaChartOutlined,
  BarChartOutlined,
  LineChartOutlined,
  PieChartOutlined,
  DotChartOutlined,
  TableOutlined,
  FieldNumberOutlined,
} from '@ant-design/icons';
import { TabManager } from './tabmanager';
import styles from './charts.less';

interface ChartProps {
  name: string;
  icon: React.ReactNode;
  children: (props: QE.ChartTabProps) => React.ReactNode;
}

interface NewVisualizationTabProps {
  tabProps: any;
  setTabProps: any;
  setTabActiveKey: any;
  charts: Map<string, ChartProps>;
}

export const NewVisualizationTab = (props: NewVisualizationTabProps) => {
  const [chart, setChart] = React.useState<string>('bar_chart');
  const [messageApi, contextHolder] = message.useMessage();
  const virsualizationOptions: any[] = [
    {
      label: 'Chart visualization',
      options: [
        { label: 'Bar Chart', value: 'bar_chart' },
        { label: 'Area Chart', value: 'area_chart' },
        { label: 'Scatter Chart', value: 'scatter_chart' },
        { label: 'Line Chart', value: 'line_chart' },
        { label: 'Pie Chart', value: 'pie_chart' },
      ],
    },
    {
      label: 'Data visualization',
      options: [
        { label: 'Table', value: 'data_table' },
        { label: 'Counter', value: 'data_counter' },
      ],
    },
  ];

  const handleChange = (value: string) => {
    setChart(value);
    return;
  };

  const handleAddVisualizationClick = () => {
    const chartProps = props.charts.get(chart);
    if (chartProps == undefined) {
      return;
    }

    if (!chartProps.name) {
      messageApi.open({
        content: `the visualization type not supported`,
        type: 'error',
      });
      setChart(chartProps.name);
      return;
    }

    props.setTabProps((prev: QE.TabArray) => {
      return TabManager.insertLastBefore(prev, {
        name: chartProps.name,
        // icon: chartProps.icon,
        // children: chartProps.children,
        children: chart,
        closeable: true,
      });
      // const insertAfterIndex = prev.length - 1 < 0 ? 0 : prev.length - 1; // 将新元素插入在最后一个元素后面

      // // 创建一个新的数组，将新元素插入到指定位置
      // const newArray = [...prev];
      // newArray.splice(insertAfterIndex, 0, {
      //   name: chartProps.name,
      //   icon: chartProps.icon,
      //   children: chartProps.children(props.queryData),
      // });

      // return newArray;
    });
    const active: string = TabManager.getId(props.tabProps).toString();
    props.setTabActiveKey(active);
  };

  return (
    <>
      {contextHolder}
      <Row gutter={16}>
        <Col>
          <p> Select visualization type </p>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col>
          <Select
            defaultValue={chart}
            style={{ width: 200 }}
            onChange={handleChange}
            options={virsualizationOptions}
          />
        </Col>
      </Row>

      <Row gutter={16}>
        <Col>
          <Button onClick={handleAddVisualizationClick}> Add visualization</Button>
        </Col>
      </Row>
    </>
  );
};

const getColumns = (queryData: any) => {
  return queryData.schemas.map((value: any) => {
    return {
      value: value.name,
      label: value.name,
    };
  });
};

interface AreaChartConfig {
  data: any;
  xField: string;
  yField: string;
  areaStyle: any;
}

export const AreaChartTab = (props: QE.ChartTabProps) => {
  const queryData = props.queryData;
  const schemas: any[] = queryData.schemas;
  const x = schemas[0].name as string;
  const y = schemas[1].name as string;
  const [areaConfig, setConfig] = React.useState<AreaChartConfig>({
    data: queryData.rows,
    xField: x,
    yField: y,
    areaStyle: () => {
      return {
        fill: 'l(270) 0:#ffffff 0.5:#7ec2f3 1:#1890ff',
      };
    },
  });

  useEffect(() => {
    props.setTabProps({ ...TabManager.updateConfig(props.tabProps, props.id, areaConfig) });
  }, []);

  console.log(props.tabProps);
  if (schemas.length < 2) {
    message.error('Line chart need at least 2 columns');
    return null;
  }

  const handleCloumnSelect = (value: any, col: string) => {
    if (col == 'x') {
      setConfig((prev) => {
        const newConfig = { ...prev, yField: value };
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
  };

  const columns = getColumns(queryData);

  const handleAreaTitleChange = (e: any) => {
    if (!e.target.value) {
      return;
    }
    props.setTabProps({ ...TabManager.updateName(props.tabProps, props.id, e.target.value) });
  };

  return (
    <>
      <Row gutter={24}>
        <Col span={24}>
          <div
            style={{
              height: '400px',
              width: '100%',
              border: '1px solid',
              borderColor: 'red',
            }}
          >
            <Area {...areaConfig} />
          </div>
        </Col>
      </Row>

      <Row gutter={24} style={{ paddingTop: '12px' }}>
        <Col
          span={24}
          style={{
            height: '400px',
            width: '100%',
            border: '1px solid',
            borderColor: 'red',
          }}
        >
          <Row gutter={24}>
            <Col
              span={7}
              style={{
                background: 'rgb(229 231 235)',
                marginRight: '12px',
                padding: '12px 10px 32px 10px',
              }}
            >
              <Row>
                <Col>
                  <h2 className={styles.optionHead}>Chart Options</h2>
                </Col>
              </Row>

              <Row gutter={[0, 2]} style={{ margin: '12px' }}>
                <Col span={24} style={{ background: 'white', padding: '8px 0 2px 8px' }}>
                  <Row>
                    <Col span={6}>
                      <div>Title</div>
                    </Col>

                    <Col span={16}>
                      <Input
                        placeholder=""
                        bordered={false}
                        onPressEnter={handleAreaTitleChange}
                        onMouseLeave={handleAreaTitleChange}
                      />
                    </Col>
                  </Row>
                </Col>
              </Row>
            </Col>

            <Col
              span={7}
              style={{
                background: 'rgb(229 231 235)',
                marginRight: '12px',
                padding: '12px 10px 32px 10px',
              }}
            >
              <Row>
                <Col>
                  <h2 className={styles.optionHead}>Result data</h2>
                </Col>
              </Row>

              <Row gutter={[0, 2]} style={{ margin: '12px' }}>
                <Col span={24} style={{ background: 'white', padding: '8px 0 2px 8px' }}>
                  <Row>
                    <Col span={6}>
                      <div>X column</div>
                    </Col>

                    <Col span={16}>
                      <Select
                        defaultValue={x}
                        bordered={false}
                        style={{ width: '100%' }}
                        options={columns}
                        onSelect={(value) => {
                          handleCloumnSelect(value, 'x');
                        }}
                      />
                    </Col>
                  </Row>
                </Col>

                <Col span={24} style={{ background: 'white', padding: '8px 0 2px 8px' }}>
                  <Row>
                    <Col span={6}>
                      <div>Y column</div>
                    </Col>

                    <Col span={16}>
                      <Select
                        defaultValue={y}
                        bordered={false}
                        style={{ width: '100%' }}
                        options={columns}
                        onSelect={(value) => {
                          handleCloumnSelect(value, 'y');
                        }}
                      />
                    </Col>
                  </Row>
                </Col>
              </Row>
            </Col>
          </Row>
        </Col>
      </Row>
    </>
  );
};

export const LineChartTab = (props: QE.ChartTabProps) => {
  const schemas: any[] = props.queryData.schemas;
  if (schemas.length < 2) {
    message.error('Line chart need at least 2 columns');
    return null;
  }
  const xField: string = () => {
    return schemas[0].name;
  };

  const yField: string = () => {
    return schemas[1].name;
  };

  const data: any = props.queryData.rows;

  const config = {
    data,
    xField: xField(),
    yField: yField(),

    animation: {
      appear: {
        animation: 'path-in',
        duration: 500,
      },
    },
    tooltip: {
      showMarkers: false,
    },
    point: {
      shape: 'breath-point',
    },
  };
  return <Line {...config} />;
};

interface ScatterChartConfig {
  data: any;
  xField: string;
  yField: string;
  colorField: string;
  appendPadding: number;
  size: number;
  xAxis: any;
  yAxis: any;
}

export const ScatterChartTab = (props: QE.ChartTabProps) => {
  const schemas: any[] = queryData.schemas;
  const xField: string = schemas.length == 0 ? '' : schemas[0].name;
  const yField: string = schemas.length < 1 ? '' : schemas[1].name;
  const colorField: string = schemas.length < 2 ? '' : schemas[2].name;
  const data: any = queryData.rows;
  const [config, setConfig] = React.useState<ScatterChartConfig>({
    appendPadding: 30,
    data,
    xField: xField,
    yField: yField,
    size: 5,
    colorField: colorField,
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
  });

  const handleCloumnSelect = (value: any, col: string) => {
    if (col == 'x') {
      setConfig({ ...config, xField: value });
    }
    if (col == 'y') {
      setConfig({ ...config, yField: value });
    }
  };

  const columns = getColumns(queryData);

  return (
    <>
      <Row gutter={24}>
        <Col span={24}>
          <div
            style={{
              height: '400px',
              width: '100%',
              border: '1px solid',
              borderColor: 'red',
            }}
          >
            <Scatter {...config} />
          </div>
        </Col>
      </Row>

      <Row gutter={24} style={{ paddingTop: '12px' }}>
        <Col
          span={24}
          style={{
            height: '400px',
            width: '100%',
            border: '1px solid',
            borderColor: 'red',
          }}
        >
          <Row gutter={24}>
            <Col
              span={7}
              style={{
                background: 'rgb(229 231 235)',
                marginRight: '12px',
                padding: '12px 10px 32px 10px',
              }}
            >
              <Row>
                <Col>
                  <h2 className={styles.optionHead}>Chart Options</h2>
                </Col>
              </Row>

              <Row gutter={[0, 2]} style={{ margin: '12px' }}>
                <Col span={24} style={{ background: 'white', padding: '8px 0 2px 8px' }}>
                  <Row>
                    <Col span={6}>
                      <div>Title</div>
                    </Col>

                    <Col span={16}>
                      <Input placeholder="" bordered={false} />
                    </Col>
                  </Row>
                </Col>
              </Row>
            </Col>

            <Col
              span={7}
              style={{
                background: 'rgb(229 231 235)',
                marginRight: '12px',
                padding: '12px 10px 32px 10px',
              }}
            >
              <Row>
                <Col>
                  <h2 className={styles.optionHead}>Result data</h2>
                </Col>
              </Row>

              <Row gutter={[0, 2]} style={{ margin: '12px' }}>
                <Col span={24} style={{ background: 'white', padding: '8px 0 2px 8px' }}>
                  <Row>
                    <Col span={6}>
                      <div>X column</div>
                    </Col>

                    <Col span={16}>
                      <Select
                        defaultValue={xField}
                        bordered={false}
                        style={{ width: '100%' }}
                        options={columns}
                        onSelect={(value) => {
                          handleCloumnSelect(value, 'x');
                        }}
                      />
                    </Col>
                  </Row>
                </Col>

                <Col span={24} style={{ background: 'white', padding: '8px 0 2px 8px' }}>
                  <Row>
                    <Col span={6}>
                      <div>Y column</div>
                    </Col>

                    <Col span={16}>
                      <Select
                        defaultValue={yField}
                        bordered={false}
                        style={{ width: '100%' }}
                        options={columns}
                        onSelect={(value) => {
                          handleCloumnSelect(value, 'y');
                        }}
                      />
                    </Col>
                  </Row>
                </Col>
              </Row>
            </Col>
          </Row>
        </Col>
      </Row>
    </>
  );
};

export const BarChartTab = (props: QE.ChartTabProps) => {
  const schemas: any[] = props.queryData.schemas;
  if (schemas.length < 2) {
    message.error('Line chart need at least 2 columns');
    return null;
  }
  const xField: string = () => {
    return schemas[0].name;
  };

  const yField: string = () => {
    return schemas[1].name;
  };

  const data: any = props.queryData.rows;
  const config = {
    data,
    xField: xField(),
    yField: yField(),
    label: {
      // 可手动配置 label 数据标签位置
      position: 'middle',
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

export const PieChartTab = (props: QE.ChartTabProps) => {
  const schemas: any[] = props.queryData.schemas;
  if (schemas.length < 2) {
    message.error('Line chart need at least 2 columns');
    return null;
  }
  const xField: string = () => {
    return schemas[0].name;
  };

  const yField: string = () => {
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
      // const row: any = {};
      // for (const j in queryData.data[i]) {
      //   row[queryData.schemas[j].name] = queryData.data[i][j];
      // }
      // res.push(row);
    }
    return res;
  };
  return <Table columns={columns()} dataSource={data()} />;
};

export const charts: Map<string, ChartProps> = new Map([
  // [
  //   'new',
  //   {
  //     name: 'New Visualization',
  //     icon: <BarChartOutlined />,
  //     children: (props: QE.ChartTabProps) => {
  //       return <NewVisualizationTab {...props} />;
  //     },
  //   },
  // ],
  [
    'bar_chart',
    {
      name: 'Bar Chart',
      icon: <BarChartOutlined />,
      children: (props: QE.ChartTabProps) => {
        return <BarChartTab {...props} />;
      },
    },
  ],
  [
    'area_chart',
    {
      name: 'Area Chart',
      icon: <AreaChartOutlined />,
      children: (props: QE.ChartTabProps) => {
        return <AreaChartTab {...props} />;
      },
    },
  ],
  [
    'scatter_chart',
    {
      name: 'Scatter Chart',
      icon: <DotChartOutlined />,
      children: (props: QE.ChartTabProps) => {
        return <ScatterChartTab {...props} />;
      },
    },
  ],
  [
    'line_chart',
    {
      name: 'Line Chart',
      icon: <LineChartOutlined />,
      children: (props: QE.ChartTabProps) => {
        return <LineChartTab {...props} />;
      },
    },
  ],
  [
    'pie_chart',
    {
      name: 'Pie Chart',
      icon: <PieChartOutlined />,
      children: (props: QE.ChartTabProps) => {
        return <PieChartTab {...props} />;
      },
    },
  ],
  [
    'data_table',
    {
      name: 'Table',
      icon: <TableOutlined />,
      children: (props: QE.ChartTabProps) => {
        return <QueryResultTableTab {...props} />;
      },
    },
  ],
  [
    'data_counter',
    {
      name: 'Counter',
      icon: <FieldNumberOutlined />,
      children: (props: QE.ChartTabProps) => {
        return <QueryResultTableTab {...props} />;
      },
    },
  ],
]);
