import { message, Form, Button, Input, Checkbox } from 'antd';
import React from 'react';
import { history, useModel } from 'umi';
import { login } from '@/services/hyperdot/api';

import styles from './index.less';
import { isEmail } from '@/utils';

const Login: React.FC = () => {
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
        /** 此方法会跳转到 redirect 参数所在的位置 */
        if (!history) return;
        const { query } = history.location;
        const { redirect } = query as { redirect: string };
        history.push(redirect || '/');
        return;
      }
      // 如果失败去设置用户错误信息
      return;
    } catch (error) {
      message.error('Login failed, please retry!');
    }
  };

  return (
    <div className={styles.container}>
      {/* <div className={styles.lang} data-lang>
        {SelectLang && <SelectLang />}
      </div> */}
      <div className={styles.content}>
        <Form
          name="basic"
          // labelCol={{ span: 8 }}
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
      {/* <Footer /> */}
    </div>
  );
};

export default Login;
