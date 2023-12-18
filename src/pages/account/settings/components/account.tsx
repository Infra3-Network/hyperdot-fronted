import { CheckCircleTwoTone } from '@ant-design/icons';
import { Input, Space, Button, Row, Col, message } from 'antd';
import ProForm, { ProFormText } from '@ant-design/pro-form';
import React from 'react';
import styles from './AccountView.less';
import { updateUserPassword } from '@/services/hyperdot/api';
import { history } from 'umi';

type Props = {
  user: HYPERDOT_API.CurrentUser;
};

const AccountView = ({ user }: Props) => {
  const [showPasswordChange, setShowPasswordChange] = React.useState<boolean>(false);

  const handleEmailVerify = () => {
    message.warn('unimplemented');
  };

  const handlePasswordFinish = async (formData: any) => {
    if (formData.new_password !== formData.confirm_password) {
      message.error('Passwords do not match');
      return;
    }

    updateUserPassword({
      current_password: formData.current_password,
      new_password: formData.new_password,
    })
      .then((res) => {
        if (res.success) {
          message.success('Change password successfully, Please login again', 2);
          history.push('/user/login');
          localStorage.removeItem('token');
          return;
        }
      })
      .catch((error) => {
        // message.error(error.message);
      })
      .finally(() => {});
    // const res = await updateUserPassword({
    //   current_password: formData.current_password,
    //   new_password: formData.new_password,
    // });

    // if (res.data.success) {
    //   message.success('Change password successfully, Please login again', 2);
    //   history.push('/user/login');
    //   localStorage.removeItem('token');
    //   return;
    // }

    // message.error(res.data.errorMessage);
  };

  return (
    <>
      <Row gutter={[0, 16]}>
        <Col span={24}>
          <h4>Email</h4>
          <Space.Compact style={{ width: '100%' }}>
            <Input value={user.email} suffix={<CheckCircleTwoTone twoToneColor="#52c41a" />} />
            <Button type="primary" onClick={() => handleEmailVerify()}>
              Verify
            </Button>
          </Space.Compact>
        </Col>

        <Col span={24}>
          {!showPasswordChange && (
            <>
              <h4>Password</h4>
              <div className={styles.passwordContainer}>
                <Input.Password
                  value={user.encrypted_password}
                  bordered={false}
                  disabled={true}
                  visibilityToggle={false}
                />
                <Button
                  type="primary"
                  onClick={() => {
                    setShowPasswordChange(true);
                  }}
                >
                  Change Password
                </Button>
              </div>
            </>
          )}

          {showPasswordChange && (
            <ProForm
              layout="vertical"
              onFinish={handlePasswordFinish}
              submitter={{
                searchConfig: {
                  submitText: 'Save',
                  resetText: 'Cancel',
                },
                render: (_, dom) => {
                  return (
                    <>
                      <Space>
                        {dom[1]}
                        {dom[0]}
                      </Space>
                    </>
                  );
                },
                onReset: () => {
                  setShowPasswordChange(false);
                },
              }}
              // initialValues={{
              //     ...currentUser,
              //     phone: currentUser?.phone.split('-'),
              // }}
              hideRequiredMark
            >
              <ProFormText.Password
                width="md"
                name="current_password"
                label="Current Password"
                placeholder={'Enter current password'}
                rules={[
                  {
                    required: true,
                    message: 'Enter current password',
                  },
                ]}
              />

              <ProFormText.Password
                width="md"
                name="new_password"
                label="New Password"
                placeholder={'Enter new password'}
                rules={[
                  {
                    required: true,
                    message: 'Enter new password',
                  },
                ]}
              />

              <ProFormText.Password
                width="md"
                name="confirm_password"
                label="Confirm Password"
                placeholder={'Confirm password'}
                rules={[
                  {
                    required: true,
                    message: 'Confirm password',
                  },
                ]}
              />
            </ProForm>
          )}
        </Col>
      </Row>
    </>
  );
};

export default AccountView;
