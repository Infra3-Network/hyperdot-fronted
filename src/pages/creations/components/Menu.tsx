import MyIcon from '@/components/Icons';
import { createDashboard } from '@/services/hyperdot/api';
import { PlusCircleOutlined } from '@ant-design/icons';
import {
  Dropdown,
  Button,
  type MenuProps,
  Space,
  Modal,
  Input,
  Row,
  Col,
  Checkbox,
  message,
} from 'antd';
import type { CheckboxChangeEvent } from 'antd/es/checkbox';
import React from 'react';
import { history, Link } from 'umi';

type CreationDashboardModalProps = {
  isModalOpen: boolean;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const CreationDashboardModal = ({ isModalOpen, setIsModalOpen }: CreationDashboardModalProps) => {
  const [createDashboardData, setCreateDashboardData] = React.useState<HYPERDOT_API.Dashboard>({});
  const [inStatus, setInStatus] = React.useState<{
    name: {
      msg: string;
      status: any;
    };
    description: {
      msg: string;
      status: any;
    };
  }>({
    name: {
      msg: 'My dashboard',
      status: undefined,
    },
    description: {
      msg: 'My dashboard description',
      status: undefined,
    },
  });

  const handleOk = () => {
    if (!createDashboardData.name) {
      setInStatus({
        ...inStatus,
        name: {
          msg: 'Please input your dashboard name!',
          status: 'error',
        },
      });
      return;
    }

    if (!createDashboardData.description) {
      setInStatus({
        ...inStatus,
        description: {
          msg: 'Please input your dashboard description!',
          status: 'error',
        },
      });
      return;
    }

    createDashboard(createDashboardData)
      .then((res) => {
        if (!res.success) {
          message.error(res.errorMessage);
        }

        message.success('Dashboard created successfully!', 3);
        history.push('/creations/dashboards/' + res.data.id);
        if (history.location.pathname.match(/\/creations\/dashboards\/\d+/)) {
          // should refresh
          history.go(0);
        }
      })
      .catch((err) => {
        message.error(err);
      })
      .finally(() => {
        setIsModalOpen(false);
      });
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handleDashboardNameChange = (e: any) => {
    setCreateDashboardData({
      ...createDashboardData,
      name: e.target.value,
    });
  };

  const handleDashboardDecsriptionChange = (e: any) => {
    setCreateDashboardData({
      ...createDashboardData,
      description: e.target.value,
    });
  };

  const handleDashboardPrivacyChange = (e: CheckboxChangeEvent) => {
    setCreateDashboardData({
      ...createDashboardData,
      is_privacy: e.target.checked,
    });
  };

  return (
    <Modal
      open={isModalOpen}
      onOk={handleOk}
      onCancel={handleCancel}
      footer={[
        <Button key="back" onClick={handleCancel}>
          Cancel
        </Button>,
        <Button id="creation-dashboard-save-btn" key="submit" type="primary" onClick={handleOk}>
          Save and open
        </Button>,
      ]}
    >
      <Row gutter={[0, 12]}>
        <Col span={24}>
          <p>Dashboard name</p>
          <Input
            id="creation-dashboard-name-input"
            placeholder={inStatus.name.msg}
            status={inStatus.name.status}
            value={createDashboardData.name}
            onChange={handleDashboardNameChange}
            onPressEnter={handleDashboardNameChange}
          />
        </Col>
        <Col span={24}>
          <p>Description</p>
          <Input.TextArea
            id="creation-dashboard-desc-input"
            placeholder={inStatus.description.msg}
            status={inStatus.description.status}
            value={createDashboardData.description}
            onChange={handleDashboardDecsriptionChange}
            onPressEnter={handleDashboardDecsriptionChange}
          />
        </Col>

        <Col span={24}>
          <p>Privacy</p>
          <Checkbox onChange={handleDashboardPrivacyChange}> Make Private </Checkbox>
        </Col>
      </Row>
    </Modal>
  );
};

const CreationDropdownMenu = () => {
  const [isModalOpen, setIsModalOpen] = React.useState<boolean>(false);

  const onClick: MenuProps['onClick'] = ({ key }) => {
    if (key === 'dashboards') {
      setIsModalOpen(true);
    }
  };

  const items: MenuProps['items'] = [
    {
      key: 'new-query',
      label: (
        <Link to="/creations/queries">
          <Space>
            <MyIcon type="icon-terminal_fill" />
            New query
          </Space>
        </Link>
      ),
    },
    {
      key: 'dashboards',
      label: (
        <Space id="open-creation-dashboard-container">
          <MyIcon type="icon-dashboard1" />
          New dashboard
        </Space>
      ),
    },
  ];

  return (
    <>
      <Dropdown menu={{ items, onClick }} placement="bottom" arrow>
        <Button
          id="creation-dashboard-btn"
          size="middle"
          type="link"
          icon={<PlusCircleOutlined />}
          style={{
            // border: 'none',
            borderRadius: '0.5rem',
            // padding: '0.6rem 0.6rem',
            marginLeft: '0.28rem',
            // display: 'inline-flex',
            // alignItems: 'center',
            // verticalAlign: 'middle',
            marginBottom: '-2px',
          }}
        >
          Creation
        </Button>
      </Dropdown>

      <CreationDashboardModal isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} />
    </>
  );
};

export default CreationDropdownMenu;
