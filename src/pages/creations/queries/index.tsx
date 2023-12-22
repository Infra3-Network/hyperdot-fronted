import { Card, Col, message, Row } from 'antd';
import { GridContent } from '@ant-design/pro-layout';
import QueryEngine from './components/QueryEngine';
import QueryEditor from './components/QueryEditor';
import React from 'react';
import { getInitialState } from '@/app';
import { history } from 'umi';

/**
 * Functional component representing the Creation Query page.
 */
const CreationQuery = () => {
  // State for the current user and the editor query
  const [user, setUser] = React.useState<HYPERDOT_API.CurrentUser>();
  const [editorQuery, setEditorQuery] = React.useState<string>('');

  // Fetches initial state data on component mount
  React.useEffect(() => {
    getInitialState()
      .then(({ currentUser }) => {
        if (!currentUser || !currentUser.id) {
          // Redirect to login page if no current user is available
          history.push('/user/login');
          return;
        }
        setUser(currentUser);
      })
      .catch((err) => {
        message.error(err, 3);
      });
  }, []);

  // Renders the Creation Query page content
  return (
    <GridContent>
      <>
        <Row gutter={24}>
          {/* Query Engine card for inputting queries */}
          <Col span={6} style={{ marginBottom: 24 }}>
            <Card>
              <QueryEngine editorQuery={editorQuery} setEditorQuery={setEditorQuery} />
            </Card>
          </Col>

          {/* Query Editor for displaying and editing queries */}
          <Col span={17} style={{ marginBottom: 24 }}>
            {user && (
              <QueryEditor
                user={user}
                editable={true}
                editorQuery={editorQuery}
                setEditorQuery={setEditorQuery}
              />
            )}
          </Col>
        </Row>
      </>
    </GridContent>
  );
};

export default CreationQuery;
