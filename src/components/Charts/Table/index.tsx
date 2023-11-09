import { Card, Empty, Table, Row, Col, Input } from 'antd';
import React, { useEffect } from 'react';
import { ChartData, type ChartProps } from '../types';

type TableChartConfig = {
  data: ChartData;
};

export const TableChart = (config: TableChartConfig) => {
  if (!config.data) {
    return <Empty description={<span>No data</span>} />;
  }
  if (config.data.rows.length <= 0) {
    return <Empty description={<span>No data</span>} />;
  }

  const columns = config.data.schemas.map((schema) => {
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
        dataSource={config.data.rows}
        size={'small'}
        scroll={{ x: 1500, y: 500 }}
      />
    </>
  );
};

type Props = {
  type: string;
  props: ChartProps;
  index: number;
};

export const TableChartTemplate = (props: Props) => {
  const config = props.props.params.config as TableChartConfig;
  const params = props.props.params;
  const manager = props.props.manager;
  const [tableConfig, setTableConfig] = React.useState<TableChartConfig>({
    data: props.props.data,
  });

  if (!config) {
    manager.update(
      {
        ...params,
        config: tableConfig,
      },
      props.index,
    );
  }

  useEffect(() => {
    // update
    setTableConfig({
      data: props.props.data,
    });
  }, [props.props.data]);

  return (
    <Row gutter={[0, 24]}>
      <Col span={24}>
        <Card>
          <TableChart {...tableConfig} />
        </Card>
      </Col>
      <Col span={24}>
        <Card>
          <Row gutter={12}>
            <Col span={8}>
              {/* Chart options */}
              <Card type="inner" title={'Table options'}>
                <Row gutter={[0, 12]} style={{ margin: '0' }}>
                  <Col span={24}>
                    <Row gutter={[0, 16]}>
                      <Col span={6}>
                        <div>Title</div>
                      </Col>
                      <Col span={16}>
                        <Input
                          defaultValue={params.name}
                          bordered={true}
                          onChange={(e) => {
                            manager.update(
                              {
                                ...params,
                                name: e.target.value,
                              },
                              props.index,
                            );
                          }}
                        />
                      </Col>
                    </Row>
                  </Col>
                </Row>
              </Card>
            </Col>
          </Row>
        </Card>
      </Col>
    </Row>
  );
};
