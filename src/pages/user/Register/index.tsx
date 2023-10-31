import { message, Form, Button, Input, Checkbox, ConfigProvider } from 'antd';
import React from 'react';
import { history, useModel } from 'umi';
import { createAccount, login } from '@/services/hyperdot/api';
import enUS from 'antd/lib/locale/en_US';

import styles from './index.less';
import { isEmail } from '@/utils';
import BackgroundVideo from '../Background';

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
    const createAccountRequest: HYPERDOT_API.CreateAccountRequest = {
      ...values,
    };
    console.log('createAccount ', createAccountRequest, values);

    if (values.confirm_password !== createAccountRequest.password) {
      message.error('Passwords do not match');
      return;
    }

    createAccount(createAccountRequest)
      .then((res) => {
        if (!res.success) {
          message.error(res.errorMessage);
          return;
        }

        message.success('Account created, please login');
        history.push('/user/login');
      })
      .catch((error) => {
        message.error(error.message);
      })

      .finally(() => {});
  };

  return (
    <div className={styles.container}>
      {/* <div className={styles.lang} data-lang>
        {SelectLang && <SelectLang />}
      </div> */}
      {/* <BackgroundVideo src={'/5_15488489005727.mp4'} /> */}
      <BackgroundVideo src={'/5_15488489005769.mp4'} />
      <div className={styles.content}>
        <ConfigProvider locale={enUS}>
          <Form
            name="basic"
            labelCol={{ span: 10 }}
            wrapperCol={{ span: 14 }}
            style={{ maxWidth: 600 }}
            initialValues={{ remember: true }}
            onFinish={handleSubmit}
            // onFinishFailed={onFinishFailed}
            autoComplete="off"
          >
            <Form.Item<HYPERDOT_API.CreateAccountRequest>
              label="Pick a username"
              name="username"
              rules={[{ required: true, message: 'Please input your username!' }]}
            >
              <Input />
            </Form.Item>

            <Form.Item<HYPERDOT_API.CreateAccountRequest>
              label="Your email address"
              name="email"
              rules={[{ required: true, message: 'Please input your  email!' }, { type: 'email' }]}
            >
              <Input />
            </Form.Item>

            <Form.Item<HYPERDOT_API.CreateAccountRequest>
              label="Chose a password"
              name="password"
              rules={[{ required: true, message: 'Please input your password!' }]}
            >
              <Input.Password />
            </Form.Item>

            <Form.Item<HYPERDOT_API.CreateAccountRequest>
              label="Confirm your passwrod"
              name="confirm_password"
              rules={[{ required: true, message: 'Please input confirm password!' }]}
            >
              <Input.Password />
            </Form.Item>

            <Form.Item wrapperCol={{ offset: 10, span: 14 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Button type="primary" htmlType="submit">
                  Create account
                </Button>

                <Button
                  onClick={() => {
                    history.push('/user/login');
                  }}
                >
                  Cancel
                </Button>
              </div>
            </Form.Item>
          </Form>
        </ConfigProvider>
      </div>
      {/* <Footer /> */}
    </div>
  );
};

export default Login;