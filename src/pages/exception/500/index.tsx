import { Link } from 'umi';
import { Result, Button } from 'antd';

/**
 * React functional component representing a 500 Internal Server Error result page.
 * @function
 * @returns {JSX.Element} - JSX element representing the 500 Internal Server Error result page.
 */
export default (): JSX.Element => (
  <Result
    status="500"
    title="500"
    style={{
      background: 'none',
    }}
    subTitle="Sorry, the server is reporting an error."
    extra={
      <Link to="/">
        <Button type="primary">Back Home</Button>
      </Link>
    }
  />
);
