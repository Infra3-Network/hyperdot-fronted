import { TemplateChart } from './Template';
import {
  AreaChartOutlined,
  BarChartOutlined,
  DotChartOutlined,
  FieldNumberOutlined,
  LineChartOutlined,
  PieChartOutlined,
  TableOutlined,
} from '@ant-design/icons';
import { TableChartTemplate } from './Table';
import { type ChartNodeProps, type ChartProps } from './types';
import React from 'react';
import { CounterChartTemplate } from './Counter';

export const ChartNodeMap: Map<string, ChartNodeProps> = new Map([
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
      children: (props: ChartProps, index: number) => {
        return <TemplateChart {...{ type: 'bar', props: props, index }} />;
      },
    },
  ],
  [
    'area_chart',
    {
      name: 'Area Chart',
      icon: <AreaChartOutlined />,
      children: (props: ChartProps, index: number) => {
        return <TemplateChart {...{ type: 'area', props: props, index }} />;
      },
    },
  ],

  [
    'scatter_chart',
    {
      name: 'Scatter Chart',
      icon: <DotChartOutlined />,
      children: (props: ChartProps, index: number) => {
        return <TemplateChart {...{ type: 'scatter', props: props, index }} />;
      },
    },
  ],
  [
    'line_chart',
    {
      name: 'Line Chart',
      icon: <LineChartOutlined />,
      children: (props: ChartProps, index: number) => {
        return <TemplateChart {...{ type: 'line', props: props, index }} />;
      },
    },
  ],
  [
    'pie_chart',
    {
      name: 'Pie Chart',
      icon: <PieChartOutlined />,
      children: (props: ChartProps, index: number) => {
        return <TemplateChart {...{ type: 'pie', props: props, index }} />;
      },
    },
  ],
  [
    'data_table',
    {
      name: 'Table',
      icon: <TableOutlined />,
      children: (props: ChartProps, index: number) => {
        return <TableChartTemplate {...{ type: 'pie', props: props, index }} />;
      },
    },
  ],
  [
    'data_counter',
    {
      name: 'Counter',
      icon: <FieldNumberOutlined />,
      children: (props: ChartProps, index: number) => {
        return <CounterChartTemplate {...{ type: 'counter', props: props, index }} />;
      },
    },
  ],
]);

export const ChartIconMap: Map<string, React.ReactNode> = new Map([
  ['bar_chart', <BarChartOutlined style={{ fontSize: '20px', color: '#08c' }} />],
  ['area_chart', <AreaChartOutlined style={{ fontSize: '20px', color: '#08c' }} />],
  ['scatter_chart', <DotChartOutlined style={{ fontSize: '20px', color: '#08c' }} />],
  ['line_chart', <LineChartOutlined style={{ fontSize: '20px', color: '#08c' }} />],
  //   [
  //     'pie_chart',
  //     <PieChartOutlined style={{ fontSize: '20px', color: '#08c' }} />,
  //   ],
  ['data_table', <TableOutlined style={{ fontSize: '20px', color: '#08c' }} />],
  //   [
  //     'data_counter',
  //     <FieldNumberOutlined style={{ fontSize: '20px', color: '#08c' }} />,
  //   ],
]);
