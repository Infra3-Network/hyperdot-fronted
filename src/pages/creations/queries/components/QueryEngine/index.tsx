import { Select, Alert, List, message, Row, Col, Space } from 'antd';

import {
  AppstoreOutlined,
  ArrowRightOutlined,
  EyeOutlined,
  SearchOutlined,
  TableOutlined,
} from '@ant-design/icons';

import styles from './index.less';
import React from 'react';
import { getSystemQueryEngineDataset, listSystemQueryEngines } from '@/services/hyperdot/api';

const data = [
  {
    title: 'Ant Design Title 1',
  },
  {
    title: 'Ant Design Title 2',
  },
  {
    title: 'Ant Design Title 3',
  },
  {
    title: 'Ant Design Title 4',
  },
];

const ChainItem = (chain: any) => {
  return (
    <>
      <Row justify={'space-between'}>
        <Col span={16}>
          <Row justify={'space-between'}>
            <Col>
              <TableOutlined />
              <div className={styles.chainName}>
                <span>{chain.chainName}</span>
                <span>blocks</span>
              </div>
            </Col>

            <Col>
              <TableOutlined />
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
    </>
  );
};

const ChanItems = (dataset: HYPERDOT_API.QueryEngineDataset) => {
  console.log(dataset.chains);
  return (
    <div style={{ overflow: 'auto', maxHeight: '600px' }}>
      {Object.keys(dataset.chains).map((k) => {
        return ChainItem(dataset.chains[k]);
      })}
    </div>
  );
};

const QueryEngine = () => {
  const [queryEngines, setQueryEngines] = React.useState<HYPERDOT_API.QueryEngine[]>([]);
  const [selectQueryEngine, setSelectQueryEngine] = React.useState<string>('');
  const [dataset, setDataset] = React.useState<HYPERDOT_API.QueryEngineDataset | undefined>(
    undefined,
  );
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

        {dataset && ChanItems(dataset)}
      </Space>
    </div>
  );
};

export default QueryEngine;
