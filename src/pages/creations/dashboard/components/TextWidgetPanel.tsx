import { Card } from 'antd';
import React from 'react';
import Markdown from 'react-markdown';

type Props = {
  panel: HYPERDOT_API.DashboardPanel;
};

const TextWidgetPanel = (props: Props) => {
  return (
    <Card bordered style={{ width: props.panel.width, height: props.panel.height }}>
      <Markdown>{props.panel.text}</Markdown>
    </Card>
  );
};

export default TextWidgetPanel;
