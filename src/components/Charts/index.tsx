import { TemplateChart } from './Template';
import {
  AreaChartOutlined,
  BarChartOutlined,
  DotChartOutlined,
  LineChartOutlined,
  TableOutlined,
} from '@ant-design/icons';
import { TableChart } from './Table';
import { type ChartProps } from './types';

interface ChartNodeProps {
  name: string;
  icon: React.ReactNode;
  children: (props: ChartProps) => React.ReactNode;
}

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
      children: (props: ChartProps) => {
        return <TemplateChart {...{ type: 'bar', props: props }} />;
      },
    },
  ],
  [
    'area_chart',
    {
      name: 'Area Chart',
      icon: <AreaChartOutlined />,
      children: (props: ChartProps) => {
        return <TemplateChart {...{ type: 'area', props: props }} />;
      },
    },
  ],

  [
    'scatter_chart',
    {
      name: 'Scatter Chart',
      icon: <DotChartOutlined />,
      children: (props: ChartProps) => {
        return <TemplateChart {...{ type: 'scatter', props: props }} />;
      },
    },
  ],
  [
    'line_chart',
    {
      name: 'Line Chart',
      icon: <LineChartOutlined />,
      children: (props: ChartProps) => {
        return <TemplateChart {...{ type: 'line', props: props }} />;
      },
    },
  ],
  //   [
  //     'pie_chart',
  //     {
  //       name: 'Pie Chart',
  //       icon: <PieChartOutlined />,
  //       children: (props: QE.ChartTabProps) => {
  //         return <PieChartTab {...props} />;
  //       },
  //     },
  //   ],
  [
    'data_table',
    {
      name: 'Table',
      icon: <TableOutlined />,
      children: (props: ChartProps) => {
        return <TableChart {...props} />;
      },
    },
  ],
  //   [
  //     'data_counter',
  //     {
  //       name: 'Counter',
  //       icon: <FieldNumberOutlined />,
  //       children: (props: QE.ChartTabProps) => {
  //         return <QueryResultTableTab {...props} />;
  //       },
  //     },
  //   ],
]);
