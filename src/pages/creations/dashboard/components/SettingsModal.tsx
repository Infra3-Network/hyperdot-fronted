import { Modal } from 'antd';
import { useState } from 'react';

type Props = {
  ctl: ControlState;
  action: StateAction;
};

const SettingsModal = (props: Props) => {
  const handleOk = () => {
    props.action.setControlState((prev) => {
      return {
        ...prev,
        settingsModalOpen: false,
      };
    });
  };

  const handleCancel = () => {
    props.action.setControlState((prev) => {
      return {
        ...prev,
        settingsModalOpen: false,
      };
    });
  };

  return (
    <>
      <Modal
        title="Basic Modal"
        open={props.ctl.settingsModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <p>Some contents...</p>
        <p>Some contents...</p>
        <p>Some contents...</p>
      </Modal>
    </>
  );
};

export default SettingsModal;
