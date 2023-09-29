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
import React, { useEffect } from 'react';
// import { ChartNodeProps, charts } from './charts';
import styles from './index.less';
import { getInitialState } from '@/app';
import { useHistory } from 'umi';
import { queryRun, updateQuery, userCreateQuery } from '@/services/hyperdot/api';
import {
  ChartManager,
  type ChartArray,
  type ChartNodeProps,
  type ChartParams,
  type ChartProps,
} from '@/components/Charts/types';
// import { HYPERDOT_CHART } from '@/components/Charts/typings';
import { ChartNodeMap } from '@/components/Charts';

interface NewVisualizationTabProps {
  // tabProps: any;
  // setTabProps: any;
  setTabActiveKey: any;
  chartMgr: ChartManager;
  chartNodeMap: Map<string, ChartNodeProps>;
}

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
    // props.setTabProps((prev: QE.TabArray) => {
    //   return TabManager.insertLastBefore(prev, {
    //     name: chartProps.name,
    //     // icon: chartProps.icon,
    //     // children: chartProps.children,
    //     children: chart,
    //     closeable: true,
    //   });
    // });
    // const active: string = TabManager.getId(props.tabProps).toString();
    props.setTabActiveKey(props.chartMgr.getId().toString());
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
  // tabProps: QE.TabArray;
  // setTabProps: any;
  // setCharts: React.Dispatch<React.SetStateAction<ChartArray>>,
  chartMgr: ChartManager;
}

const QueryVisualization = (props: QueryVisualizationProps) => {
  const [tabActiveKey, setTabActiveKey] = React.useState<string>('1');

  const handleCloseClick = (id: number) => {
    props.chartMgr.remove(id);
    // props.setTabProps(TabManager.remove(props.tabProps, id));
    // setTabActiveKey(tabActiveKey);
  };

  if (!props.queryData) {
    return null;
  }
  const charts = props.chartMgr.getCharts();
  const items = charts.map((params: ChartParams) => {
    let children, icon;
    if (params.type === 'new') {
      children = (v: ChartProps) => {
        const newProps: NewVisualizationTabProps = {
          chartMgr: v.manager,
          chartNodeMap: ChartNodeMap,
          setTabActiveKey: setTabActiveKey,
        };
        return <NewVisualizationTab {...newProps} />;
      };
      icon = <BarChartOutlined />;
    } else {
      const chartNode = ChartNodeMap.get(params.type);
      if (chartNode == undefined) {
        return null;
      }
      icon = chartNode.icon;
      children = chartNode.children;
    }
    return params.id == undefined
      ? null
      : {
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
                      handleCloseClick(params.id || 0);
                    }}
                  />
                </span>
              ) : null}
            </div>
          ),
          key: params.id?.toString(),
          children: children({
            manager: props.chartMgr,
            params: params,
            data: props.queryData,
          }),
          style: {},
          closable: params.closeable,
          forceRender: false,
        };
  });

  return (
    <div>
      {items != null ? (
        <Tabs
          activeKey={tabActiveKey}
          onChange={(activeKey: string) => {
            setTabActiveKey(activeKey);
          }}
          items={items}
        />
      ) : null}
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
  query: string;
  name: string;
  privacy: boolean;
  engine: string;
}

interface Props {
  userQuery?: HYPERDOT_API.UserQuery;
}

