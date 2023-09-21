import { Card, Col, Row } from 'antd';
import { GridContent } from '@ant-design/pro-layout';
import QueryEngine from './components/QueryEngine';
import QueryEditor from './components/QueryEditor';
import React from 'react';
import { TabManager } from './components/QueryEditor/tabmanager';

export const CreationQuery = () => {
  const [tabProps, setTabProps] = React.useState<QE.TabArray>({ id: 0, tabs: [] });

  React.useEffect(() => {
    setTabProps((prev: QE.TabArray) => {
      if (TabManager.findByName(prev, 'New Visualization')) {
        return prev;
      }

      return TabManager.add(prev, {
        name: 'New Visualization',
        children: 'new',
        closeable: false,
      });
    });
  }, []);
  return (
    <GridContent>
      <>
        <Row gutter={24}>
          <Col span={6} style={{ marginBottom: 24 }}>
            <Card>
              <QueryEngine />
            </Card>
          </Col>

          <Col xl={18} lg={24} md={24} sm={24} xs={24} style={{ marginBottom: 24 }}>
            <QueryEditor />
          </Col>
        </Row>
      </>
    </GridContent>
  );
};

export default CreationQuery;
