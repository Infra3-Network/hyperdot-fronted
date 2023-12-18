import { ChartIconMap } from '@/components/Charts';
import { listUserQueryChart } from '@/services/hyperdot/api';
import { Button, Col, Input, List, message, Modal, Row, Space } from 'antd';
import { useEffect, useState } from 'react';
import { Link } from 'umi';

type Props = {
  ctl: ControlState;
  action: StateAction;
  user: HYPERDOT_API.CurrentUser;
};

type InnerState = {
  initLoading: boolean;
  loadingMore: boolean;
  page: number;
  total: number;
};

const VisualizationModal = (props: Props) => {
  const pageSize = 5;
  const [dataCopy, setDataCopy] = useState<HYPERDOT_API.Chart[]>([]); // for search
  const [data, setData] = useState<HYPERDOT_API.Chart[]>([]);
  const [state, setState] = useState<InnerState>({
    initLoading: true,
    loadingMore: false,
    page: 1,
    total: 0,
  });

  useEffect(() => {
    listUserQueryChart(state.page, pageSize, props.user.id)
      .then((res) => {
        if (!res.success) {
          message.error(res.errorMessage);
          return;
        }

        if (!res.data.charts) {
          setState((prev) => {
            return {
              ...prev,
              initLoading: false,
            };
          });
          return;
        }

        setData(res.data.charts);

        setDataCopy(res.data.charts);

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
      id: 0,
      user_id: 0,
      dashboard_id: 0,
      name: undefined,
      description: undefined,
      text: undefined,
      created_at: undefined,
      updated_at: undefined,
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

  const handleCancel = () => {
    props.action.setControlState((prev) => {
      return {
        ...prev,
        visualizationModalOpen: false,
      };
    });
  };

  const handleSearch = (e: any) => {
    const target = e.target.value;
    if (!data || data.length == 0) {
      setDataCopy([]);
      return;
    }

    if (!target) {
      setDataCopy(data);
      return;
    }

    const filteredCharts = data.filter((chart) => {
      const chartName = chart.name ? chart.name : '';
      const queryName = chart.query_name ? chart.query_name : '';

      return chartName.includes(target) || queryName.includes(target);
    });

    setDataCopy(filteredCharts);
  };

  const onLoadMore = () => {
    setState((prev) => {
      return {
        ...prev,
        loadingMore: true,
      };
    });

    listUserQueryChart(state.page, pageSize)
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

        setDataCopy((prev) => {
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
          marginTop: '12px',
          marginBottom: '12px',
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
        footer={[
          <Button key="cancel" type={'default'} onClick={handleCancel}>
            Cancel
          </Button>,
        ]}
        closable={false}
      >
        <Row gutter={[0, 16]}>
          <Col span={24}>
            <Input placeholder="Search your queries..." onChange={handleSearch} />
          </Col>

          <Col span={24}>
            <div
              style={{
                overflow: 'auto',
              }}
            >
              <List
                bordered
                dataSource={dataCopy}
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
                            @{props.user.username}
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
