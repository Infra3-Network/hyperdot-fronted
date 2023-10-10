import { ChartIconMap } from '@/components/Charts';
import { listCurrentUserChart } from '@/services/hyperdot/api';
import { Button, Col, Input, List, message, Modal, Row, Space } from 'antd';
import { useEffect, useState } from 'react';
import { Link } from 'umi';

type Props = {
  ctl: ControlState;
  action: StateAction;
  currentUser: HYPERDOT_API.CurrentUser;
};

type InnerState = {
  initLoading: boolean;
  loadingMore: boolean;
  page: number;
  total: number;
};

const VisualizationModal = (props: Props) => {
  const pageSize = 5;
  const [data, setData] = useState<HYPERDOT_API.Chart[]>([]);
  const [state, setState] = useState<InnerState>({
    initLoading: true,
    loadingMore: false,
    page: 1,
    total: 0,
  });

  useEffect(() => {
    listCurrentUserChart(state.page, pageSize)
      .then((res) => {
        if (!res.success) {
          message.error(res.errorMessage);
          return;
        }

        setData(res.data.charts);

        setState((prev) => {
          return {
            ...prev,
            initLoading: false,
            page: prev.page + 1,
            total: res.data.total,
          };
        });
      })
      .catch((err) => {
        setState((prev) => {
          return {
            ...prev,
            loadingMore: false,
          };
        });
        message.error(err.message);
      });
  }, []);

  const handleAdd = (chart: HYPERDOT_API.Chart) => {
    // make HYPERDOT_API.DashboardPanel from chart
    const panel: HYPERDOT_API.DashboardPanel = {
      type: 1,
      x_pos: 0,
      y_pos: 0,
      width: 'auto',
      height: 'atuo',
      chart_id: chart.chart_id || 0,
      query_id: chart.query_id || 0,
    };

    // add panel to dashboard
    props.action.setDashboard((prev) => {
      if (!prev.panels) {
        prev.panels = [];
      }

      return {
        ...prev,
        panels: [...prev.panels, panel],
      };
    });
  };

  const handleOk = () => {
    props.action.setControlState((prev) => {
      return {
        ...prev,
        visualizationModalOpen: false,
      };
    });
  };

  const handleCancel = () => {
    props.action.setControlState((prev) => {
      return {
        ...prev,
        visualizationModalOpen: false,
      };
    });
  };

  const onLoadMore = () => {
    setState((prev) => {
      return {
        ...prev,
        loadingMore: true,
      };
    });

    listCurrentUserChart(state.page, pageSize)
      .then((res) => {
        if (!res.success) {
          message.error(res.errorMessage);
          return;
        }

        if (!res.data.charts || res.data.charts.length === 0) {
          setState((prev) => {
            return {
              ...prev,
              loadingMore: false,
            };
          });
          return;
        }

        setData((prev) => {
          return [...prev, ...res.data.charts];
        });

        setState((prev) => {
          return {
            ...prev,
            loadingMore: false,
            page: prev.page + 1,
            total: res.data.total,
          };
        });
      })
      .catch((err) => {
        setState((prev) => {
          return {
            ...prev,
            loadingMore: false,
          };
        });
        message.error(err.message);
      });
  };

  const loadMore =
    !state.initLoading && !state.loadingMore ? (
      <div
        style={{
          textAlign: 'center',
          marginTop: 12,
          height: 32,
          lineHeight: '32px',
        }}
      >
        {data.length < state.total ? (
          <Button onClick={onLoadMore}>loading more</Button>
        ) : (
          <Button disabled type="text">
            It is all, nothing more 🤐
          </Button>
        )}
      </div>
    ) : null;

  return (
    <>
      <Modal
        open={props.ctl.visualizationModalOpen}
        okText={'Done'}
        cancelText={'Cancel'}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Row gutter={[0, 16]}>
          <Col span={24}>
            <Input placeholder="Search your queries..." />
          </Col>

          <Col span={24}>
            <div
              style={{
                overflow: 'auto',
              }}
            >
              <List
                bordered
                dataSource={data}
                loading={state.initLoading}
                loadMore={loadMore}
                renderItem={(item) => (
                  <List.Item
                    style={{
                      // backgroundColor: 'gray',
                      borderBottom: '1px solid white',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                      }}
                    >
                      <Space>
                        {item.type && ChartIconMap.get(item.type)}
                        <span>
                          <Link to={''} style={{ textDecoration: 'none', color: 'inherit' }}>
                            @{props.currentUser.username}
                          </Link>
                          /{item.query_name}
                        </span>
                        <span>{item.name}</span>
                      </Space>
                    </div>
                    <Button type="primary" onClick={() => handleAdd(item)}>
                      Add
                    </Button>
                  </List.Item>
                )}
              />
            </div>
          </Col>
        </Row>
      </Modal>
    </>
  );
};

export default VisualizationModal;
