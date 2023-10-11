import { getCurrentUserChart } from '@/services/hyperdot/api';
import { Card, message, Spin } from 'antd';
import React, { useEffect } from 'react';
import { queryRun } from '@/services/hyperdot/api';
import { Area, Line, Bar, Scatter } from '@ant-design/charts';

type Props = {
  panel: HYPERDOT_API.DashboardPanel;
};

const makeChartConfig = (chart: HYPERDOT_API.Chart, data: any) => {
  if (chart.config) {
    const config = JSON.parse(chart.config);
    if (!config) {
      return undefined;
    }

    return {
      data: data.rows,
      ...config,
    };
  }

  if (chart.type == 'area_chart' || chart.type == 'line_chart') {
    const x = data.schemas.length < 1 ? '' : (data.schemas[0].name as string);
    const y = data.schemas.length < 2 ? '' : (data.schemas[1].name as string);
    const seriesField = '';
    return {
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
  }
};

const generateChart = (chart: HYPERDOT_API.Chart, data: any) => {
  const c = makeChartConfig(chart, data);
  if (!c) {
    return null;
  }
  console.log(c, chart.type);
  switch (chart.type) {
    case 'bar_chart':
      return <div>Bar Chart</div>;
    case 'area_chart':
      return (
        <>
          <Area {...c} />
        </>
      );
    case 'scatter_chart':
      return <div>Scatter Chart</div>;
    case 'line_chart':
      return (
        <>
          <Line {...c} />
        </>
      );
    default:
      return <div>Loading bad</div>;
  }
};

const VisualizationPanel = (props: Props) => {
  const [loading, setLoading] = React.useState<boolean>(false);
  const [chart, setChart] = React.useState<HYPERDOT_API.Chart | undefined>(undefined);
  const [data, setData] = React.useState<any>(undefined);
  useEffect(() => {
    setLoading(true);
    getCurrentUserChart(props.panel.chart_id, props.panel.query_id)
      .then((res) => {
        if (!res.success) {
          message.error(res.errorMessage);
          return;
        }
        setChart(res.data);

        if (res.data.query && res.data.query_engine) {
          queryRun(res.data.query, res.data.query_engine)
            .then((queryRes) => {
              if (!queryRes.success) {
                message.error(queryRes.errorMessage);
                return;
              }
              setData(queryRes.data);
            })
            .catch((err) => {
              message.error(err.message);
            })
            .finally(() => {
              setLoading(false);
            });
        } else {
          message.error('Query or Query Engine not found');
          return;
        }
      })
      .catch((err) => {
        message.error(err.message);
      })
      .finally(() => {});
  }, []);

  return (
    <Card bordered style={{ width: props.panel.width, height: props.panel.height }}>
      <Spin tip="Loading" spinning={loading}>
        {chart && data && generateChart(chart, data)}
      </Spin>
    </Card>
  );
};

export default VisualizationPanel;
