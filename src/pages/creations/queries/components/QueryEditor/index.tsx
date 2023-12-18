import MonacoEditor from 'react-monaco-editor';
import {
  BarChartOutlined,
  CloseOutlined,
  CodeOutlined,
  ExpandOutlined,
  EyeFilled,
  EyeInvisibleFilled,
  FullscreenOutlined,
  SaveOutlined,
} from '@ant-design/icons';
import { Tabs, Row, Col, Button, Modal, Input, Switch, message, Spin, Select } from 'antd';
import React, { useEffect, useRef } from 'react';
import styles from './index.less';
import { useHistory } from 'umi';
import { createQuery, queryRun, removeChart, updateQuery } from '@/services/hyperdot/api';
import {
  ChartManager,
  type ChartArray,
  type ChartNodeProps,
  type ChartProps,
} from '@/components/Charts/types';
import { ChartNodeMap } from '@/components/Charts';

type NewVisualizationTabProps = {
  queryData: any;
  setTabActiveKey: any;
  handleTabClose: any;
  chartMgr: ChartManager;
  chartNodeMap: Map<string, ChartNodeProps>;
};

export const NewVisualizationTab = (props: NewVisualizationTabProps) => {
  const [chart, setChart] = React.useState<string>('bar_chart');
  const [messageApi, contextHolder] = message.useMessage();
  const virsualizationOptions: any[] = [
    {
      label: 'Chart visualization',
      options: [
        { label: 'Bar Chart', value: 'bar_chart' },
        { label: 'Area Chart', value: 'area_chart' },
        { label: 'Scatter Chart', value: 'scatter_chart' },
        { label: 'Line Chart', value: 'line_chart' },
        { label: 'Pie Chart', value: 'pie_chart' },
      ],
    },
    {
      label: 'Data visualization',
      options: [
        { label: 'Table', value: 'data_table' },
        { label: 'Counter', value: 'data_counter' },
      ],
    },
  ];

  const handleChange = (value: string) => {
    setChart(value);
    return;
  };

  const handleAddVisualizationClick = () => {
    const chartNode = props.chartNodeMap.get(chart);
    if (chartNode == undefined) {
      return;
    }

    if (!chartNode.name) {
      messageApi.open({
        content: `the visualization type not supported`,
        type: 'error',
      });
      setChart(chartNode.name);
      return;
    }

    props.chartMgr.insertLastBefore({
      name: chartNode.name,
      type: chart,
      closeable: true,
    });
  };

  return (
    <>
      {contextHolder}
      <Row gutter={16}>
        <Col>
          <p> Select visualization type </p>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col>
          <Select
            defaultValue={chart}
            style={{ width: 200 }}
            onChange={handleChange}
            options={virsualizationOptions}
          />
        </Col>
      </Row>

      <Row gutter={16}>
        <Col>
          <Button onClick={handleAddVisualizationClick}> Add visualization</Button>
        </Col>
      </Row>
    </>
  );
};

interface QueryVisualizationProps {
  queryData: any;
  runLoading: boolean;
  chartMgr: ChartManager;
}

