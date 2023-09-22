import { Table } from 'antd';
import { type ChartProps } from '../types';

export const TableChart = (props: ChartProps) => {
  const params = props.params;
  const data = props.data;
  const columns = data.schemas.map((schema) => {
    return {
      title: schema.name,
      dataIndex: schema.name,
      key: schema.name,
    };
  });

  const dataSource = data.rows.map((row, i) => {
    return {
      key: i,
      ...data.rows[i],
    };
  });
  return <Table columns={columns} dataSource={dataSource} />;
};
