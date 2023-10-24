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
  Divider,
  Tag,
  Skeleton,
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
import { getSystemQueryEngineDataset, listSystemQueryEngines } from '@/services/hyperdot/api';
import { type TooltipPlacement } from 'antd/es/tooltip';

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
}: {
  chainID: number;
  chainTable: string;
  dataset: HYPERDOT_API.QueryEngineDataset;
}) => {
  const table = dataset.chainTables[chainID].find((v: any) => v.table_id === chainTable);
  console.log(table);
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
            <ArrowRightOutlined />
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
};

const ChainItem = (props: ChainItemProps) => {
  const chianID = props.chainID;
  const chain = props.dataset.chains[chianID];
  const chainTables = props.dataset.chainTables[chianID];

  return (
    <>
      {chain &&
        chainTables &&
        chainTables.map((chainTable: any, index: number) => (
          <Row key={index} justify={'space-between'}>
            <Col span={18}>
              <Row justify={'space-between'} className={styles.rawChainContainer}>
                <Col span={16}>
                  <Space
                    size={'small'}
                    className={styles.chainName}
                    onClick={() =>
                      props.handleChainTableClick(
                        chain.chainID,
                        chain.chainName,
                        chainTable.table_id,
                      )
                    }
                  >
                    <TableOutlined />
                    <TooltipText title={chain.chainName} len={10} placement={'topRight'} />
                    <TooltipText
                      title={(chainTable.table_id as string).replace(chianID, '')}
                      len={10}
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
                <EyeOutlined />
                <SearchOutlined />
                <ArrowRightOutlined />
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
}: {
  dataset: HYPERDOT_API.QueryEngineDataset;
  chain: any | undefined;
  handleChainTableClick: (chainID: number, chainName: string, chainTable: string) => void;
}) => {
  return (
    <div style={{ overflow: 'auto', maxHeight: '600px' }}>
      {chain ? (
        <ChainItem
          key={chain.chainID}
          chainID={chain.chainID}
          dataset={dataset}
          handleChainTableClick={handleChainTableClick}
        />
      ) : (
        Object.keys(dataset.chains).map((k) => {
          return (
            <ChainItem
              key={k}
              chainID={k}
              dataset={dataset}
              handleChainTableClick={handleChainTableClick}
            />
          );
        })
      )}
    </div>
  );
};

const QueryEngine = () => {
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
    </div>
  );
};

export default QueryEngine;
