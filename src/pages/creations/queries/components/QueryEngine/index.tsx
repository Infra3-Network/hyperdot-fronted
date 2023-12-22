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

/**
 * Generate a BigQuery table name based on relay and table names.
 * @function
 * @param {string} relay - Name of the relay.
 * @param {string} table - Name of the table.
 * @returns {string} - BigQuery table name.
 */
const toTableName = (relay: string, table: string) => {
  return 'bigquery-public-data.crypto_' + relay + '.' + table;
};

/**
 * TooltipText functional component that displays the full title or a truncated version with a tooltip.
 * @function
 * @param {Object} props - Props containing the title, length, and tooltip placement.
 * @param {string} props.title - The full title.
 * @param {number} props.len - The maximum length of the title to display without truncation.
 * @param {TooltipPlacement | undefined} props.placement - The placement of the tooltip.
 * @returns {JSX.Element} - JSX element representing the TooltipText component.
 */
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

/**
 * ChainTableScheme functional component that displays information about a chain table.
 * @function
 * @param {Object} props - Props containing chainID, chainTable, dataset, and handleArrowClick.
 * @param {number} props.chainID - The ID of the chain.
 * @param {string} props.chainTable - The name of the chain table.
 * @param {HYPERDOT_API.QueryEngineDataset} props.dataset - The dataset associated with the chain table.
 * @param {function} props.handleArrowClick - Function to handle arrow click events.
 * @returns {JSX.Element} - JSX element representing the ChainTableScheme component.
 */
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

/**
 * RelayChains functional component that displays relay chain information.
 * @function
 * @param {Object} props - Props containing relayChain, chains, and setChain.
 * @param {any} props.relayChain - The selected relay chain.
 * @param {Map<string, any>} props.chains - Map of relay chains.
 * @param {React.Dispatch<React.SetStateAction<any | undefined>>} props.setChain - Function to set the selected chain.
 * @returns {JSX.Element} - JSX element representing the RelayChains component.
 */
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

/**
 * PreviewDataTable functional component that displays preview data for a specific relay and table.
 * @function
 * @param {Object} props - Props containing previewData.
 * @param {Object} props.previewData - Object containing relay, table, and data for preview.
 * @param {string} props.previewData.relay - The relay for which data is previewed.
 * @param {string} props.previewData.table - The table for which data is previewed.
 * @param {HYPERDOT_API.RunQueryData | undefined} props.previewData.data - Preview data for the relay and table.
 * @returns {JSX.Element} - JSX element representing the PreviewDataTable component.
 */
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

/**
 * ChainModal functional component representing a modal for selecting a chain.
 * @function
 * @param {Object} props - Props containing information for the ChainModal.
 * @param {HYPERDOT_API.QueryEngineDataset} props.dataset - Query engine dataset.
 * @param {boolean} props.isModalOpen - State indicating whether the modal is open.
 * @param {React.Dispatch<React.SetStateAction<boolean>>} props.setIsModalOpen - Function to set the modal open state.
 * @param {React.Dispatch<React.SetStateAction<any | undefined>>} props.setChain - Function to set the selected chain.
 * @returns {JSX.Element} - JSX element representing the ChainModal component.
 */
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

/**
 * ChainItemProps type representing props for the ChainItem component.
 * @typedef {Object} ChainItemProps
 * @property {string} chainID - The ID of the chain.
 * @property {HYPERDOT_API.QueryEngineDataset} dataset - Query engine dataset.
 * @property {(chainID: number, chainName: string, chainTable: string) => void} handleChainTableClick - Function to handle the click event on a chain table.
 * @property {(value: string) => void} handleArrowClick - Function to handle the click event on the arrow.
 * @property {(e: React.MouseEvent, relayChain: string, table: string) => void} handleShowDataMouseEnter - Function to handle the mouse enter event on the show data link.
 */
type ChainItemProps = {
  chainID: string;
  dataset: HYPERDOT_API.QueryEngineDataset;
  handleChainTableClick: (chainID: number, chainName: string, chainTable: string) => void;
  handleArrowClick: (value: string) => void;
  handleShowDataMouseEnter: (e: React.MouseEvent, relayChain: string, table: string) => void;
};

/**
 * ChainItem functional component representing a chain item.
 * @function
 * @param {ChainItemProps} props - Props for the ChainItem component.
 * @returns {JSX.Element} - JSX element representing the ChainItem.
 */
const ChainItem = (props: ChainItemProps): JSX.Element => {
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

/**
 * ChainItems functional component representing a list of chain items.
 * @function
 * @param {Object} props - Props for the ChainItems component.
 * @param {HYPERDOT_API.QueryEngineDataset} props.dataset - The query engine dataset.
 * @param {any | undefined} props.chain - The chain data or undefined.
 * @param {(chainID: number, chainName: string, chainTable: string) => void} props.handleChainTableClick - Function to handle chain table click.
 * @param {(value: string) => void} props.handleArrowClick - Function to handle arrow click.
 * @param {(e: React.MouseEvent, relayChain: string, table: string) => void} props.handleShowDataMouseEnter - Function to handle show data mouse enter.
 * @returns {JSX.Element} - JSX element representing the ChainItems.
 */
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

/**
 * Props interface for the QueryEditor component.
 * @interface
 * @property {string} editorQuery - The query string for the editor.
 * @property {React.Dispatch<React.SetStateAction<string>>} setEditorQuery - Function to set the query string.
 */
type Props = {
  editorQuery: string;
  setEditorQuery: React.Dispatch<React.SetStateAction<string>>;
};

/**
 * React functional component representing the QueryEngine.
 * @function
 * @param {Props} props - Props containing the editor query and setEditorQuery function.
 * @returns {JSX.Element} - JSX element representing the QueryEngine component.
 */
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
    <div id="query-engine-container">
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
