import React, { useState } from 'react';
import { TwitterOutlined } from '@ant-design/icons';
import { Upload, message, Avatar } from 'antd';
import ProForm, { ProFormText, ProFormTextArea } from '@ant-design/pro-form';

import styles from './BaseView.less';
import MyIcon from '@/components/Icons';
import { updateUser, uploadUserAvatar } from '@/services/hyperdot/api';
import type { RcFile, UploadFile } from 'antd/lib/upload';
import ImgCrop from 'antd-img-crop';

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
        setAvatar(res.data.data.object_key);
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

/**
 * Functional component representing the base view in user settings.
 * @param user - The current user for whom the base view is displayed.
 * @param setUser - React state setter function for updating the current user.
 */
const BaseView = ({ user, setUser }: Props) => {
  const [avatar, setAvatar] = useState<string>(user.icon_url ? user.icon_url : '');

  const handleFinish = async (formData: any) => {
    const res = await updateUser(formData);

    setUser(res.data.data);
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
              placeholder={'Your bio'}
            />

            <ProFormText
              width="md"
              name="twitter"
              placeholder={'You twitter username'}
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
              placeholder={'You github username'}
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
              placeholder={'You discord username'}
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
              placeholder={'You telgram username'}
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
              placeholder={"e.g. 'San Francisco, CA'"}
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
