import {
  Select,
  Alert,
  message,
  Row,
  Col,
  Space,
  Tooltip,
  Modal,
  Button,
  Tag,
  Skeleton,
  Empty,
  Table,
  Spin,
  Card,
} from 'antd';

import {
  ArrowLeftOutlined,
  ArrowRightOutlined,
  EyeOutlined,
  SearchOutlined,
  TableOutlined,
} from '@ant-design/icons';

import styles from './index.less';
import React from 'react';
import {
  getSystemQueryEngineDataset,
  listSystemQueryEngines,
  queryRun,
} from '@/services/hyperdot/api';
import { type TooltipPlacement } from 'antd/es/tooltip';

const toTableName = (relay: string, table: string) => {
  return 'bigquery-public-data.crypto_' + relay + '.' + table;
};

const TooltipText = ({
  title,
  len,
  placement,
}: {
  title: string;
  len: number;
  placement: TooltipPlacement | undefined;
}) => {
  if (title.length < len) {
    return <span>{title}</span>;
  }

  return (
    <Tooltip placement={placement} title={title}>
      <span>{title.substring(0, len)}...</span>
    </Tooltip>
  );
};

const ChainTableScheme = ({
  chainID,
  chainTable,
  dataset,
  handleArrowClick,
}: {
  chainID: number;
  chainTable: string;
  dataset: HYPERDOT_API.QueryEngineDataset;
  handleArrowClick: (value: string) => void;
}) => {
  const table = dataset.chainTables[chainID].find((v: any) => v.table_id === chainTable);
  return (
    <>
      <Row justify={'space-between'}>
        <Col span={18}>
          <Row justify={'space-between'} className={styles.rawChainContainer}>
            <Col span={16}>
              <Space size={'small'} className={styles.chainName}>
                <TableOutlined />
                <TooltipText
                  title={chainTable.replace(String(chainID), '')}
                  len={40}
                  placement={'topRight'}
                />
              </Space>
            </Col>

            <Col span={3}>
              <img width={16} src={''} />
            </Col>
          </Row>
        </Col>

        <Col>
          <Space>
            <EyeOutlined />
            <SearchOutlined />
            <ArrowRightOutlined
              onClick={() => {
                handleArrowClick(toTableName(table.relayChain, table.table_id));
              }}
            />
          </Space>
        </Col>
      </Row>

      <ul className={styles.tableDetailColumns}>
        {table &&
          table.schemas &&
          table.schemas.map((schema: any) => (
            <li key={schema.name}>
              <Row justify={'space-between'} gutter={[12, 12]}>
                <Col>
                  <span>{schema.name}</span>
                </Col>

                <Col>
                  <Tag>{schema.type}</Tag>
                </Col>
              </Row>
            </li>
          ))}
      </ul>
    </>
  );
};

const RelayChains = ({
  relayChain,
  chains,
  setChain,
}: {
  relayChain: any;
  chains: Map<string, any>;
  setChain: React.Dispatch<React.SetStateAction<any | undefined>>;
}) => (
  <>
    <Col span={24}>
      <h3>{relayChain.name} & Parachains</h3>
    </Col>
    {relayChain.paraChainIDs.map((chainID: string) => (
      <>
        {chains[chainID] && (
          <Col span={6}>
            <Space
              onClick={() => {
                setChain(chains[chainID]);
              }}
              direction={'vertical'}
              size={'small'}
              align={'center'}
              className={styles.modalChainContainer}
            >
              <img width={24} src={chains[chainID].iconUrl} />
              <TooltipText title={chains[chainID].chainName} len={15} placement={'bottomRight'} />
            </Space>
          </Col>
        )}
      </>
    ))}
  </>
);

const PreviewDataTable = ({
  previewData,
}: {
  previewData: {
    relay: string;
    table: string;
    data: HYPERDOT_API.RunQueryData | undefined;
  };
}) => {
  if (!previewData.data) {
    return <Empty description={<span>No data</span>} />;
  }
  if (previewData.data.rows.length <= 0) {
    return <Empty description={<span>No data</span>} />;
  }

  const columns = previewData.data.schemas.map((schema) => {
    return {
      title: schema.name,
      dataIndex: schema.name,
      key: schema.name,
      filterSearch: true,
    };
  });

  return (
    <>
      <Table
        bordered={true}
        columns={columns}
        dataSource={previewData.data.rows}
        size={'small'}
        scroll={{ x: 1500, y: 500 }}
      />
    </>
  );
};

const ChainModal = ({
  dataset,
  isModalOpen,
  setIsModalOpen,
  setChain,
}: {
  dataset: HYPERDOT_API.QueryEngineDataset;
  isModalOpen: boolean;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setChain: React.Dispatch<React.SetStateAction<any | undefined>>;
}) => {
  const relayChains = dataset.relayChains;
  const chains = dataset.chains;

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };
  return (
    <>
      <Modal
        title={'Select Chain'}
        width={800}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Button
          size={'large'}
          type="primary"
          style={{ width: '100%' }}
          onClick={() => {
            setChain(undefined);
          }}
        >
          Select all chains
        </Button>
        <Row gutter={[14, 16]}>
          {Object.keys(relayChains).map((k) => (
            <RelayChains key={k} relayChain={relayChains[k]} chains={chains} setChain={setChain} />
          ))}
        </Row>
      </Modal>
    </>
  );
};