const QueryVisualization = (props: QueryVisualizationProps) => {
  const handleCloseClick = (index: number, setTabItems: any) => {
    // remove from items
    const chart = props.chartMgr.get(index);
    if (chart && chart.id) {
      removeChart(chart.id, {})
        .then((res) => {
          if (!res.success) {
            message.error(res.errorMessage);
            return;
          }

          props.chartMgr.remove(index);
          message.success('Remove success');
        })
        .catch((err) => {
          message.error(err.message);
        });
    } else {
      props.chartMgr.remove(index);
    }
  };

  const [tabActiveKey, setTabActiveKey] = React.useState<string>('0');
  const [tabItems, setTabItems] = React.useState<any[]>([]);

  useEffect(() => {
    setTabItems((prev) => {
      const newItems = props.chartMgr
        .getCharts()
        .map((params: HYPERDOT_API.Chart, index: number) => {
          let children, icon;
          if (params.type === 'new') {
            children = (v: ChartProps) => {
              const newProps: NewVisualizationTabProps = {
                queryData: props.queryData,
                chartMgr: v.manager,
                chartNodeMap: ChartNodeMap,
                setTabActiveKey: setTabActiveKey,
                handleTabClose: handleCloseClick,
              };
              return <NewVisualizationTab {...newProps} />;
            };
            icon = <BarChartOutlined />;
          } else {
            if (!params.type) {
              return null;
            }

            const chartNode = ChartNodeMap.get(params.type);
            if (chartNode == undefined) {
              return null;
            }
            icon = chartNode.icon;
            children = chartNode.children;
          }
          return {
            label: (
              <div>
                <span>
                  {icon}
                  {params.name}
                </span>
                {params.closeable ? (
                  <span style={{ marginLeft: '12px' }}>
                    <CloseOutlined
                      onClick={() => {
                        handleCloseClick(index, setTabItems);
                      }}
                    />
                  </span>
                ) : null}
              </div>
            ),
            key: index,
            children: children(
              {
                manager: props.chartMgr,
                params: params,
                data: props.queryData,
              },
              index,
            ),
            style: {},
            closable: params.closeable,
            forceRender: false,
          };
        });

      return newItems;
    });
  }, [props.chartMgr]);

  if (!props.queryData) {
    return null;
  }
  return (
    <div>
      <Tabs
        tabPosition={'top'}
        // style={{ width:  }}
        activeKey={tabActiveKey}
        onChange={(activeKey: string) => {
          setTabActiveKey(activeKey);
        }}
        items={tabItems}
      />
    </div>
  );
};

interface SaveModalProps {
  saveModalOpen: boolean;
  handleOk: any;
  handleCancel: any;
  queryNormalState: QueryNormalState;
  setQueryNormalState: React.Dispatch<React.SetStateAction<QueryNormalState>>;
}
const SaveModal = (props: SaveModalProps) => {
  const handleNameChange = (e: any) => {
    if (!e.target.value) {
      return;
    }
    props.setQueryNormalState((prev) => {
      return { ...prev, name: e.target.value };
    });
  };

  const handlePrivacyChange = (checked: boolean) => {
    props.setQueryNormalState((prev) => {
      return { ...prev, privacy: checked };
    });
  };

  return (
    <>
      <Modal
        title="Save query"
        open={props.saveModalOpen}
        onOk={props.handleOk}
        onCancel={props.handleCancel}
        okText={'Save'}
        cancelText={'Cancel'}
      >
        <Row gutter={[0, 16]}>
          <Col span={24}>
            <Input
              addonBefore="Name"
              defaultValue={props.queryNormalState.name}
              onPressEnter={handleNameChange}
              onMouseLeave={handleNameChange}
            />
          </Col>
          <Col span={24}>
            <span style={{ marginRight: '12px' }}>Make privacy</span>
            <Switch
              defaultChecked={props.queryNormalState.privacy}
              checkedChildren={<EyeInvisibleFilled />}
              unCheckedChildren={<EyeFilled />}
              onChange={handlePrivacyChange}
            />
          </Col>
        </Row>
      </Modal>
    </>
  );
};

interface QueryNormalState {
  // query: string;
  name: string;
  privacy: boolean;
  engine: string;
}

interface Props {
  editable: boolean;
  editorQuery: string;
  setEditorQuery: React.Dispatch<React.SetStateAction<string>>;
  user: HYPERDOT_API.CurrentUser;
  userQuery?: HYPERDOT_API.UserQuery;
}

