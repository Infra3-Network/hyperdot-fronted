import { Col, Input, Modal, Row, Space } from 'antd';
import { useState } from 'react';

type Props = {
  ctl: ControlState;
  action: StateAction;
};

type InnerState = {
  text: string;
  status: string;
  msg: string;
};

const TextWidgetModal = (props: Props) => {
  const [state, setState] = useState<InnerState>({
    text: '',
    status: '',
    msg: '',
  });

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    setState((prev) => {
      return {
        ...prev,
        text: text,
        status: '',
        msg: '',
      };
    });
  };

  const handleOk = () => {
    if (!state.text) {
      setState((prev) => {
        return {
          ...prev,
          status: 'error',
          msg: 'Please input your text widget content!',
        };
      });
      return;
    }

    props.action.setControlState((prev) => {
      return {
        ...prev,
        textWidgetModalOpen: false,
      };
    });

    props.action.setDashboard((prev: any) => {
      return {
        ...prev,
        panels: [
          ...(prev.panels || []),
          {
            id: 0,
            type: 0, // 0 is represent text widget
            x_pos: 0,
            y_pos: 0,
            width: 'auto',
            height: 'auto',
            text: state.text,
          },
        ],
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
      <Modal
        open={props.ctl.textWidgetModalOpen}
        okText={'Save'}
        cancelText={'Cancel'}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Row>
          <Col span={24}>
            <p>Text widget content</p>
            <Input.TextArea
              rows={6}
              placeholder={state.msg}
              status={state.status}
              value={state.text}
              onChange={handleTextChange}
            />
            <p>
              <b>Markdown is supported</b>
            </p>
          </Col>
        </Row>
      </Modal>
    </>
  );
};

export default TextWidgetModal;
