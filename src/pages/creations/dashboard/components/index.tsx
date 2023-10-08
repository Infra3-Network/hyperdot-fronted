import MyIcon from '@/components/Icons';
import { HomeOutlined, UserOutlined } from '@ant-design/icons';
import { Breadcrumb, Button, Card, Col, List, Row, Space } from 'antd';
import React from 'react';

import { Rnd } from 'react-rnd';
import SettingsModal from './SettingsModal';
import TextWidgetModal from './TextWidgetModal';
import VisualizationModal from './VisualizationModal';

type Dashboard = {
  x: number;
  y: number;
  width: string;
  height: string;
  chart: string;
};

type WindowState = {
  width: number;
  height: number;
};

type Props = {
  dashboard: Dashboard;
};

const EditButtonGroup = (action: StateAction) => {
  const handleEditDoneClick = () => {
    action.setControlState((prev) => {
      return {
        ...prev,
        edit: false,
      };
    });
  };

  const handleSettingsClick = () => {
    action.setControlState((prev) => {
      return {
        ...prev,
        settingsModalOpen: true,
      };
    });
  };

  const handleTextWidgetClick = () => {
    action.setControlState((prev) => {
      return {
        ...prev,
        textWidgetModalOpen: true,
      };
    });
  };

  const handleVisualizationClick = () => {
    action.setControlState((prev) => {
      return {
        ...prev,
        visualizationModalOpen: true,
      };
    });
  };

  return (
    <Space>
      <Button type="primary" onClick={handleSettingsClick}>
        {' '}
        Settings{' '}
      </Button>
      <Button type="primary" onClick={handleTextWidgetClick}>
        {' '}
        Add text widget{' '}
      </Button>
      <Button type="primary" onClick={handleVisualizationClick}>
        {' '}
        Add Visualization{' '}
      </Button>
      <Button type="default" onClick={handleEditDoneClick}>
        {' '}
        Done{' '}
      </Button>
    </Space>
  );
};

const ViewButtonGroup = (action: StateAction) => {
  const handleEditClick = () => {
    action.setControlState((prev) => {
      return {
        ...prev,
        edit: true,
      };
    });
  };
  return (
    <Space>
      <Button type="primary"> Star </Button>
      <Button type="primary" onClick={handleEditClick}>
        {' '}
        Edit{' '}
      </Button>
    </Space>
  );
};

export const CreationDashboard = (props: Props) => {
  const gridColsPercent = 0.45;
  const gridCols = 2;
  const gridRows = 3;
  const [windowState, setWindowState] = React.useState<WindowState>();
  const [dashboards, setDashboards] = React.useState<Dashboard[]>([]);

  const [controlState, setControlState] = React.useState<ControlState>({
    edit: false,
    settingsModalOpen: false,
    textWidgetModalOpen: false,
    visualizationModalOpen: false,
  });

  const [dashboard, setDashboard] = React.useState<Dashboard>(props.dashboard);

  const stateAction: StateAction = {
    setControlState: setControlState,
    setDashboard: setDashboard,
  };

  const data = [
    {
      title: 'Title 1',
    },
    {
      title: 'Title 2',
    },
    {
      title: 'Title 3',
    },
    {
      title: 'Title 4',
    },
  ];

  React.useEffect(() => {
    setWindowState({
      width: window.innerWidth,
      height: window.innerHeight,
    });

    const width = window.innerWidth * gridColsPercent;
    const height = (window.innerHeight / 2) * 0.8;

    const its: Dashboard[] = data.map((v, index) => {
      return {
        x: 0,
        y: 0,
        width,
        height,
        chart: v.title,
      };
    });

    setDashboards(its);
  }, []);

  if (!dashboards) {
    return null;
  }

  console.log(history);

  console.log(dashboards);
  return (
    <>
      <Row gutter={[0, 24]}>
        {/* <Col span={24}>
          <Pages layout={Layout.Grid} />
        </Col> */}

        <Col span={24}>
          <Row justify={'space-between'}>
            <Col>
              <Breadcrumb>
                <Breadcrumb.Item href="">
                  <HomeOutlined />
                </Breadcrumb.Item>
                <Breadcrumb.Item href="">
                  <UserOutlined />
                  <span>Application List</span>
                </Breadcrumb.Item>
                <Breadcrumb.Item>Application</Breadcrumb.Item>
              </Breadcrumb>
            </Col>

            <Col>
              {controlState.edit ? EditButtonGroup(stateAction) : ViewButtonGroup(stateAction)}
            </Col>
          </Row>
        </Col>

        <Col span={24}>
          <ul>
            {dashboards.map((dash, index) => {
              return (
                <li key={index} style={{ position: 'relative' }}>
                  <Rnd
                    style={{ backgroundColor: 'gray' }}
                    default={{
                      width: dash.width,
                      height: dash.height,
                      x: dash.x,
                      y: dash.y,
                    }}
                    resizeGrid={[20, 30]}
                    dragGrid={[20, 30]}
                  >
                    {dash.chart}
                  </Rnd>
                </li>
              );
            })}
          </ul>
        </Col>
      </Row>

      <SettingsModal ctl={controlState} action={stateAction} />
      <TextWidgetModal ctl={controlState} action={stateAction} />
      <VisualizationModal ctl={controlState} action={stateAction} />
    </>
  );
};

export default CreationDashboard;
