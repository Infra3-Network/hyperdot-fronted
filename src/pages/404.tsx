import { Button, Result } from 'antd';
import React from 'react';
import { history } from 'umi';

/**
 * Functional component representing the 404 Not Found page.
 * @function
 * @returns {JSX.Element} - JSX element representing the NoFoundPage component.
 */
const NoFoundPage: React.FC = (): JSX.Element => (
  <Result
    status="404"
    title="404"
    subTitle="Sorry, the page you visited does not exist."
    extra={
      <Button type="primary" onClick={() => history.push('/')}>
        Back Home
      </Button>
    }
  />
);

export default NoFoundPage;
