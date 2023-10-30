import { Card } from 'antd';
import React from 'react';
import Markdown from 'react-markdown';

type Props = {
  panel: HYPERDOT_API.DashboardPanel;
};

const TextWidgetPanel = (props: Props) => {
  return <Markdown>{props.panel.text}</Markdown>;
};

export default TextWidgetPanel;
