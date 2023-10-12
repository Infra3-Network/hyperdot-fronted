import { getInitialState } from '@/app';
import { getQuery, getUser } from '@/services/hyperdot/api';
import { LoadingTip } from '@/utils';
import { GridContent } from '@ant-design/pro-layout';
import { Row, Col, message, Spin } from 'antd';
import React from 'react';
import { history, useParams } from 'umi';
import QueryEditor from './components/QueryEditor';

export const CreationQueryDetail = () => {
  let { id } = useParams<any>();
  id = Number(id);
  const [editable, setEditable] = React.useState<boolean | undefined>(undefined);
  const [user, setUser] = React.useState<HYPERDOT_API.CurrentUser>();
  const [userQuery, setUserQuery] = React.useState<HYPERDOT_API.UserQuery>();
  const [loding, setLoading] = React.useState<boolean>(false);

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

            getUser(res.data.user_id)
              .then((userRes) => {
                if (!userRes.success) {
                  message.error(res.errorMessage, 3);
                  return;
                }
                setUserQuery(res.data);
                setUser(userRes.data);
                setEditable(false);
                console.log(userQuery, editable, user);
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
    <GridContent>
      <Row>
        <Spin tip={LoadingTip} spinning={loding}>
          <Col span={24}>
            {userQuery && editable != undefined && user && (
              <QueryEditor userQuery={userQuery} user={user} editable={editable} />
            )}
          </Col>
        </Spin>
      </Row>
    </GridContent>
  );
};

export default CreationQueryDetail;
