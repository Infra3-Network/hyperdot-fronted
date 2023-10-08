import { Modal } from 'antd';
import { useState } from 'react';

type Props = {
  ctl: ControlState;
  action: StateAction;
};

const TextWidgetModal = (props: Props) => {
  const handleOk = () => {
    props.action.setControlState((prev) => {
      return {
        ...prev,
        textWidgetModalOpen: false,
      };
    });
  };

  const handleCancel = () => {
    props.action.setControlState((prev) => {
      return {
        ...prev,
        textWidgetModalOpen: false,
      };
    });
  };

  return (
    <>
      <Modal open={props.ctl.textWidgetModalOpen} onOk={handleOk} onCancel={handleCancel}>
        <p>Some contents...</p>
        <p>Some contents...</p>
        <p>Some contents...</p>
      </Modal>
    </>
  );
};

export default TextWidgetModal;
