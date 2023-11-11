import { updateDashboard } from '@/services/hyperdot/api';
import { parseWindowString } from '@/utils';
import { EditOutlined, HomeOutlined, UserOutlined } from '@ant-design/icons';
import { Breadcrumb, Button, Card, Col, List, message, Row, Space } from 'antd';
import React, { memo } from 'react';

import { Rnd } from 'react-rnd';
import { history, Link } from 'umi';
import SettingsModal from './SettingsModal';
import TextWidgetModal from './TextWidgetModal';
import TextWidgetPanel from './TextWidgetPanel';
import VisualizationModal from './VisualizationModal';
import VisualizationPanel from './VisualizationPanel';
import EditPanelModal from './EditPanelModal';

import styles from './index.less';
import UserAvatar from '@/components/UserAvatar';

type WindowState = {
  width: number;
  height: number;
};

type Props = {
  editable: boolean;
  user: HYPERDOT_API.CurrentUser;
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
        Settings
      </Button>
      <Button type="primary" onClick={handleTextWidgetClick}>
        Add text widget
      </Button>
      <Button type="primary" onClick={handleVisualizationClick}>
        Add Visualization
      </Button>
      <Button loading={ctl.saveLoading} type="primary" onClick={onSave}>
        Save
      </Button>

      <Button
        type="default"
        onClick={() => {
          action.setControlState((prev) => {
            return {
              ...prev,
              edit: false,
            };
          });
        }}
      >
        Cancel
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

const PanelComponent = memo(
  (props: {
    panel: HYPERDOT_API.DashboardPanel;
    panelIndex: number;
    user: HYPERDOT_API.CurrentUser;
    ctl: ControlState;
    action: StateAction;
  }) => {
    const { panel, user } = props;
    return (
      <>
        {props.ctl.edit && (
          <div
            style={{
              position: 'absolute',
              top: '-2px',
              right: '0',
            }}
          >
            <EditOutlined
              onClick={() => {
                props.action.setControlState((prev) => {
                  return {
                    ...prev,
                    editPanelIndex: props.panelIndex,
                    editPanel: props.panel,
                    editPanelModalOpen: true,
                  };
                });
              }}
            />
          </div>
        )}
        {panel.type === 0 && <TextWidgetPanel panel={panel} />}
        {panel.type === 1 && <VisualizationPanel panel={panel} user={user} />}
      </>
    );
  },
);

export const CreationDashboard = (props: Props) => {
  const [isDragging, setIsDragging] = React.useState<boolean>(false);
  const [draggedIndex, setDraggedIndex] = React.useState(null); // 存储当前拖拽的元素索引
  const [offset, setOffset] = React.useState({ x: 0, y: 0 });

  const [controlState, setControlState] = React.useState<ControlState>({
    edit: false,
    settingsModalOpen: false,
    textWidgetModalOpen: false,
    visualizationModalOpen: false,
    saveLoading: false,
    editPanelModalOpen: false,
    editPanelIndex: -1,
  });

  const [dashboard, setDashboard] = React.useState<HYPERDOT_API.Dashboard>(props.dashboard);
  const stateAction: StateAction = {
    setControlState: setControlState,
    setDashboard: setDashboard,
  };

  const windowHeight = window.innerHeight;
  const windowWidth = window.innerWidth;
  const minWidth = windowWidth / 2.5;
  const minHeight = windowHeight / 2.5;

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

  const handleDragStart = (
    node: any,
    x: number,
    y: number,
    deltaX: number,
    deltaY: number,
    lastX: number,
    lastY: number,
    index: any,
  ) => {
    if (!controlState.edit) {
      return;
    }
    setIsDragging(true);
    setDraggedIndex(index);
    setOffset({ x, y });
  };

  const handleDragStop = () => {
    setIsDragging(false);
    setDraggedIndex(null);
    setOffset({ x: 0, y: 0 });
  };

  const handlePanelDrag = (
    e: any,
    d: { x: number; y: number; deltaX: number; deltaY: number; lastX: number; lastY: number },
    index: number,
  ) => {
    console.log(controlState.edit);
    if (!controlState.edit) {
      return;
    }

    const screenWidth = window.innerWidth;
    const panels = dashboard.panels;
    if (panels && panels[index]) {
      const panelWidthNumeric = parseWindowString(panels[index].width, 'width');
      if (panelWidthNumeric) {
        if (d.x < 0 || d.x + panelWidthNumeric > screenWidth) {
          return;
        }
      }

      const newPanels = [...panels];
      newPanels[index] = {
        ...newPanels[index],
        x_pos: d.x,
        y_pos: d.y,
      };

      setDashboard((prev) => {
        return {
          ...dashboard,
          panels: newPanels,
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
        message.info('Dashboard saved');
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

  return (
    <>
      <Row gutter={[0, 24]}>
        <Col span={24}>
          <Row justify={'space-between'}>
            <Col>
              <Breadcrumb>
                <Breadcrumb.Item href="/">
                  <HomeOutlined />
                </Breadcrumb.Item>
                <Breadcrumb.Item href="#">
                  <Space>
                    <UserAvatar
                      size={24}
                      username={props.user.username}
                      icon_url={props.user.icon_url}
                    />
                    <span>
                      <Link
                        to={'/account/center/' + props.user.id}
                        style={{ textDecoration: 'none', color: 'inherit' }}
                      >
                        @{props.user.username}
                      </Link>
                    </span>
                  </Space>
                </Breadcrumb.Item>
                <Breadcrumb.Item href="#">{dashboard.name}</Breadcrumb.Item>
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
          <Card
            style={{
              position: 'relative',
              overflow: 'auto',
              width: window.innerWidth - 65,
              height: window.innerHeight,
            }}
          >
            {dashboard.panels && (
              <ul>
                {dashboard.panels.map((panel, index) => {
                  return (
                    <li key={index}>
                      <div className={`${styles.draggingBox} ${isDragging ? styles.dragging : ''}`}>
                        <Rnd
                          size={{ width: panel.width, height: panel.height }}
                          position={{ x: panel.x_pos, y: panel.y_pos }}
                          enableResizing={
                            controlState.edit
                              ? {
                                  top: false,
                                  right: true,
                                  bottom: true,
                                  left: false,
                                  topRight: false,
                                  bottomRight: true,
                                  bottomLeft: false,
                                  topLeft: false,
                                }
                              : false
                          }
                          onResizeStop={(e, direction, ref, delta, position) => {
                            if (!controlState.edit) {
                              return;
                            }
                            handlePanelResizeStop(index, e, direction, ref, delta, position);
                          }}
                          dragAxis={controlState.edit ? 'both' : 'none'}
                          onDrag={(e, d) => handlePanelDrag(e, d, index)}
                          onDragStart={(node: any, { x, y, deltaX, deltaY }) => {
                            handleDragStart(
                              node,
                              x,
                              y,
                              deltaX,
                              deltaY,
                              node.offsetLeft,
                              node.offsetTop,
                              index,
                            );
                          }}
                          onDragStop={handleDragStop}
                          resizeGrid={[10, 50]}
                          dragGrid={[10, 20]}
                        >
                          <div
                            className={`${styles.draggingBox} ${
                              index === draggedIndex && isDragging ? styles.dragging : ''
                            }`}
                          >
                            <Card
                              bordered
                              className={`${
                                controlState.edit
                                  ? styles.editPanelContainer
                                  : styles.panelContainer
                              }`}
                              style={{
                                minWidth: `${panel.width ? '' : minWidth}}`,
                                minHeight: `${panel.height ? '' : minHeight}}}`,
                                width: panel.width,
                                height: panel.height,
                              }}
                            >
                              <PanelComponent
                                panel={panel}
                                panelIndex={index}
                                user={props.user}
                                ctl={controlState}
                                action={stateAction}
                              />
                            </Card>
                          </div>
                        </Rnd>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </Card>
        </Col>
      </Row>

      <SettingsModal ctl={controlState} action={stateAction} dashboard={dashboard} />
      <TextWidgetModal ctl={controlState} action={stateAction} />
      {props.user && (
        <VisualizationModal ctl={controlState} action={stateAction} user={props.user} />
      )}
      <EditPanelModal ctl={controlState} action={stateAction} />
    </>
  );
};

export default CreationDashboard;
