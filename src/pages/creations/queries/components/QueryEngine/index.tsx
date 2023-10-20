import { Select, Alert, message, Row, Col, Space, Tooltip, Modal, Button, Divider } from 'antd';

import {
  ArrowRightOutlined,
  EyeOutlined,
  SearchOutlined,
  TableOutlined,
  TabletFilled,
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

const ChainTableScheme = ({}: {}) => {
  return (
    <>
      <Row justify={'space-between'}>
        <Col span={18}>
          <Row justify={'space-between'} className={styles.rawChainContainer}>
            <Col span={16}>
              <Space size={'small'} className={styles.chainName}>
                <TabletFilled />
                <TooltipText title={'Test'} len={10} placement={'topRight'} />
                <TooltipText title={'Test'} len={10} placement={'topRight'} />
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
        <li>
          <Row justify={'space-between'} gutter={[0, 12]}>
            <Col>
              <span>amount_usd</span>
            </Col>

            <Col>
              <span>double</span>
            </Col>
          </Row>
        </li>

        <li>
          <Row justify={'space-between'} gutter={[0, 12]}>
            <Col>
              <span>amount_usd</span>
            </Col>

            <Col>
              <span>double</span>
            </Col>
          </Row>
        </li>
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
                  <Space size={'small'} className={styles.chainName}>
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
}: {
  dataset: HYPERDOT_API.QueryEngineDataset;
  chain: any | undefined;
}) => {
  return (
    <div style={{ overflow: 'auto', maxHeight: '600px' }}>
      {chain ? (
        <ChainItem key={chain.chainID} chainID={chain.chainID} dataset={dataset} />
      ) : (
        Object.keys(dataset.chains).map((k) => {
          return <ChainItem key={k} chainID={k} dataset={dataset} />;
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
  React.useEffect(() => {
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

        <Button
          className={styles.selectChainButton}
          onClick={() => {
            setIsModalOpen(true);
          }}
        >
          Select chains
        </Button>

        <ChainTableScheme />
        {dataset && <ChainItems dataset={dataset} chain={chain} />}
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
