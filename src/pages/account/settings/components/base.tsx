import React, { useEffect, useState } from 'react';
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
import { getFile, updateUser, uploadUserAvatar } from '@/services/hyperdot/api';
import { P } from '@antv/g2plot';
import { RcFile, UploadFile } from 'antd/lib/upload';
import ImgCrop from 'antd-img-crop';
// import fs from 'fs';
import os from 'os';
import path from 'path';

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
const AvatarView = ({
  avatar,
  setAvatar,
  username,
}: {
  avatar: string;
  setAvatar: React.Dispatch<React.SetStateAction<string>>;
  username: string;
}) => {
  const [avatarFiles, setAvatarFiles] = useState<UploadFile[]>();

  const beforeUpload = (file: RcFile) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      message.error('You can only upload JPG/PNG file!');
      return false;
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('Image must smaller than 2MB!');
      return false;
    }

    setAvatarFiles([file]);
    // manual upload, so hack it
    return false;
  };

  const handleUpload = () => {
    if (!avatarFiles || avatarFiles.length < 1) {
      message.error('Please select an image');
      return;
    }

    const avatarFile = avatarFiles[0];
    if (!avatarFile) {
      message.error('Please select an image');
      return;
    }

    const rcFile = avatarFile as RcFile;

    const formData = new FormData();
    formData.append('avatar', rcFile);

    uploadUserAvatar(formData)
      .then((res) => {
        message.info('Avatar upload success');
        setAvatar(res.data.object_key);
      })
      .catch((err) => {
        message.error('Avatar upload failed: ' + err);
      });
  };

  return (
    <>
      <ImgCrop
        modalTitle="Edit image"
        modalOk="Confirm"
        modalCancel="Cancel"
        onModalOk={handleUpload}
        rotationSlider
      >
        <Upload
          name="avatar"
          fileList={avatarFiles}
          beforeUpload={beforeUpload}
          showUploadList={false}
        >
          {/* <div className={styles.button_view}>
          <Button onClick={handleUpload}>
            <UploadOutlined />
            Edit
          </Button>
        </div> */}
          {avatar != '' ? (
            <div className={styles.avatar}>
              <Avatar size={128} src={'/apis/v1/file?file=' + avatar} />
            </div>
          ) : (
            <div className={styles.avatar}>
              <Avatar size={128}>{username}</Avatar>
            </div>
          )}
        </Upload>
      </ImgCrop>
    </>
  );
};

type Props = {
  user: HYPERDOT_API.CurrentUser;
  setUser: React.Dispatch<React.SetStateAction<HYPERDOT_API.CurrentUser | undefined>>;
};

const BaseView = ({ user, setUser }: Props) => {
  const [avatar, setAvatar] = useState<string>(user.icon_url ? user.icon_url : '');

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
                  message: 'Please input your telgram',
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
          <AvatarView
            avatar={avatar}
            setAvatar={setAvatar}
            username={user.username ? user.username : 'User'}
          />
        </div>
      </>
    </div>
  );
};

export default BaseView;
