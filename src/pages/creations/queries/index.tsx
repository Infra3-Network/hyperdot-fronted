import { Card, Col, message, Row } from 'antd';
import { GridContent } from '@ant-design/pro-layout';
import QueryEngine from './components/QueryEngine';
import QueryEditor from './components/QueryEditor';
import React from 'react';
import { getInitialState } from '@/app';
import { history } from 'umi';

export const CreationQuery = () => {
  const [user, setUser] = React.useState<HYPERDOT_API.CurrentUser>();

  React.useEffect(() => {
    getInitialState()
      .then(({ currentUser }) => {
        if (!currentUser || !currentUser.id) {
          // redirect login
          history.push('/user/login');
          return;
        }
        setUser(currentUser);
      })
      .catch((err) => {
        message.error(err, 3);
      });
  }, []);

  return (
    <GridContent>
      <>
        <Row gutter={24}>
          <Col span={6} style={{ marginBottom: 24 }}>
            <Card>
              <QueryEngine />
            </Card>
          </Col>

          <Col span={17} style={{ marginBottom: 24 }}>
            {user && <QueryEditor user={user} editable={true} />}
          </Col>
        </Row>
      </>
    </GridContent>
  );
};

export default CreationQuery;
