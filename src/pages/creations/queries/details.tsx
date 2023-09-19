import { getUserQuery } from '@/services/hyperdot/api';
import { message } from 'antd';
import React from 'react';
import { history, Router, useParams } from 'umi';

export const CreationQueryDetail = () => {
  const { id } = useParams<any>();
  const idNum = Number(id);
  const [query, setQuery] = React.useState<HYPERDOT_API.UserQuery>();
  React.useEffect(() => {
    if (!idNum) {
      history.push('/exception/403');
      return;
    }
    getUserQuery(idNum, {
      errorHandler: () => {
        history.push('/exception/404');
      },
    })
      .then((res) => {
        setQuery(res.data);
      })
      .catch((err) => {
        message.error(err);
      });
  }, []);

  if (!idNum) {
    history.push('/exception/403');
    return null;
  }

  return <div>[id]</div>;
};

export default CreationQueryDetail;
