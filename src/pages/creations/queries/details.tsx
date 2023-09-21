import { getUserQuery } from '@/services/hyperdot/api';
import { Row, Col, message } from 'antd';
import React, { useState } from 'react';
import { history, useParams } from 'umi';
import QueryEditor from './components/QueryEditor';

export const CreationQueryDetail = () => {
  let { id } = useParams<any>();
  id = Number(id);
  const [userQuery, setUserQuery] = useState<HYPERDOT_API.UserQuery>();

  React.useEffect(() => {
    if (!id) {
      history.push('/exception/403');
      return;
    }

    getUserQuery(id, {
      errorHandler: () => {
        history.push('/exception/404');
      },
    })
      .then((res) => {
        const data = res.data;
        if (data == undefined) {
          history.push('/exception/404');
          return;
        }
        console.log(res.data);
        setUserQuery(res.data);
      })
      .catch((err) => {
        message.error(err);
      });
  }, []);

  if (!id) {
    history.push('/exception/403');
    return null;
  }

  return (
    <>
      <Row>
        <Col span={24}>{userQuery ? <QueryEditor userQuery={userQuery} /> : null}</Col>
      </Row>
    </>
  );
};

export default CreationQueryDetail;
