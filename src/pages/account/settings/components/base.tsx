import React, { useState } from 'react';
import { TwitterOutlined, UploadOutlined } from '@ant-design/icons';
import { Button, Input, Upload, message, Avatar } from 'antd';
import ProForm, {
  ProFormDependency,
  ProFormFieldSet,
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
} from '@ant-design/pro-form';
import { useRequest } from 'umi';
import { queryCurrent } from '../service';
import { queryProvince, queryCity } from '../service';

import styles from './BaseView.less';
import MyIcon from '@/components/Icons';
import { updateUser } from '@/services/hyperdot/api';
import { P } from '@antv/g2plot';

const validatorPhone = (rule: any, value: string[], callback: (message?: string) => void) => {
  if (!value[0]) {
    callback('Please input your area code!');
  }
  if (!value[1]) {
    callback('Please input your phone number!');
  }
  callback();
};
// 头像组件 方便以后独立，增加裁剪之类的功能
const AvatarView = ({ avatar }: { avatar: string }) => (
  <>
    {/* <div className={styles.avatar_title}>头像</div> */}
    <div className={styles.avatar}>
      <Avatar
        src={avatar}
        style={{ width: '128px', height: '128px', borderRadius: '50%', objectFit: 'cover' }}
      />
    </div>

    <Upload showUploadList={false}>
      <div className={styles.button_view}>
        <Button>
          <UploadOutlined />
          Edit
        </Button>
      </div>
    </Upload>
  </>
);

type Props = {
  user: HYPERDOT_API.CurrentUser;
  setUser: React.Dispatch<React.SetStateAction<HYPERDOT_API.CurrentUser | undefined>>;
};

const BaseView = ({ user, setUser }: Props) => {
  const getAvatarURL = () => {
    if (user.icon_url) {
      return user.icon_url;
    }
    // if (currentUser) {
    //   if (currentUser.avatar) {
    //     return currentUser.avatar;
    //   }
    //   const url = 'https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png';
    //   return url;
    // }
    return '';
  };

  const handleFinish = async (formData: any) => {
    const res = await updateUser(formData);
    setUser(res.data);
    message.success('Update Success');
  };
  return (
    <div className={styles.baseView}>
      <>
        <div className={styles.left}>
          <ProForm
            layout="vertical"
            onFinish={handleFinish}
            submitter={{
              searchConfig: {
                submitText: 'Update profile',
              },
              render: (_, dom) => dom[1],

              // onSubmit(value) {
              //   console.log(value)
              // },
            }}
            initialValues={{
              ...user,
              // phone: currentUser?.phone.split('-'),
            }}
            hideRequiredMark
          >
            <ProFormText
              width="md"
              name="username"
              label="Name"
              rules={[
                {
                  required: true,
                  message: 'Please input your name!',
                },
              ]}
            />

            <ProFormTextArea
              name="bio"
              label="Bio"
              rules={[
                {
                  required: true,
                  message: 'Please your bio!',
                },
              ]}
              placeholder=""
            />

            <ProFormText
              width="md"
              name="twitter"
              placeholder={''}
              label={<TwitterOutlined />}
              rules={[
                {
                  required: true,
                  message: 'Please input your twitter',
                },
              ]}
            />

            <ProFormText
              width="md"
              name="github"
              placeholder={''}
              label={<MyIcon type="icon-github" />}
              rules={[
                {
                  required: true,
                  message: 'Please input your github',
                },
              ]}
            />

            <ProFormText
              width="md"
              name="discord"
              placeholder={''}
              label={<MyIcon type="icon-discord" />}
              rules={[
                {
                  required: true,
                  message: 'Please input your discord',
                },
              ]}
            />

            <ProFormText
              width="md"
              name="telgram"
              placeholder={''}
              label={<MyIcon type="icon-telgram" />}
              rules={[
                {
                  required: true,
                  message: 'Please input your telegram',
                },
              ]}
            />

            <ProFormText
              width="md"
              name="location"
              label="Location"
              rules={[
                {
                  required: true,
                  message: 'Please input your location',
                },
              ]}
            />
          </ProForm>
        </div>
        <div className={styles.right}>
          <AvatarView avatar={getAvatarURL()} />
        </div>
      </>
    </div>
  );
};

export default BaseView;
