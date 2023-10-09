import MyIcon from '@/components/Icons';
import { updateDashboard } from '@/services/hyperdot/api';
import { HomeOutlined, UserOutlined } from '@ant-design/icons';
import { Breadcrumb, Button, Card, Col, List, message, Row, Space } from 'antd';
import React from 'react';

import { Rnd } from 'react-rnd';
import SettingsModal from './SettingsModal';
import TextWidgetModal from './TextWidgetModal';
import TextWidgetPanel from './TextWidgetPanel';
import VisualizationModal from './VisualizationModal';

type WindowState = {
  width: number;
  height: number;
};

type Props = {
  editable: boolean;
  dashboard: HYPERDOT_API.Dashboard;
};

const EditButtonGroup = (ctl: ControlState, action: StateAction, onSave: any) => {
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
      <Button loading={ctl.saveLoading} type="default" onClick={onSave}>
        {' '}
        Save{' '}
      </Button>
    </Space>
  );
};

const ViewButtonGroup = (action: StateAction, editable: boolean) => {
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
      {editable && (
        <Button type="primary" onClick={handleEditClick}>
          {' '}
          Edit{' '}
        </Button>
      )}
    </Space>
  );
};

const getPanel = (panel: HYPERDOT_API.DashboardPanel) => {
  if (panel.type === 0) {
    return <TextWidgetPanel panel={panel} />;
  }
};

export const CreationDashboard = (props: Props) => {
  const gridColsPercent = 0.45;
  // const gridCols = 2;
  // const gridRows = 3;
  const [windowState, setWindowState] = React.useState<WindowState>();
  // const [dashboards, setDashboards] = React.useState<Dashboard[]>([]);

  const [controlState, setControlState] = React.useState<ControlState>({
    edit: false,
    settingsModalOpen: false,
    textWidgetModalOpen: false,
    visualizationModalOpen: false,
    saveLoading: false,
  });

  const [dashboard, setDashboard] = React.useState<HYPERDOT_API.Dashboard>(props.dashboard);
  const stateAction: StateAction = {
    setControlState: setControlState,
    setDashboard: setDashboard,
  };

  const handlePanelResizeStop = (index, e, direction, ref, delta, position) => {
    const width = ref.style.width;
    const height = ref.style.height;
    const panels = dashboard.panels;
    if (panels && panels[index]) {
      panels[index] = {
        ...panels[index],
        width: width,
        height: height,
      };
      setDashboard((prev) => {
        return {
          ...prev,
          panels: panels,
        };
      });
    }
  };

  const handlePanelDragStop = (index, e, d) => {
    const x_pos = d.x;
    const y_pos = d.y;
    const panels = dashboard.panels;
    if (panels && panels[index]) {
      panels[index] = {
        ...panels[index],
        x_pos: x_pos,
        y_pos: y_pos,
      };
      setDashboard((prev) => {
        return {
          ...prev,
          panels: panels,
        };
      });
    }
  };

  const handleEditSaveClick = () => {
    stateAction.setControlState((prev) => {
      return {
        ...prev,
        saveLoading: true,
      };
    });

    updateDashboard(dashboard)
      .then((res) => {
        if (!res.success) {
          message.error(res.errorMessage);
          return;
        }

        setDashboard(res.data);
      })
      .catch((err) => {
        message.error(err);
      })
      .finally(() => {
        stateAction.setControlState((prev) => {
          return {
            ...prev,
            edit: false,
            saveLoading: false,
          };
        });
      });
  };

  React.useEffect(() => {
    setWindowState({
      width: window.innerWidth,
      height: window.innerHeight,
    });

    const width = window.innerWidth * gridColsPercent;
    const height = (window.innerHeight / 2) * 0.8;
  }, []);

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
              {controlState.edit
                ? EditButtonGroup(controlState, stateAction, handleEditSaveClick)
                : ViewButtonGroup(stateAction, props.editable)}
            </Col>
          </Row>
        </Col>

        <Col span={24}>
          {dashboard.panels && (
            <ul>
              {dashboard.panels.map((panel, index) => {
                return (
                  <li key={index} style={{ position: 'relative' }}>
                    <Rnd
                      size={{ width: panel.width, height: panel.height }}
                      position={{ x: panel.x_pos, y: panel.y_pos }}
                      onResizeStop={(e, direction, ref, delta, position) =>
                        handlePanelResizeStop(index, e, direction, ref, delta, position)
                      }
                      onDragStop={(e, d) => handlePanelDragStop(index, e, d)}
                      resizeGrid={[20, 30]}
                      dragGrid={[20, 30]}
                    >
                      {getPanel(panel)}
                    </Rnd>
                  </li>
                );
              })}
            </ul>
          )}
        </Col>
      </Row>

      <SettingsModal ctl={controlState} action={stateAction} />
      <TextWidgetModal ctl={controlState} action={stateAction} />
      <VisualizationModal ctl={controlState} action={stateAction} />
    </>
  );
};

export default CreationDashboard;
