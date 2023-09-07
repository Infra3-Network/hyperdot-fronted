import {Card, Col, Row} from 'antd';
import {GridContent} from '@ant-design/pro-layout';
import QueryEngine from './components/QueryEngine';
import QueryEditor from "./components/QueryEditor";
import QueryVisualization from "@/pages/creations/query/components/QueryVisualization";

export const CreationQuery = () => {
  return (
    <GridContent>
      <>
        <Row gutter={24}>
          <Col span={6} style={{marginBottom: 24}}>
            <Card>
              <QueryEngine/>
            </Card>
          </Col>

          <Col xl={18} lg={24} md={24} sm={24} xs={24} style={{marginBottom: 24}}>
            <Row style={{padding: '16px 0'}}>
              <Card>
                <QueryEditor/>
              </Card>
            </Row>
            <QueryVisualization/>

          </Col>
        </Row>
      </>
    </GridContent>
  );
};

export default CreationQuery;