const QueryEditor = (props: Props) => {
  console.log(props);
  // state for save modal control
  const [saveModalOpen, setSaveModalOpen] = React.useState<boolean>(false);

  // state for editor query save state
  const [queryNormal, setQueryNormal] = React.useState<QueryNormalState>({
    query: '',
    name: 'Unsaved',
    privacy: false,
    engine: 'bigquery', // TODO: from props
  });

  const [editorCharts, setEditorCharts] = React.useState<ChartArray>({
    id: 0,
    charts: [],
  });
  const chartMgr = new ChartManager(editorCharts, setEditorCharts);

  // const [tabProps, setTabProps] = React.useState<QE.TabArray>({ id: 0, tabs: [] });
  const [runLoading, setRunLoading] = React.useState<boolean>(false);
  const [queryData, setQueryData] = React.useState<any>(null);
  const [messageApi, contextHolder] = message.useMessage();
  const history = useHistory();

  const updateStateByUserQuery = (userQuery: HYPERDOT_API.UserQuery) => {
    setQueryNormal({
      query: userQuery.query,
      engine: userQuery.query_engine,
      privacy: userQuery.is_privacy ? userQuery.is_privacy : false,
      name: userQuery.name ? userQuery.name : 'Unsaved',
    });

    if (userQuery.unsaved ? userQuery.unsaved : false) {
      // if unsaved query, we create these tabs
      const charts: ChartParams[] = [
        {
          id: 1,
          name: 'Query Result',
          type: 'data_table',
          closeable: true,
        },
        {
          id: 0,
          name: 'New Visualization',
          type: 'new',
          closeable: false,
        },
      ];
      chartMgr.reset(charts);
    }

    if (userQuery.charts == undefined) {
      return;
    }
    const charts: ChartParams[] = [
      ...userQuery.charts,
      {
        id: 0,
        name: 'New Visualization',
        type: 'new',
        closeable: false,
      },
    ];

    chartMgr.reset(charts);
  };

  // If props.id is defined, then
  //  1. fetch saved query,
  //  2. run query to fetch queryData if queryData is null
  /// 3. set TabProps, queryNomal state
  useEffect(() => {
    console.log(ChartNodeMap);
    console.log(history.location, props.userQuery == undefined);
    if (props.userQuery != undefined) {
      const userQuery = props.userQuery;
      console.log(userQuery);
      setRunLoading(true);
      queryRun(userQuery.query, userQuery.query_engine, {
        errorHandler: (error: any) => {
          messageApi.error(error.message);
        },
      })
        .then((queryRes) => {
          if (!queryRes.success) {
            messageApi.error(queryRes.errorMessage);
            return;
          }

          console.log(queryRes.data);
          setQueryData(queryRes.data);
        })
        .catch((err) => {
          messageApi.error(err.message);
        })
        .finally(() => {
          setRunLoading(false);
        });
      updateStateByUserQuery(userQuery);
      // setQueryNormal({
      //   query: userQuery.query,
      //   engine: userQuery.queryEngine,
      //   privacy: userQuery.isPrivacy ? userQuery.isPrivacy : false,
      //   name: userQuery.name ? userQuery.name : 'Unsaved',
      // });

      // if (userQuery.unsaved ? userQuery.unsaved : false) {
      //   // if unsaved query, we create these tabs
      //   const tabs = [
      //     {
      //       id: 1,
      //       name: 'Query Result',
      //       children: 'data_table',
      //       closeable: true,
      //     },
      //     {
      //       id: 0,
      //       name: 'New Visualization',
      //       children: 'new',
      //       closeable: false,
      //     },
      //   ];
      //   setTabProps({
      //     id: 2,
      //     tabs,
      //   });
      // }

      // if (userQuery.charts == undefined) {
      //   return;
      // }
      // const tabs = [
      //   ...userQuery.charts,
      //   {
      //     id: 0,
      //     name: 'New Visualization',
      //     children: 'new',
      //     closeable: false,
      //   },
      // ];

      // const nextId = tabs.reduce((max, obj) => (obj.id ? (obj.id > max ? obj.id : max) : max), 1);
      // setTabProps({
      //   id: nextId,
      //   tabs,
      // });
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

  const handleEditorChange = (value: any) => {
    setQueryNormal((prev) => {
      return { ...prev, query: value };
    });
  };

  const handleQuerySave = async () => {
    setSaveModalOpen(true);
    const { currentUser } = (await getInitialState()) ?? {};
    if (!currentUser) {
      // TODO: this code block as method
      localStorage.removeItem('token');
      history.replace({
        pathname: '/user/login',
      });
      return;
    }

    if (!queryNormal.engine) {
      messageApi.error('query engine empty');
    }
    if (!queryNormal.query) {
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
        user_id: Number(currentUser.id),
        name: queryNormal.name,
        query: queryNormal.query,
        query_engine: queryNormal.engine,
        is_privacy: queryNormal.privacy,
        charts: charts,
      };
      console.log(body);
      const res = await updateQuery(body, {});
      if (res.success) {
        messageApi.info('save success');
        console.log(res.data);
        if (!res.data) {
          messageApi.error('Unkown error');
        }
        if (res.data) {
          updateStateByUserQuery(res.data);
        }
        return;
      }

      messageApi.error(res.errorMessage);
    } catch (err) {}
  };

  const handleRunClick = () => {
    if (!queryNormal.query) {
      messageApi.warning('Please input query');
      return;
    }

    if (!queryNormal.engine) {
      messageApi.warning('Please select query engine');
      return;
    }

    if (props.userQuery != undefined) {
      if (
        queryNormal.query == props.userQuery.query &&
        queryNormal.engine == props.userQuery.query_engine
      ) {
        // not change
        messageApi.info('Query not change');
        return;
      }
      // if exists userQuery, we only run new input query
      setRunLoading(true);
      queryRun(queryNormal.query, queryNormal.engine, {
        errorHandler: (error: any) => {
          messageApi.error(error.message);
        },
      })
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
    userCreateQuery(
      {
        query: queryNormal.query,
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

  return (
    <>
      {contextHolder}
      <Row gutter={24}>
        <Col span={24}>
          <div style={{ width: '100%' }}>
            <MonacoEditor
              width="100%"
              height={'400'}
              language="sql"
              theme="vs-dark"
              value={queryNormal.query}
              // options={options}
              onChange={handleEditorChange}
              // editorDidMount={::this.editorDidMount}
            />
            <Row gutter={8} className={styles.editorButton}>
              {/* Expand Button */}
              <Col>
                <Button type="primary" icon={<ExpandOutlined />}>
                  Expand
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
                <Button type="primary" icon={<FullscreenOutlined />}>
                  Full Screen
                </Button>
              </Col>

              {/* Save Button */}
              <Col>
                {queryData ? (
                  <Button
                    type="primary"
                    icon={<SaveOutlined />}
                    onClick={() => {
                      setSaveModalOpen(true);
                    }}
                  >
                    Save
                  </Button>
                ) : null}
              </Col>
            </Row>
          </div>
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
