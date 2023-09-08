import { ScatterChartOutlined } from '@/components/Icons';
import {
  AreaChartOutlined,
  BarChartOutlined,
  LineChartOutlined,
  PieChartOutlined,
  DotChartOutlined,
  TableOutlined,
  FieldNumberOutlined,
} from '@ant-design/icons';
import { Tabs, Row, Col, Select, Button, message } from 'antd';
import React from 'react';

const chart2icon: Map<string, React.ReactNode> = new Map([
  ['bar_chart', <BarChartOutlined />],
  ['area_chart', <AreaChartOutlined />],
  ['scatter_chart', <DotChartOutlined />],
  ['line_chart', <LineChartOutlined />],
  ['pie_chart', <PieChartOutlined />],
  ['data_table', <TableOutlined />],
  ['data_counter', <FieldNumberOutlined />],
]);

const chartValue2Name: Map<string, string> = new Map([
  ['bar_chart', 'Bar Chart'],
  ['area_chart', 'Area Chart'],
  ['scatter_chart', 'Scatter Chart'],
  ['line_chart', 'Line Chart'],
  ['pie_chart', 'Pie Chart'],
  ['data_table', 'Data Table'],
  ['data_counter', 'Data Counter'],
]);

interface NewVisualizationTabProps {
  tabProps: any;
  setTabProps: any;
  setTabActiveKey: any;
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
    const name: string = chartValue2Name.get(chart);
    if (!name) {
      messageApi.open({
        content: `the visualization type not supported`,
        type: 'error',
      });
      setChart(chart);
      return;
    }
    props.setTabProps((prev: any) => {
      const insertAfterIndex = prev.length - 1 < 0 ? 0 : prev.length - 1; // 将新元素插入在最后一个元素后面

      // 创建一个新的数组，将新元素插入到指定位置
      const newArray = [...prev];
      newArray.splice(insertAfterIndex, 0, {
        name: chartValue2Name.get(chart),
        icon: chart2icon.get(chart),
        children: <div> {chart} </div>,
      });

      return newArray;
    });
    props.setTabActiveKey(props.tabProps.length - 1);
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

interface TabProps {
  name: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}

const QueryVisualization = () => {
  const [tabProps, setTabProps] = React.useState<TabProps[]>([]);
  const [tabActiveKey, setTabActiveKey] = React.useState<string>('1');
  const initialTabs: TabProps[] = [
    {
      name: 'New visualization',
      icon: null,
      children: (
        <NewVisualizationTab
          tabProps={tabProps}
          setTabProps={setTabProps}
          setTabActiveKey={setTabActiveKey}
        />
      ),
    },
  ];

  React.useEffect(() => {
    setTabProps(initialTabs);
    return () => {};
  }, []);

  return (
    <div>
      <Tabs
        defaultActiveKey={tabActiveKey}
        items={tabProps.map((v, i) => {
          const id = String(i + 1);
          return {
            label: (
              <span>
                {v.icon}
                {v.name}
              </span>
            ),
            key: id,
            children: v.children,
            style: {},
          };
        })}
      />
    </div>
  );
};

export default QueryVisualization;
