import { getInitialState } from '@/app';
import { getDashboard, getQuery, getUser } from '@/services/hyperdot/api';
import { Row, Col, message } from 'antd';
import React, { useState } from 'react';
import { history, useParams } from 'umi';
import CreationDashboard from './components';

export const CreationQueryDetail = () => {
  let { id } = useParams<any>();
  id = Number(id);
  const [editable, setEditable] = useState<boolean | undefined>(undefined);
  const [dashboard, setDashboard] = useState<HYPERDOT_API.Dashboard>();
  const [user, setUser] = useState<HYPERDOT_API.CurrentUser>();

  React.useEffect(() => {
    if (!id) {
      history.push('/exception/403');
      return;
    }

    getDashboard(id, {
      errorHandler: () => {
        history.push('/exception/404');
      },
    })
      .then((res) => {
        if (!res.success) {
          message.error(res.errorMessage, 3);
          return;
        }

        setDashboard(res.data);

        getInitialState().then(({ currentUser }) => {
          if (!currentUser || !currentUser.id) {
            // redirect login
            history.push('/user/login');
            return;
          }
          if (!res.data.user_id) {
            message.error('dashboard has no user_id', 3);
            return;
          }

          if (currentUser.id == res.data.user_id) {
            setEditable(true);
            setUser(currentUser);
          } else {
            getUser(res.data.user_id)
              .then((userRes) => {
                if (!userRes.success) {
                  message.error(res.errorMessage, 3);
                  return;
                }
                setUser(userRes.data);
                setEditable(false);
              })
              .catch((err) => {
                message.error(err, 3);
              });
          }
        });
      })
      .catch((err) => {
        message.error(err, 3);
      });
  }, []);

  if (!id) {
    history.push('/exception/403');
    return null;
  }

  return (
    <>
      <Row>
        <Col span={24}>
          {dashboard && user && editable != undefined ? (
            <CreationDashboard dashboard={dashboard} editable={editable} user={user} />
          ) : null}
        </Col>
      </Row>
    </>
  );
};

export default CreationQueryDetail;
