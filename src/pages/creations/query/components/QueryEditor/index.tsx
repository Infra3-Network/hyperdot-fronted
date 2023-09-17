import MonacoEditor from 'react-monaco-editor';
import { CloseOutlined, CodeOutlined, ExpandOutlined, FullscreenOutlined } from '@ant-design/icons';
import { useRequest } from 'umi';
import { uniq } from '@antv/util';
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
import { Tabs, Row, Col, Select, Button, message, Table, Icon } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import { AreaChartTab, ScatterChartTab } from './charts.tsx';

import { queryRun } from '@/services/hyperdot/query';
import styles from './index.less';

interface TabProps {
  id?: number;
  name: string;
  icon: React.ReactNode;
  children: (queryData: any) => React.ReactNode;
  closeable: boolean;
}

interface TabArray {
  id: number;
  tabs: TabProps[];
}

const TabManager = {
  getId: (prev: TabArray) => {
    return prev.id;
  },

  add: (prev: TabArray, tab: TabProps) => {
    prev.id += 1;
    tab.id = prev.id;
    prev.tabs.push(tab);
    return prev;
  },

  remove: (prev: TabArray, id: number) => {
    const newTabs = prev.tabs.filter((v: TabProps) => v.id !== id);
    return {
      id: prev.id,
      tabs: newTabs,
    };
  },
  insertLastBefore: (prev: TabArray, tab: TabProps) => {
    if (prev.tabs.length === 0) {
      return TabManager.add(prev, tab);
    }

    prev.id += 1;
    tab.id = prev.id;
    const index = prev.tabs.length - 1;
    const newArray = [...prev.tabs];
    newArray.splice(index, 0, tab);
    prev.tabs = newArray;
    return prev;
  },

  insertIndexBefore: (prev: TabArray, index: number, tab: TabProps) => {
    prev.id += 1;
    tab.id = prev.id;
    const newArray = [...prev.tabs];
    newArray.splice(index, 0, tab);
    return {
      id: prev.id,
      tabs: newArray,
    };
  },

  findByName: (tabs: TabArray, name: string) => {
    return tabs.tabs.find((v: TabProps) => v.name === name);
  },
};

