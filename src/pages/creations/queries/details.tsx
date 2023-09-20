import { getUserQuery } from '@/services/hyperdot/api';
import { Row, Col, message } from 'antd';
import React from 'react';
import { history, Router, useParams } from 'umi';
import QueryEditor from './components/QueryEditor';

export const CreationQueryDetail = () => {
  const { id } = useParams<any>();
  const idNum = Number(id);
  const [query, setQuery] = React.useState<HYPERDOT_API.UserQuery>();
  if (!idNum) {
    history.push('/exception/403');
    return null;
  }

  return (
    <>
      <Row>
        <Col span={24}>
          <QueryEditor id={idNum} />
        </Col>
      </Row>
    </>
  );
};

export default CreationQueryDetail;
