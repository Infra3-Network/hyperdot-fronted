import { removeDashboardPanel } from '@/services/hyperdot/api';
import { Button, Col, Input, message, Modal, Row, Space } from 'antd';
import { useState } from 'react';

type Props = {
  ctl: ControlState;
  action: StateAction;
};

const EditPanelModal = (props: Props) => {
  return (
    <>
      {props.ctl.editPanel && (
        <Modal open={props.ctl.editPanelModalOpen} closable={false} footer={[]}>
          <Space>
            <Button
              type={'primary'}
              onClick={() => {
                if (props.ctl.editPanelIndex == -1) {
                  message.error('Something went wrong');
                  return;
                }

                const removePanel = props.ctl.editPanel;
                if (removePanel?.id) {
                  removeDashboardPanel(removePanel.id)
                    .then((res) => {
                      if (!res.success) {
                        message.error(res.errorMessage);
                        return;
                      }
                    })
                    .catch((err) => {
                      message.error(err.message);
                    });
                }

                // remove panel from dashboard
                props.action.setDashboard((prev) => {
                  return {
                    ...prev,
                    panels: prev.panels?.filter((panel, index) => {
                      return index != props.ctl.editPanelIndex;
                    }),
                  };
                });

                props.action.setControlState((prev) => {
                  return {
                    ...prev,
                    editPanelModalOpen: false,
                  };
                });

                message.success('Panel removed');
              }}
            >
              {' '}
              Remove this widget
            </Button>
            <Button
              type={'default'}
              onClick={() => {
                props.action.setControlState((prev) => {
                  return {
                    ...prev,
                    editPanelModalOpen: false,
                  };
                });
              }}
            >
              {' '}
              Cancel{' '}
            </Button>
          </Space>
        </Modal>
      )}
    </>
  );
};

export default EditPanelModal;