const QueryResultTableTab = ({ queryData }: any) => {
  const columns = () => {
    const res: any[] = [];
    for (const i in queryData.schemas) {
      console.log(queryData.schemas[i]);
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

const LineChartTab = ({ queryData }: any) => {
  const schemas: any[] = queryData.schemas;
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

  const data: any = queryData.rows;

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

const BarChartTab = ({ queryData }: any) => {
  const schemas: any[] = queryData.schemas;
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

  const data: any = queryData.rows;
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

const PieChartTab = ({ queryData }: any) => {
  const schemas: any[] = queryData.schemas;
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

  const data: any = queryData.rows;
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

interface ChartProps {
  name: string;
  icon: React.ReactNode;
  children?: (queryData: any) => React.ReactNode;
  // children: React.ReactNode;
}

const charts: Map<string, ChartProps> = new Map([
  [
    'bar_chart',
    {
      name: 'Bar Chart',
      icon: <BarChartOutlined />,
      children: (queryData: any) => {
        return <BarChartTab queryData={queryData} />;
      },
    },
  ],
  [
    'area_chart',
    {
      name: 'Area Chart',
      icon: <AreaChartOutlined />,
      children: (queryData: any) => {
        return <AreaChartTab queryData={queryData} />;
      },
    },
  ],
  [
    'scatter_chart',
    {
      name: 'Scatter Chart',
      icon: <DotChartOutlined />,
      children: (queryData: any) => {
        return <ScatterChartTab queryData={queryData} />;
      },
    },
  ],
  [
    'line_chart',
    {
      name: 'Line Chart',
      icon: <LineChartOutlined />,
      children: (queryData: any) => {
        return <LineChartTab queryData={queryData} />;
      },
    },
  ],
  [
    'pie_chart',
    {
      name: 'Pie Chart',
      icon: <PieChartOutlined />,
      children: (queryData: any) => {
        return <PieChartTab queryData={queryData} />;
      },
    },
  ],
  [
    'data_table',
    {
      name: 'Table',
      icon: <TableOutlined />,
      children: (queryData: any) => {
        return <QueryResultTableTab queryData={queryData} />;
      },
    },
  ],
  [
    'data_counter',
    {
      name: 'Counter',
      icon: <FieldNumberOutlined />,
    },
  ],
]);

// const chart2icon: Map<string, React.ReactNode> = new Map([
//   ['bar_chart', <BarChartOutlined />],
//   ['area_chart', <AreaChartOutlined />],
//   ['scatter_chart', <DotChartOutlined />],
//   ['line_chart', <LineChartOutlined />],
//   ['pie_chart', <PieChartOutlined />],
//   ['data_table', <TableOutlined />],
//   ['data_counter', <FieldNumberOutlined />],
// ]);

// const chartValue2Name: Map<string, string> = new Map([
//   ['bar_chart', 'Bar Chart'],
//   ['area_chart', 'Area Chart'],
//   ['scatter_chart', 'Scatter Chart'],
//   ['line_chart', 'Line Chart'],
//   ['pie_chart', 'Pie Chart'],
//   ['data_table', 'Data Table'],
//   ['data_counter', 'Data Counter'],
// ]);

interface NewVisualizationTabProps {
  tabProps: TabArray;
  setTabProps: any;
  setTabActiveKey: any;
  queryData: any;
}

const NewVisualizationTab = (props: NewVisualizationTabProps) => {
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

  const handleOnClick = () => {
    const chartProps: ChartProps = charts.get(chart);
    if (!chartProps.name) {
      messageApi.open({
        content: `the visualization type not supported`,
        type: 'error',
      });
      setChart(chartProps.name);
      return;
    }

    props.setTabProps((prev: TabArray) => {
      return TabManager.insertLastBefore(prev, {
        name: chartProps.name,
        icon: chartProps.icon,
        children: chartProps.children,
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
    console.log('Add visualization for ', chart);
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
          <Button onClick={handleOnClick}> Add visualization</Button>
        </Col>
      </Row>
    </>
  );
};

interface QueryVisualizationProps {
  queryData: any;
  runLoading: boolean;
  tabProps: TabArray;
  setTabProps: any;
}

const QueryVisualization = (props: QueryVisualizationProps) => {
  const [tabActiveKey, setTabActiveKey] = React.useState<string>('1');

  useEffect(() => {
    props.setTabProps((prev: TabArray) => {
      if (TabManager.findByName(prev, 'New Visualization')) {
        return prev;
      }

      return TabManager.add(prev, {
        name: 'New Visualization',
        icon: <BarChartOutlined />,
        children: (queryData: any) => {
          return (
            <NewVisualizationTab
              tabProps={props.tabProps}
              setTabProps={props.setTabProps}
              setTabActiveKey={setTabActiveKey}
              queryData={queryData}
            />
          );
        },
        closeable: false,
      });

      // const foundNew: boolean = prev.find((v: any, i: number) => v.name === 'New Visualization');
      // if (foundNew) {
      //   return prev;
      // }

      // prev.push({
      //   name: 'New Visualization',
      //   icon: <BarChartOutlined />,
      //   children: (
      //     <NewVisualizationTab
      //       tabProps={props.tabProps}
      //       setTabProps={props.setTabProps}
      //       setTabActiveKey={setTabActiveKey}
      //       queryData={props.queryData}
      //     />
      //   ),
      // });
      // return prev;
    });
  }, []);

  const handleCloseClick = (id: number) => {
    props.setTabProps(TabManager.remove(props.tabProps, id));
    setTabActiveKey(tabActiveKey);
  };

  if (props.runLoading) {
    return <div>Loading...</div>;
  }

  if (!props.queryData) {
    return null;
  }

  return (
    <div>
      <Tabs
        type="primary"
        activeKey={tabActiveKey}
        onChange={(activeKey: string) => {
          setTabActiveKey(activeKey);
        }}
        items={props.tabProps.tabs.map((v: TabProps) => {
          return v.id == undefined
            ? null
            : {
                label: (
                  <div>
                    <span>
                      {v.icon}
                      {v.name}
                    </span>
                    {v.closeable ? (
                      <span style={{ marginLeft: '12px' }}>
                        <CloseOutlined
                          onClick={() => {
                            handleCloseClick(v.id);
                          }}
                        />
                      </span>
                    ) : null}
                  </div>
                ),
                key: v.id?.toString(),
                children: v.children(props.queryData),
                style: {},
                closable: v.closeable,
              };
        })}
      />
    </div>
  );
};

interface Props {}

const QueryEditor = (props: Props) => {
  const [tabProps, setTabProps] = React.useState<TabArray>({ id: 0, tabs: [] });
  const [query, setQuery] = React.useState('');
  const [runLoading, setRunLoading] = React.useState<boolean>(false);
  const [queryData, setQueryData] = React.useState<any>(null);
  const [messageApi, contextHolder] = message.useMessage();

  const handleEditorChange = (value: any, event: any) => {
    setQuery(value);
  };

  const handleRunClick = () => {
    if (!query) {
      messageApi.warning('Please input query');
      return;
    }

    setRunLoading(true);
    queryRun(
      {
        engine: 'bigquery',
        query: query,
      },
      {
        errorHandler: (error: any) => {
          messageApi.error(error.message);
        },
      },
    )
      .then((res) => {
        if (!res.success) {
          messageApi.error(res.errorMessage);
          return;
        }
        setTabProps((prev: TabArray) => {
          const prevQueryResult: TabProps = TabManager.findByName(prev, 'Query Result');
          let newPrev = prev;
          if (prevQueryResult) {
            newPrev = TabManager.remove(newPrev, prevQueryResult.id);
          }

          return TabManager.insertLastBefore(newPrev, {
            name: 'Query Result',
            icon: <TableOutlined />,
            children: (data: any) => {
              return <QueryResultTableTab queryData={data} />;
            },
            closeable: true,
          });
          // const insertAfterIndex = prev.length - 1 < 0 ? 0 : prev.length - 1; // 将新元素插入在最后一个元素后面

          // // 创建一个新的数组，将新元素插入到指定位置
          // const newArray = [...prev];
          // newArray.splice(insertAfterIndex, 0, {
          //   name: 'Query Result',

          //   icon: <TableOutlined />,
          //   children: <QueryResultTableTab queryData={res.data} />,
          // });

          // return newArray;
        });
        setQueryData(res.data);
      })
      .catch((err) => {
        messageApi.error(err.message);
      })
      .finally(() => {
        setRunLoading(false);
      });
  };

  return (
    <>
      {contextHolder}
      <Row gutter={24}>
        <Col span={24}>
          <div style={{ width: '100%' }}>
            <MonacoEditor
              width="100%"
              height={'400'}
              language="mysql"
              theme="vs-dark"
              value={query}
              // options={options}
              onChange={handleEditorChange}
              // editorDidMount={::this.editorDidMount}
            />
            <div className={styles.editorButton}>
              <Button type="primary" icon={<ExpandOutlined />}>
                Expand
              </Button>
              <Button
                type="primary"
                icon={<CodeOutlined />}
                loading={runLoading}
                onClick={handleRunClick}
              >
                Run
              </Button>
              <Button type="primary" icon={<FullscreenOutlined />}>
                Full Screen
              </Button>
            </div>
          </div>
        </Col>
      </Row>
      <Row gutter={24}>
        <Col span={24}>
          {queryData ? (
            <QueryVisualization
              queryData={queryData}
              runLoading={runLoading}
              tabProps={tabProps}
              setTabProps={setTabProps}
            />
          ) : null}
        </Col>
      </Row>
    </>
  );
};

export default QueryEditor;
