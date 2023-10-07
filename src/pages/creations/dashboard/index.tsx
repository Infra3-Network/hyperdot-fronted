import MyIcon from '@/components/Icons';
import { HomeOutlined, UserOutlined } from '@ant-design/icons';
import { Breadcrumb, Button, Card, Col, List, Row, Space } from 'antd';
import React from 'react';

import { Rnd } from 'react-rnd';

type Dashboard = {
  x: number;
  y: number;
  width: string;
  height: string;
  chart: string;
};

type WindowState = {
  width: number;
  height: number;
};

export const CreationDashboard = () => {
  const gridColsPercent = 0.45;
  const gridCols = 2;
  const gridRows = 3;
  const [windowState, setWindowState] = React.useState<WindowState>();
  const [dashboards, setDashboards] = React.useState<Dashboard[]>([]);

  const data = [
    {
      title: 'Title 1',
    },
    {
      title: 'Title 2',
    },
    {
      title: 'Title 3',
    },
    {
      title: 'Title 4',
    },
  ];

  React.useEffect(() => {
    setWindowState({
      width: window.innerWidth,
      height: window.innerHeight,
    });

    const width = window.innerWidth * gridColsPercent;
    const height = (window.innerHeight / 2) * 0.8;

    const its: Dashboard[] = data.map((v, index) => {
      return {
        x: 0,
        y: 0,
        width,
        height,
        chart: v.title,
      };
    });

    setDashboards(its);
  }, []);

  if (!dashboards) {
    return null;
  }

  console.log(history);

  console.log(dashboards);
  return (
    <>
      <Row gutter={[0, 24]}>
        {/* <Col span={24}>
          <Pages layout={Layout.Grid} />
        </Col> */}

        <Col span={24}>
          <Row justify={'space-between'}>
            <Col>
              <Breadcrumb>
                <Breadcrumb.Item href="">
                  <HomeOutlined />
                </Breadcrumb.Item>
                <Breadcrumb.Item href="">
                  <UserOutlined />
                  <span>Application List</span>
                </Breadcrumb.Item>
                <Breadcrumb.Item>Application</Breadcrumb.Item>
              </Breadcrumb>
            </Col>

            <Col>
              <Space>
                <Button type="primary"> Star </Button>
                <Button type="primary"> Edit </Button>
              </Space>
            </Col>
          </Row>
        </Col>

        <Col span={24}>
          <ul>
            {dashboards.map((dash, index) => {
              return (
                <li key={index} style={{ position: 'relative' }}>
                  <Rnd
                    style={{ backgroundColor: 'gray' }}
                    default={{
                      width: dash.width,
                      height: dash.height,
                      x: dash.x,
                      y: dash.y,
                    }}
                    resizeGrid={[20, 30]}
                    dragGrid={[20, 30]}
                  >
                    {dash.chart}
                  </Rnd>
                </li>
              );
            })}
          </ul>

          {/* <Rnd
            style={{ backgroundColor: 'gray' }}
            default={{
              width: 200,
              height: 200,
              x: 0,
              y: 0,
            }}
            resizeGrid={[20, 30]}
            dragGrid={[20, 30]}
          >
            001
          </Rnd>

          <Rnd

            style={{ backgroundColor: 'gray' }}
            default={{
              width: 200,
              height: 200,
              x: 0,
              y: 0,
            }}
            resizeGrid={[20, 30]}
            dragGrid={[20, 30]}
          >
            002
          </Rnd> */}
        </Col>
      </Row>
    </>
  );
};

export default CreationDashboard;
