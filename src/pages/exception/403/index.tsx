import { Link } from 'umi';
import { Result, Button } from 'antd';

/**
 * React functional component representing a 403 Forbidden result page.
 * @function
 * @returns {JSX.Element} - JSX element representing the 403 Forbidden result page.
 */
export default () => (
  <Result
    status="403"
    title="403"
    style={{
      background: 'none',
    }}
    subTitle="Sorry, you don't have access to this page."
    extra={
      <Link to="/">
        <Button type="primary">Back to home</Button>
      </Link>
    }
  />
);
