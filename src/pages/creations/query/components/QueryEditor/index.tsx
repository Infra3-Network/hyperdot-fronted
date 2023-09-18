import MonacoEditor from 'react-monaco-editor';
import {
  BarChartOutlined,
  CloseOutlined,
  CodeOutlined,
  ExpandOutlined,
  EyeFilled,
  EyeInvisibleFilled,
  EyeInvisibleTwoTone,
  EyeTwoTone,
  FullscreenOutlined,
  SaveOutlined,
} from '@ant-design/icons';
import { Tabs, Row, Col, Button, Modal, Input, Switch, message } from 'antd';
import React, { useEffect } from 'react';
import { charts, NewVisualizationTab } from './charts';
import { queryRun } from '@/services/hyperdot/query';
import styles from './index.less';
import { TabManager } from './tabmanager';

interface QueryVisualizationProps {
  queryData: any;
  runLoading: boolean;
  tabProps: QE.TabArray;
  setTabProps: any;
  editorSave: any;
  setEditorSave: any;
}

const QueryVisualization = (props: QueryVisualizationProps) => {
  const [tabActiveKey, setTabActiveKey] = React.useState<string>('1');

  useEffect(() => {
    props.setTabProps((prev: QE.TabArray) => {
      if (TabManager.findByName(prev, 'New Visualization')) {
        return prev;
      }

      return TabManager.add(prev, {
        name: 'New Visualization',
        children: 'new',
        closeable: false,
      });

      // const foundNew: boolean = prev.find((v: any, i: number) => v.name === 'New Visualization');
      // if (foundNew) {
      //   return prev;
      // }

      // prev.push({
      //   name: 'New Visualization',
      //   icon: <BarChartOutlined />,
      //   children: (
      //     <NewVisualizationTab
      //       tabProps={props.tabProps}
      //       setTabProps={props.setTabProps}
      //       setTabActiveKey={setTabActiveKey}
      //       queryData={props.queryData}
      //     />
      //   ),
      // });
      // return prev;
    });
  }, []);

  const handleCloseClick = (id: number) => {
    props.setTabProps(TabManager.remove(props.tabProps, id));
    setTabActiveKey(tabActiveKey);
  };

  if (props.runLoading) {
    return <div>Loading...</div>;
  }

  if (!props.queryData) {
    return null;
  }

  return (
    <div>
      <Tabs
        type="primary"
        activeKey={tabActiveKey}
        onChange={(activeKey: string) => {
          setTabActiveKey(activeKey);
        }}
        items={props.tabProps.tabs.map((v: QE.TabProps) => {
          let children, icon;
          if (v.name === 'new') {
            children = (qprops: QE.ChartTabProps) => {
              const newProps = {
                ...qprops,
                charts: charts,
              };
              return <NewVisualizationTab {...newProps} />;
            };
            icon = <BarChartOutlined />;
          } else {
            const chart = charts.get(v.children);
            icon = chart?.icon;
            children = chart?.children;
          }
          return v.id == undefined
            ? null
            : {
                label: (
                  <div>
                    <span>
                      {icon}
                      {v.name}
                    </span>
                    {v.closeable ? (
                      <span style={{ marginLeft: '12px' }}>
                        <CloseOutlined
                          onClick={() => {
                            handleCloseClick(v.id || 0);
                          }}
                        />
                      </span>
                    ) : null}
                  </div>
                ),
                key: v.id?.toString(),
                children: children({
                  id: v.id,
                  queryData: props.queryData,
                  setEditorSave: props.setEditorSave,
                  tabProps: props.tabProps,
                  setTabProps: props.setTabProps,
                  setTabActiveKey: setTabActiveKey,
                }),
                style: {},
                closable: v.closeable,
                forceRender: false,
              };
        })}
      />
    </div>
  );
};

interface SaveModalProps {
  saveModalOpen: boolean;
  handleOk: any;
  handleCancel: any;
}
const SaveModal = (props: SaveModalProps) => {
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
            <Input addonBefore="Name" defaultValue="myquery" />
          </Col>
          <Col span={24}>
            <span style={{ marginRight: '12px' }}>Make privacy</span>
            <Switch checkedChildren={<EyeInvisibleFilled />} unCheckedChildren={<EyeFilled />} />
          </Col>
        </Row>
      </Modal>
    </>
  );
};

const QueryEditor = () => {
  // state for save editor
  const [editorSave, setEditorSave] = React.useState<QE.EditorSaveParams>();

  // state for save modal control
  const [saveModalOpen, setSaveModalOpen] = React.useState<boolean>(false);

  const [tabProps, setTabProps] = React.useState<QE.TabArray>({ id: 0, tabs: [] });
  const [query, setQuery] = React.useState('');
  const [runLoading, setRunLoading] = React.useState<boolean>(false);
  const [queryData, setQueryData] = React.useState<any>(null);
  const [messageApi, contextHolder] = message.useMessage();

  const handleEditorChange = (value: any, event: any) => {
    setQuery(value);
  };

  const handleEditorSave = () => {
    setSaveModalOpen(true);
    const tabs = tabProps.tabs
      .filter((v) => v.children != 'new')
      .map((v) => {
        if (v.config) {
          delete v.config.data;
        }
        return v;
      });
    const params: QE.EditorSaveParams = {
      query,
      queryEngine: 'bigquery',
      charts: tabs,
    };
    console.log(JSON.stringify(params));
  };

  const handleRunClick = () => {
    if (!query) {
      messageApi.warning('Please input query');
      return;
    }

    setRunLoading(true);
    queryRun(
      {
        engine: 'bigquery',
        query: query,
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
        setTabProps((prev: QE.TabArray) => {
          const prevQueryResult = TabManager.findByName(prev, 'Query Result');
          let newPrev = prev;
          if (prevQueryResult) {
            newPrev = TabManager.remove(newPrev, prevQueryResult.id);
          }

          return TabManager.insertLastBefore(newPrev, {
            name: 'Query Result',
            children: 'data_table',
            closeable: true,
          });
          // const insertAfterIndex = prev.length - 1 < 0 ? 0 : prev.length - 1; // 将新元素插入在最后一个元素后面

          // // 创建一个新的数组，将新元素插入到指定位置
          // const newArray = [...prev];
          // newArray.splice(insertAfterIndex, 0, {
          //   name: 'Query Result',

          //   icon: <TableOutlined />,
          //   children: <QueryResultTableTab queryData={res.data} />,
          // });

          // return newArray;
        });
        setQueryData(res.data);
      })
      .catch((err) => {
        messageApi.error(err.message);
      })
      .finally(() => {
        setRunLoading(false);
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
              language="mysql"
              theme="vs-dark"
              value={query}
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
                <Button type="primary" icon={<SaveOutlined />} onClick={handleEditorSave}>
                  Save
                </Button>
              </Col>
            </Row>
          </div>
        </Col>
      </Row>
      <Row gutter={24}>
        <Col span={24}>
          {queryData ? (
            <QueryVisualization
              queryData={queryData}
              runLoading={runLoading}
              tabProps={tabProps}
              setTabProps={setTabProps}
              editorSave={editorSave}
              setEditorSave={setEditorSave}
            />
          ) : null}
        </Col>
      </Row>

      <SaveModal
        {...{
          saveModalOpen: saveModalOpen,
          handleOk: () => {
            alert('save');
            setSaveModalOpen(false);
          },
          handleCancel: () => {
            alert('cancel');
            setSaveModalOpen(false);
          },
        }}
      />
    </>
  );
};

export default QueryEditor;
