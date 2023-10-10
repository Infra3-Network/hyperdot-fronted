import { getCurrentUserChart } from '@/services/hyperdot/api';
import { Card, message, Spin } from 'antd';
import React, { useEffect } from 'react';

type Props = {
  panel: HYPERDOT_API.DashboardPanel;
};

const VisualizationPanel = (props: Props) => {
  const [loading, setLoading] = React.useState<boolean>(false);
  const [chart, setChart] = React.useState<HYPERDOT_API.Chart | undefined>(undefined);
  useEffect(() => {
    setLoading(true);
    getCurrentUserChart(props.panel.chart_id, props.panel.query_id)
      .then((res) => {
        if (!res.success) {
          message.error(res.errorMessage);
          return;
        }
        setChart(res.data);
        console.log(res.data);
      })
      .catch((err) => {
        message.error(err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <Spin tip="Loading" spinning={loading} delay={1000}>
      {chart && (
        <Card bordered style={{ width: props.panel.width, height: props.panel.height }}>
          Visualization Panel
        </Card>
      )}
    </Spin>
  );
};

export default VisualizationPanel;