type ChainItemProps = {
  chainID: string;
  dataset: HYPERDOT_API.QueryEngineDataset;
  handleChainTableClick: (chainID: number, chainName: string, chainTable: string) => void;
  handleArrowClick: (value: string) => void;
  handleShowDataMouseEnter: (e: React.MouseEvent, relayChain: string, table: string) => void;
};

const ChainItem = (props: ChainItemProps) => {
  const chainID = props.chainID;
  const chain = props.dataset.chains[chainID];
  const chainTables = props.dataset.chainTables[chainID];

  return (
    <>
      {chain &&
        chainTables &&
        chainTables.map((chainTable: any, index: number) => (
          <Row key={index} justify={'space-between'}>
            <Col span={20}>
              <Row justify={'space-between'} className={styles.rawChainContainer}>
                <Col span={21}>
                  <Space
                    size={'small'}
                    className={styles.chainName}
                    onClick={() => {
                      props.handleChainTableClick(
                        chain.chainID,
                        chain.chainName,
                        chainTable.table_id,
                      );
                    }}
                  >
                    <TableOutlined />
                    <TooltipText title={chain.chainName} len={15} placement={'topRight'} />
                    <TooltipText
                      title={(chainTable.table_id as string)
                        .replace(
                          chain.relayChain === 'kusama' ? String(Number(chainID) - 20000) : chainID,
                          '',
                        )
                        .trim()}
                      len={15}
                      placement={'topRight'}
                    />
                  </Space>
                </Col>

                <Col span={3}>
                  <img width={16} src={chain.iconUrl} />
                </Col>
              </Row>
            </Col>

            <Col>
              <Space>
                <EyeOutlined
                  onMouseEnter={(event: React.MouseEvent) => {
                    props.handleShowDataMouseEnter(event, chain.relayChain, chainTable.table_id);
                  }}
                />
                <SearchOutlined />
                <ArrowRightOutlined
                  onClick={() => {
                    props.handleArrowClick(toTableName(chain.relayChain, chainTable.table_id));
                  }}
                />
              </Space>
            </Col>
          </Row>
        ))}
    </>
  );
};

const ChainItems = ({
  dataset,
  chain,
  handleChainTableClick,
  handleArrowClick,
  handleShowDataMouseEnter,
}: {
  dataset: HYPERDOT_API.QueryEngineDataset;
  chain: any | undefined;
  handleChainTableClick: (chainID: number, chainName: string, chainTable: string) => void;
  handleArrowClick: (value: string) => void;
  handleShowDataMouseEnter: (e: React.MouseEvent, relayChain: string, table: string) => void;
}) => {
  return (
    <div style={{ overflow: 'auto', maxHeight: '600px' }}>
      {chain ? (
        <ChainItem
          key={chain.chainID}
          chainID={chain.chainID}
          dataset={dataset}
          handleChainTableClick={handleChainTableClick}
          handleArrowClick={handleArrowClick}
          handleShowDataMouseEnter={handleShowDataMouseEnter}
        />
      ) : (
        Object.keys(dataset.chains).map((k) => {
          return (
            <ChainItem
              key={k}
              chainID={k}
              dataset={dataset}
              handleChainTableClick={handleChainTableClick}
              handleArrowClick={handleArrowClick}
              handleShowDataMouseEnter={handleShowDataMouseEnter}
            />
          );
        })
      )}
    </div>
  );
};

type Props = {
  editorQuery: string;
  setEditorQuery: React.Dispatch<React.SetStateAction<string>>;
};

