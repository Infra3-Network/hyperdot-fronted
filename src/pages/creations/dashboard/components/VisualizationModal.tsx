import { AreaChartOutlined } from '@ant-design/icons';
import { Button, Col, Input, List, Modal, Row } from 'antd';
import { useState } from 'react';

type Props = {
  ctl: ControlState;
  action: StateAction;
};

const VisualizationModal = (props: Props) => {
  const data = [
    'Racing car sprays burning fuel into crowd.',
    'Japanese princess to wed commoner.',
    'Australian walks 100km after outback crash.',
    'Man charged over missing wedding girl.',
    'Los Angeles battles huge wildfires.',
  ];

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
      <Modal
        open={props.ctl.visualizationModalOpen}
        okText={'Done'}
        cancelText={'Cancel'}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Row gutter={[0, 16]}>
          <Col span={24}>
            <Input placeholder="Search your queries..." />
          </Col>

          <Col span={24}>
            <List
              bordered
              dataSource={data}
              renderItem={(item) => (
                <List.Item
                  style={{
                    backgroundColor: 'gray',
                    borderBottom: '1px solid white',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <p>
                      <AreaChartOutlined />
                      {item}
                    </p>
                  </div>
                  <Button type="primary">Add</Button>
                </List.Item>
              )}
            />
          </Col>
        </Row>
      </Modal>
    </>
  );
};

export default VisualizationModal;
