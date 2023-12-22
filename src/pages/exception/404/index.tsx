import { Link } from 'umi';
import { Result, Button } from 'antd';

/**
 * React functional component representing a 404 Not Found result page.
 * @function
 * @returns {JSX.Element} - JSX element representing the 404 Not Found result page.
 */
export default () => (
  <Result
    status="404"
    title="404"
    style={{
      background: 'none',
    }}
    subTitle="Sorry, the page you visited does not exist."
    extra={
      <Link to="/">
        <Button type="primary">Back Home</Button>
      </Link>
    }
  />
);
