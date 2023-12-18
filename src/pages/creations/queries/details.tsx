import { getInitialState } from '@/app';
import UserAvatar from '@/components/UserAvatar';
import { getQuery, getUser } from '@/services/hyperdot/api';
import { LoadingTip } from '@/utils';
import { GridContent } from '@ant-design/pro-layout';
import { Row, Col, message, Spin, Card, Breadcrumb, Space } from 'antd';
import React from 'react';
import { history, Link, useParams } from 'umi';
import QueryEditor from './components/QueryEditor';
import QueryEngine from './components/QueryEngine';

export const CreationQueryDetail = () => {
  let { id } = useParams<any>();
  id = Number(id);
  const [editable, setEditable] = React.useState<boolean | undefined>(undefined);
  const [user, setUser] = React.useState<HYPERDOT_API.CurrentUser>();
  const [userQuery, setUserQuery] = React.useState<HYPERDOT_API.UserQuery>();
  const [loding, setLoading] = React.useState<boolean>(false);
  const [editorQuery, setEditorQuery] = React.useState<string>('');

  React.useEffect(() => {
    if (!id) {
      history.push('/exception/403');
      return;
    }

    setLoading(true);

    getQuery(id, {
      errorHandler: () => {
        history.push('/exception/404');
      },
    })
      .then((res) => {
        setUserQuery(res.data);
        if (!res.data.user_id) {
          message.error('query has no user_id', 3);
          return;
        }

        getInitialState()
          .then(({ currentUser }) => {
            if (!currentUser || !currentUser.id) {
              // redirect login
              history.push('/user/login');
              return;
            }

            if (currentUser.id == res.data.user_id) {
              setUserQuery(res.data);
              setUser(currentUser);
              setEditable(true);
              return;
            }

            if (!res.data.user_id) {
              message.error('query has no user_id', 3);
              return;
            }

            getUser(res.data.user_id)
              .then((userRes) => {
                if (!userRes.success) {
                  message.error(res.errorMessage, 3);
                  return;
                }
                setUserQuery(res.data);
                setUser(userRes.data);
                setEditable(false);
              })
              .catch((err) => {
                message.error(err, 3);
              });
          })
          .catch((err) => {
            message.error(err, 3);
          });
      })
      .catch((err) => {
        message.error(err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (!id) {
    history.push('/exception/403');
    return null;
  }

  return (
    <GridContent contentWidth={'Fluid'}>
      <Row gutter={[16, 24]}>
        {user && userQuery && (
          <Col span={24}>
            <Breadcrumb>
              <Breadcrumb.Item href="#">
                <Space>
                  <UserAvatar size={24} username={user.username} icon_url={user.icon_url} />
                  <span>
                    <Link
                      to={'/account/center/' + user.id}
                      style={{ textDecoration: 'none', color: 'inherit' }}
                    >
                      @{user.username}
                    </Link>
                  </span>
                </Space>
              </Breadcrumb.Item>
              <Breadcrumb.Item href="#">{userQuery.name}</Breadcrumb.Item>
            </Breadcrumb>
          </Col>
        )}

        <Col span={6} style={{ marginBottom: 24 }}>
          <Card>
            <QueryEngine editorQuery={editorQuery} setEditorQuery={setEditorQuery} />
          </Card>
        </Col>

        <Col span={17}>
          <Spin tip={LoadingTip} spinning={loding}>
            {userQuery && editable != undefined && user && (
              <QueryEditor
                userQuery={userQuery}
                user={user}
                editable={editable}
                editorQuery={editorQuery}
                setEditorQuery={setEditorQuery}
              />
            )}
          </Spin>
        </Col>
      </Row>
    </GridContent>
  );
};

export default CreationQueryDetail;