const QueryEditor = (props: Props) => {
  // state for save modal control
  const [saveModalOpen, setSaveModalOpen] = React.useState<boolean>(false);

  // state for editor query save state
  const [queryNormal, setQueryNormal] = React.useState<QueryNormalState>({
    name: 'Unsaved',
    privacy: false,
    engine: 'bigquery', // TODO: from props
  });

  const [editorCharts, setEditorCharts] = React.useState<ChartArray>({
    // nextIndex: 0,
    charts: [],
  });
  const chartMgr = new ChartManager(editorCharts, setEditorCharts);

  // const [tabProps, setTabProps] = React.useState<QE.TabArray>({ id: 0, tabs: [] });
  const [runLoading, setRunLoading] = React.useState<boolean>(false);
  const [queryData, setQueryData] = React.useState<any>(null);
  const [messageApi, contextHolder] = message.useMessage();
  const [fullScreen, setFullScreen] = React.useState<boolean>(false);
  const [isExpand, setIsExpand] = React.useState<boolean>(false);
  const editorRef = useRef<MonacoEditor>(null);
  const history = useHistory();

  const updateStateByUserQuery = (userQuery: HYPERDOT_API.UserQuery) => {
    setQueryNormal({
      engine: userQuery.query_engine,
      privacy: userQuery.is_privacy ? userQuery.is_privacy : false,
      name: userQuery.name ? userQuery.name : 'Unsaved',
    });

    props.setEditorQuery(userQuery.query ? userQuery.query : '');

    if (userQuery.unsaved ? userQuery.unsaved : false) {
      // if unsaved query, we create these tabs
      const charts: HYPERDOT_API.Chart[] = [
        {
          name: 'Query Result',
          type: 'data_table',
          closeable: true,
        },
      ];

      // if the query is owned by current user, we add new visualization tab
      if (props.editable) {
        charts.push({
          name: 'New Visualization',
          type: 'new',
          closeable: false,
        });
      }

      chartMgr.reset(charts);
    } else {
      const charts: HYPERDOT_API.Chart[] = [...(userQuery.charts ? userQuery.charts : [])];

      // if the query is owned by current user, we add new visualization tab
      if (props.editable) {
        charts.push({
          name: 'New Visualization',
          type: 'new',
          closeable: false,
        });
      }

      chartMgr.reset(charts);
    }
  };

  const handleEditorChange = (value: any) => {
    props.setEditorQuery(value);
  };

  const handleQuerySave = async () => {
    setSaveModalOpen(true);

    if (!queryNormal.engine) {
      messageApi.error('query engine empty');
    }
    if (!props.editorQuery) {
      messageApi.error('query empty');
      return;
    }

    try {
      const charts = chartMgr
        .getCharts()
        .filter((v) => v.type != 'new')
        .map((v) => {
          if (v.config) {
            delete v.config.data;
          }
          return v;
        });

      const body = {
        id: props.userQuery ? props.userQuery.id : 0,
        user_id: Number(props.user.id),
        name: queryNormal.name,
        query: props.editorQuery,
        query_engine: queryNormal.engine,
        is_privacy: queryNormal.privacy,
        created_at: props.userQuery?.created_at,
        updated_at: props.userQuery?.created_at,
        charts: charts.map((v) => {
          if (v.config && v.config.data) {
            delete v.config.data;
          }
          return {
            ...v,
            query_id: Number(props.userQuery ? props.userQuery.id : 0),
            user_id: Number(props.user.id),
          };
        }),
      };

      const res = await updateQuery(body, {});
      if (res.success) {
        messageApi.info('Save success');

        if (!res.data) {
          messageApi.error('Unkown error');
          return;
        }
        chartMgr.clear();
        if (res.data) {
          updateStateByUserQuery(res.data);
        }
        return;
      }

      messageApi.error(res.errorMessage);
    } catch (err) {}
  };

  const handleRunClick = () => {
    if (!props.editorQuery) {
      messageApi.warning('Please input query');
      return;
    }

    if (!queryNormal.engine) {
      messageApi.warning('Please select query engine');
      return;
    }

    if (props.userQuery != undefined) {
      // if (
      //   queryNormal.query == props.userQuery.query &&
      //   queryNormal.engine == props.userQuery.query_engine
      // ) {
      //   // not change
      //   messageApi.info('Query not change');
      //   return;
      // }
      // if exists userQuery, we only run new input query
      setRunLoading(true);
      queryRun(
        {
          query: props.editorQuery,
          engine: queryNormal.engine,
        },
        {
          errorHandler: (error: any) => {
            messageApi.error(error.message);
          },
        },
      )
        .then((res) => {
          if (!res.success) {
            messageApi.error(res.errorMessage);
            return;
          }
          setQueryData(res.data);
        })
        .catch((err) => {
          messageApi.error(err.message);
        })
        .finally(() => {
          setRunLoading(false);
        });
      return;
    }

    // first create unsaved query to get id
    createQuery(
      {
        query: props.editorQuery,
        query_engine: queryNormal.engine,
        is_privacy: false,
        unsaved: true,
      },
      {
        errorHandler: (error: any) => {
          messageApi.error(error.message);
        },
      },
    )
      .then((res) => {
        if (!res.success) {
          messageApi.error(res.errorMessage);
          return;
        }

        if (res.data == undefined) {
          messageApi.error('Unkown error');
          return;
        }

        history.push('/creations/queries/' + res.data.id);
      })
      .catch((err) => {
        messageApi.error(err.message);
      });
  };

  const handleFullScreenToggle = () => {
    const isFullScreen = !fullScreen;
    setFullScreen(isFullScreen);
    const editor = editorRef.current?.editor;
    if (isFullScreen) {
      editor?.layout({
        height: document.body.clientHeight,
        width: document.body.clientWidth,
      });
    } else {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      }

      const dom = document.getElementById('monaco-editor-container');
      editor?.layout({
        height: dom?.clientHeight || 300,
        width: dom?.clientWidth || 500,
      });
    }
  };

  useEffect(() => {
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && fullScreen) {
        handleFullScreenToggle();
      }
    });
  }, [fullScreen]);

  // If props.id is defined, then
  //  1. fetch saved query,
  //  2. run query to fetch queryData if queryData is null
  /// 3. set TabProps, queryNomal state
  useEffect(() => {
    if (props.userQuery != undefined) {
      const userQuery = props.userQuery;
      setRunLoading(true);
      queryRun(
        {
          query: userQuery.query,
          engine: userQuery.query_engine,
        },
        {
          errorHandler: (error: any) => {
            messageApi.error(error.message);
          },
        },
      )
        .then((queryRes) => {
          if (!queryRes.success) {
            messageApi.error(queryRes.errorMessage);
            return;
          }

          setQueryData(queryRes.data);
        })
        .catch((err) => {
          messageApi.error(err.message);
        })
        .finally(() => {
          setRunLoading(false);
        });
      updateStateByUserQuery(userQuery);
    } else {
      if (chartMgr.getByName('New Visualization')) {
        return;
      }

      chartMgr.add({
        name: 'New Visualization',
        type: 'new',
        closeable: false,
      });
      // setTabProps((prev: QE.TabArray) => {
      //   if (TabManager.findByName(prev, 'New Visualization')) {
      //     return prev;
      //   }

      //   return TabManager.add(prev, );
      // });
    }
  }, []);

  return (
    <>
      {contextHolder}

      <Row gutter={24}>
        <Col
          span={24}
          style={{ height: isExpand ? '600px' : '300px' }}
          id="monaco-editor-container"
          className={fullScreen ? styles.editorFullScreen : styles.editorNormal}
        >
          <MonacoEditor
            width={'inherit'}
            height={isExpand ? '600px' : '300px'}
            language="sql"
            ref={editorRef}
            value={props.editorQuery}
            onChange={handleEditorChange}
          />
        </Col>
        <Col span={24}>
          <Row gutter={8} className={styles.editorButton}>
            {/* Expand Button */}
            <Col>
              <Button
                type="primary"
                onClick={() => {
                  setIsExpand(!isExpand);
                }}
                icon={<ExpandOutlined />}
              >
                {isExpand ? 'Collapse' : 'Expand'}
              </Button>
            </Col>

            {/* Run Button */}
            <Col>
              <Button
                type="primary"
                icon={<CodeOutlined />}
                loading={runLoading}
                onClick={handleRunClick}
              >
                Run
              </Button>
            </Col>

            {/* Full Scree Button */}
            <Col>
              <Button type="primary" icon={<FullscreenOutlined />} onClick={handleFullScreenToggle}>
                Full Screen
              </Button>
            </Col>

            {/* Save Button */}
            <Col>
              {queryData && props.editable && (
                <Button
                  type="primary"
                  icon={<SaveOutlined />}
                  onClick={() => {
                    setSaveModalOpen(true);
                  }}
                >
                  Save
                </Button>
              )}
            </Col>
          </Row>
        </Col>
      </Row>

      <Row gutter={24}>
        <Col span={24}>
          <Spin tip="Loading" spinning={runLoading}>
            {queryData ? (
              <QueryVisualization
                queryData={queryData}
                runLoading={runLoading}
                chartMgr={chartMgr}
                // tabProps={tabProps}
                // setTabProps={setTabProps}
              />
            ) : null}
          </Spin>
        </Col>
      </Row>

      <SaveModal
        {...{
          queryNormalState: queryNormal,
          setQueryNormalState: setQueryNormal,
          saveModalOpen: saveModalOpen,
          handleOk: async () => {
            await handleQuerySave();
            setSaveModalOpen(false);
          },
          handleCancel: () => {
            setSaveModalOpen(false);
          },
        }}
      />
    </>
  );
};

export default QueryEditor;
