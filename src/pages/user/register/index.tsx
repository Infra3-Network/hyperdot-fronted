import type { FC } from 'react';
import React, { useState, useEffect } from 'react';
import { Button, Row, Col, Input, message, Card } from 'antd';
import { Link, useRequest, history } from 'umi';

import styles from './style.less';
import { createAccount } from '@/services/hyperdot/api';

const Register: FC = () => {
  // ----

  const [confirmPassword, setConfirmPassword] = React.useState<string>('');
  const [createAccountRequest, setCreateAccountRequest] =
    React.useState<HYPERDOT_API.CreateAccountRequest>({
      provider: 'password',
      username: '',
      email: '',
      password: '',
    });
  const [statusMap, setStatusMap] = React.useState<Map<string, string>>(
    new Map([
      ['username', ''],
      ['email', ''],
      ['password', ''],
      ['confirm_password', ''],
    ]),
  );

  const handleSubmit = () => {
    if (createAccountRequest.username === '') {
      setStatusMap(
        new Map([
          ['username', 'error'],
          ['email', ''],
          ['password', ''],
          ['confirm_password', ''],
        ]),
      );
      message.error('Username is required');
      return;
    }

    if (createAccountRequest.email === '') {
      setStatusMap(
        new Map([
          ['username', ''],
          ['email', 'error'],
          ['password', ''],
          ['confirm_password', ''],
        ]),
      );
      message.error('Email is required');
      return;
    }

    if (createAccountRequest.password === '') {
      setStatusMap(
        new Map([
          ['username', ''],
          ['email', ''],
          ['password', 'error'],
          ['confirm_password', ''],
        ]),
      );
      message.error('Password is required');
      return;
    }

    if (confirmPassword !== createAccountRequest.password) {
      setStatusMap(
        new Map([
          ['username', ''],
          ['email', ''],
          ['password', 'error'],
          ['confirm_password', 'error'],
        ]),
      );
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

      .finally(() => {
        setStatusMap(
          new Map([
            ['username', ''],
            ['email', ''],
            ['password', ''],
            ['confirm_password', ''],
          ]),
        );
      });
  };

  return (
    <>
      <Row justify={'center'} align={'middle'} style={{ minHeight: '100vh' }}>
        <Col>
          <Card bordered={true}>
            <Row gutter={[0, 24]}>
              <Col span={24}>
                <p>Pick a username</p>
                <Input
                  placeholder={'hyperdot'}
                  status={statusMap.get('username') || ''}
                  value={createAccountRequest.username}
                  onChange={(e) => {
                    setCreateAccountRequest({ ...createAccountRequest, username: e.target.value });
                  }}
                />
              </Col>

              <Col span={24}>
                <p>Your email address</p>
                <Input
                  placeholder={'mail@exmaiple.com'}
                  status={statusMap.get('email') || ''}
                  value={createAccountRequest.email}
                  onChange={(e) => {
                    setCreateAccountRequest({ ...createAccountRequest, email: e.target.value });
                  }}
                />
              </Col>

              <Col span={24}>
                <p>Choose a password</p>
                <Input.Password
                  visibilityToggle={true}
                  value={createAccountRequest.password}
                  status={statusMap.get('password') || ''}
                  onChange={(e) => {
                    setCreateAccountRequest({ ...createAccountRequest, password: e.target.value });
                  }}
                />
              </Col>

              <Col span={24}>
                <p>Confirm password</p>
                <Input.Password
                  visibilityToggle={true}
                  value={confirmPassword}
                  status={statusMap.get('confirm_password') || ''}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                  }}
                />
              </Col>
            </Row>

            <Row justify={'space-between'} style={{ marginTop: '18px' }}>
              <Col>
                <Button
                  size="large"
                  className={styles.submit}
                  type="primary"
                  // htmlType="submit"
                  onClick={handleSubmit}
                >
                  <span>Create Account</span>
                </Button>
              </Col>
              <Col>
                <Button size="large">
                  <span>Cancel</span>
                </Button>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
    </>
    // <div className={styles.main}>
    //   <h3>注册</h3>
    //   <Form form={form} name="UserRegister" onFinish={onFinish}>
    //     <FormItem
    //       name="mail"
    //       rules={[
    //         {
    //           required: true,
    //           message: '请输入邮箱地址!',
    //         },
    //         {
    //           type: 'email',
    //           message: '邮箱地址格式错误!',
    //         },
    //       ]}
    //     >
    //       <Input size="large" placeholder="邮箱" />
    //     </FormItem>
    //     <Popover
    //       getPopupContainer={(node) => {
    //         if (node && node.parentNode) {
    //           return node.parentNode as HTMLElement;
    //         }
    //         return node;
    //       }}
    //       content={
    //         visible && (
    //           <div style={{ padding: '4px 0' }}>
    //             {passwordStatusMap[getPasswordStatus()]}
    //             {renderPasswordProgress()}
    //             <div style={{ marginTop: 10 }}>
    //               <span>请至少输入 6 个字符。请不要使用容易被猜到的密码。</span>
    //             </div>
    //           </div>
    //         )
    //       }
    //       overlayStyle={{ width: 240 }}
    //       placement="right"
    //       visible={visible}
    //     >
    //       <FormItem
    //         name="password"
    //         className={
    //           form.getFieldValue('password') &&
    //           form.getFieldValue('password').length > 0 &&
    //           styles.password
    //         }
    //         rules={[
    //           {
    //             validator: checkPassword,
    //           },
    //         ]}
    //       >
    //         <Input size="large" type="password" placeholder="至少6位密码，区分大小写" />
    //       </FormItem>
    //     </Popover>
    //     <FormItem
    //       name="confirm"
    //       rules={[
    //         {
    //           required: true,
    //           message: '确认密码',
    //         },
    //         {
    //           validator: checkConfirm,
    //         },
    //       ]}
    //     >
    //       <Input size="large" type="password" placeholder="确认密码" />
    //     </FormItem>
    //     <InputGroup compact>
    //       <Select size="large" value={prefix} onChange={changePrefix} style={{ width: '20%' }}>
    //         <Option value="86">+86</Option>
    //         <Option value="87">+87</Option>
    //       </Select>
    //       <FormItem
    //         style={{ width: '80%' }}
    //         name="mobile"
    //         rules={[
    //           {
    //             required: true,
    //             message: '请输入手机号!',
    //           },
    //           {
    //             pattern: /^\d{11}$/,
    //             message: '手机号格式错误!',
    //           },
    //         ]}
    //       >
    //         <Input size="large" placeholder="手机号" />
    //       </FormItem>
    //     </InputGroup>
    //     <Row gutter={8}>
    //       <Col span={16}>
    //         <FormItem
    //           name="captcha"
    //           rules={[
    //             {
    //               required: true,
    //               message: '请输入验证码!',
    //             },
    //           ]}
    //         >
    //           <Input size="large" placeholder="验证码" />
    //         </FormItem>
    //       </Col>
    //       <Col span={8}>
    //         <Button
    //           size="large"
    //           disabled={!!count}
    //           className={styles.getCaptcha}
    //           onClick={onGetCaptcha}
    //         >
    //           {count ? `${count} s` : '获取验证码'}
    //         </Button>
    //       </Col>
    //     </Row>
    //     <FormItem>
    //       <Button
    //         size="large"
    //         loading={submitting}
    //         className={styles.submit}
    //         type="primary"
    //         htmlType="submit"
    //       >
    //         <span>注册</span>
    //       </Button>
    //       <Link className={styles.login} to="/user/login">
    //         <span>使用已有账户登录</span>
    //       </Link>
    //     </FormItem>
    //   </Form>
    // </div>
  );
};
export default Register;
