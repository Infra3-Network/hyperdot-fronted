import { Modal } from 'antd';
import { useState } from 'react';

type Props = {
  ctl: ControlState;
  action: StateAction;
};

const VisualizationModal = (props: Props) => {
  const handleOk = () => {
    props.action.setControlState((prev) => {
      return {
        ...prev,
        visualizationModalOpen: false,
      };
    });
  };

  const handleCancel = () => {
    props.action.setControlState((prev) => {
      return {
        ...prev,
        visualizationModalOpen: false,
      };
    });
  };

  return (
    <>
      <Modal open={props.ctl.visualizationModalOpen} onOk={handleOk} onCancel={handleCancel}>
        <p>a</p>
      </Modal>
    </>
  );
};

export default VisualizationModal;
