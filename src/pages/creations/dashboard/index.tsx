import { getInitialState } from '@/app';
import { Modal, Row, Col, Input, Space, Checkbox } from 'antd';
import React, { useEffect, useState } from 'react';

type Props = {};

export default function CreationDashboard({}: Props) {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(true);

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <Modal
      open={isModalOpen}
      onOk={handleOk}
      onCancel={handleCancel}
      okText="Save and open"
      cancelText="Cancel"
    >
      <Row gutter={[0, 12]}>
        <Col span={24}>
          <p>Dashboard name</p>
          <Input placeholder="My dashboard" />
        </Col>
        <Col span={24}>
          <p>Description</p>
          <Input.TextArea placeholder="My dashboard description" />
        </Col>

        <Col span={24}>
          <p>Privacy</p>
          <Checkbox> Make Private </Checkbox>
        </Col>
      </Row>
    </Modal>
  );
}
