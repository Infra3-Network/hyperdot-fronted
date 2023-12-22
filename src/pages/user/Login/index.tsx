import { message, Form, Button, Input, Checkbox } from 'antd';
import React from 'react';
import { history, useModel } from 'umi';
import { login } from '@/services/hyperdot/api';

import styles from './index.less';
import { isEmail } from '@/utils';
import BackgroundVideo from '../Background';

/**
 * Functional component representing the login page.
 * @function
 * @returns {JSX.Element} - JSX element representing the Login component.
 */
const Login: React.FC = (): JSX.Element => {
  const { initialState, setInitialState } = useModel('@@initialState');
  const fetchUserInfo = async () => {
    const userInfo = await initialState?.fetchUserInfo?.();
    if (userInfo) {
      await setInitialState((s: any) => ({
        ...s,
        currentUser: userInfo,
      }));
    }
  };

  const handleSubmit = async (values: any) => {
    const params: HYPERDOT_API.LoginParams = {
      provider: 'password',
      ...values,
    };

    if (isEmail(values.userId as string)) {
      params.email = values.userId;
      params.userId = '';
    }

    try {
      const msg = await login(params, {});
      if (msg.success) {
        localStorage.setItem('token', msg.data?.token);
        message.success('Login successfully!');
        await fetchUserInfo();
        if (!history) return;
        const { query } = history.location;
        const { redirect } = query as { redirect: string };
        history.push(redirect || '/');
        return;
      }
      return;
    } catch (error) {
      message.error('Login failed, please retry!');
    }
  };

  return (
    <div className={styles.container}>
      <BackgroundVideo src={'/5_15488489005727.mp4'} />

      <div className={styles.containerLeft} />
      <div className={`${styles.content} `}>
        <Form
          name="basic"
          wrapperCol={{ span: 16 }}
          style={{ maxWidth: 600 }}
          initialValues={{ remember: true }}
          onFinish={handleSubmit}
          // onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Form.Item<HYPERDOT_API.LoginParams>
            label="Username"
            name="userId"
            rules={[{ required: true, message: 'Please input your username or email!' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item<HYPERDOT_API.LoginParams>
            label="Password"
            name="password"
            rules={[{ required: true, message: 'Please input your password!' }]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item<HYPERDOT_API.LoginParams>
            name="autoLogin"
            valuePropName="checked"
            wrapperCol={{ offset: 0, span: 22 }}
          >
            <Checkbox>Remember me</Checkbox>
            <a
              style={{
                float: 'right',
              }}
            >
              Forgot Password?
            </a>
          </Form.Item>

          <Form.Item wrapperCol={{ offset: 0, span: 22 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <Button type="primary" htmlType="submit">
                Sign in
              </Button>

              <Button
                onClick={() => {
                  history.push('/user/register');
                }}
              >
                Need an account? Sing up here
              </Button>
            </div>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default Login;
