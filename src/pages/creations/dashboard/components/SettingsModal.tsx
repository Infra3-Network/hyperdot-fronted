import { Modal, Row, Col, Input, Checkbox, Tag } from 'antd';
import { useState } from 'react';

type Props = {
  dashboard: HYPERDOT_API.Dashboard;
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
        open={props.ctl.settingsModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="Save"
        cancelText="Cancel"
      >
        <Row gutter={[0, 12]}>
          <Col span={24}>
            <p>Dashboard name</p>
            <Input
              // placeholder={inStatus.name.msg}
              // status={inStatus.name.status}
              value={props.dashboard.name}
              // onChange={handleDashboardNameChange}
              // onPressEnter={handleDashboardNameChange}
            />
          </Col>
          <Col span={24}>
            <p>Dashboard description</p>
            <Input.TextArea
              // placeholder={inStatus.description.msg}
              // status={inStatus.description.status}
              value={props.dashboard.description}
              // onChange={handleDashboardDecsriptionChange}
              // onPressEnter={handleDashboardDecsriptionChange}
            />
          </Col>

          <Col span={24}>
            <p>Dashboard tags</p>
            <Input
              onChange={(e) => {
                props.action.setDashboard((prev: any) => {
                  return {
                    ...prev,
                    tags: e.target.value,
                  };
                });
              }}
              value={props.dashboard.tags}
              placeholder={'tag1,tag2,tag3...'}
            />
          </Col>

          <Col span={24}>
            <p>Privacy</p>
            <Checkbox
              value={props.dashboard.is_privacy}
              // onChange={handleDashboardPrivacyChange}
            >
              {' '}
              Make Private{' '}
            </Checkbox>
          </Col>
        </Row>
      </Modal>
    </>
  );
};

export default SettingsModal;