const QueryEngine = (props: Props) => {
  const [queryEngines, setQueryEngines] = React.useState<HYPERDOT_API.QueryEngine[]>([]);
  const [selectQueryEngine, setSelectQueryEngine] = React.useState<string>('');
  const [dataset, setDataset] = React.useState<HYPERDOT_API.QueryEngineDataset | undefined>(
    undefined,
  );
  const [chain, setChain] = React.useState<any | undefined>(undefined);
  const [isModalOpen, setIsModalOpen] = React.useState<boolean>(false);
  const [chainTable, setChainTable] = React.useState<
    | {
        chainID: number;
        chainName: string;
        table: string;
      }
    | undefined
  >(undefined);

  const [loading, setLoading] = React.useState<boolean>(false);
  const [showPreviewData, setShowPreviewData] = React.useState<boolean>(false);
  const [previewDataDirection, setPreviewDataDirection] = React.useState<{
    top: number;
    right: number;
    left: number;
    bottom: number;
  }>({
    top: 0,
    right: 0,
    left: 0,
    bottom: 0,
  });
  const [previewData, setPreviewData] = React.useState<{
    relay: string;
    table: string;
    data: HYPERDOT_API.RunQueryData | undefined;
  }>({
    relay: '',
    table: '',
    data: undefined,
  });
  const [previewDataLoading, setPreviewDataLoading] = React.useState<boolean>(false);

  React.useEffect(() => {
    setLoading(true);
    listSystemQueryEngines()
      .then((res) => {
        if (!res.success) {
          message.error(res.errorMessage);
          return;
        }
        setQueryEngines(res.data);
      })
      .catch((err) => {
        message.error(err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const handleQueryEngineChange = (value: string) => {
    setSelectQueryEngine(value);
    getSystemQueryEngineDataset(value.toLocaleLowerCase())
      .then((res) => {
        if (!res.success) {
          message.error(res.errorMessage);
          return;
        }
        setDataset(res.data);
      })
      .catch((err) => {
        message.error(err);
      })
      .catch((err) => {
        message.error(err);
      });
  };

  const handleChainTableClick = (chainID: number, chainName: string, table: string) => {
    setChainTable({ chainID: chainID, chainName: chainName, table: table });
  };

  const handleArrowClick = (value: string) => {
    props.setEditorQuery((prev) => {
      return prev + ' ' + value + '\n';
    });
  };

  const handleShowDataMouseEnter = (e: React.MouseEvent, relayChain: string, table: string) => {
    const { top, right, left, bottom } = e.currentTarget.getBoundingClientRect();
    setPreviewDataDirection({ top: top, right: right, left: left, bottom: bottom });
    setShowPreviewData(true);

    const fromTable = toTableName(relayChain, table);
    const query = `SELECT * FROM ${fromTable} LIMIT 10`;
    const engine = selectQueryEngine.toLocaleLowerCase();
    if (previewData.relay === relayChain && previewData.table === table) {
      return;
    }

    setPreviewDataLoading(true);

    // TODO: cache using map
    queryRun({
      query: query,
      engine: engine,
    })
      .then((queryRes) => {
        if (!queryRes.success) {
          message.error(queryRes.errorMessage);
          return;
        }

        setPreviewData({
          relay: relayChain,
          table: table,
          data: queryRes.data,
        });
      })
      .catch((err) => {
        message.error(err.message);
      })
      .finally(() => {
        setPreviewDataLoading(false);
      });
  };

  const handleShowDataMouseLeave = (e: React.MouseEvent) => {
    setShowPreviewData(false);
    setPreviewData({
      relay: '',
      table: '',
      data: undefined,
    });
  };

  return (
    <div>
      <Select
        className={styles.engineSelect}
        showSearch
        value={selectQueryEngine}
        placeholder="Select a query engine"
        optionFilterProp="children"
        onChange={handleQueryEngineChange}
        options={queryEngines.map((v) => {
          return {
            label: v.name,
            value: v.name,
          };
        })}
      />

      <Space direction="vertical" size={'small'} style={{ display: 'flex' }}>
        <Alert
          className={styles.alert}
          message="Informational Notes"
          description="Selecting a supported Data Engine will show the chain supported by that Data Engine."
          type="info"
          showIcon
        />

        {dataset && !chainTable && (
          <>
            <Button
              className={styles.selectChainButton}
              onClick={() => {
                setIsModalOpen(true);
              }}
            >
              Select chains
            </Button>
          </>
        )}
        <Skeleton loading={loading} active>
          {dataset && !chainTable && (
            <ChainItems
              dataset={dataset}
              chain={chain}
              handleChainTableClick={handleChainTableClick}
              handleArrowClick={handleArrowClick}
              handleShowDataMouseEnter={handleShowDataMouseEnter}
            />
          )}
        </Skeleton>

        {dataset && chainTable && (
          <>
            <div
              className={styles.backChainContainer}
              onClick={() => {
                setChainTable(undefined);
              }}
            >
              <ArrowLeftOutlined />
              <span>
                <TooltipText
                  title={`${chainTable.chainName} ${chainTable.table}`}
                  len={30}
                  placement={'topRight'}
                />
              </span>
            </div>

            <ChainTableScheme
              chainID={chainTable.chainID}
              chainTable={chainTable.table}
              dataset={dataset}
              handleArrowClick={handleArrowClick}
            />
          </>
        )}
      </Space>
      {dataset && (
        <ChainModal
          dataset={dataset}
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
          setChain={setChain}
        />
      )}

      {showPreviewData && (
        <Card
          style={{
            position: 'absolute',
            top: previewDataDirection.top - 60,
            left: previewDataDirection.left - 10,
            padding: '16px',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
            zIndex: 999,
            minHeight: '300px',
            minWidth: '700px',
          }}
          onMouseLeave={handleShowDataMouseLeave}
        >
          <Spin spinning={previewDataLoading}>
            {previewData.data && <PreviewDataTable previewData={previewData} />}
          </Spin>
        </Card>
      )}
    </div>
  );
};

export default QueryEngine;
