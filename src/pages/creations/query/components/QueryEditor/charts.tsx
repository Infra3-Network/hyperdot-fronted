import { Row, Col, Select, message } from 'antd';
import React, { useState } from 'react';
import { Line, Area, Scatter, Column, Pie } from '@ant-design/charts';
import { BorderOutlined } from '@ant-design/icons';

interface AreaChartConfig {
  data: any;
  xField: string;
  yField: string;
  areaStyle: any;
}

export const AreaChartTab = ({ queryData }: any) => {
  const schemas: any[] = queryData.schemas;
  const x = schemas[0].name as string;
  const y = schemas[1].name as string;
  const [areaConfig, setConfig] = React.useState<AreaChartConfig>({
    data: queryData.rows,
    xField: x,
    yField: y,
    areaStyle: () => {
      return {
        fill: 'l(270) 0:#ffffff 0.5:#7ec2f3 1:#1890ff',
      };
    },
  });

  if (schemas.length < 2) {
    message.error('Line chart need at least 2 columns');
    return null;
  }

  const handleCloumnSelect = (value: any, col: string) => {
    console.log('select = ', value, 'column = ', col);
    if (col == 'x') {
      setConfig({ ...areaConfig, xField: value });
      console.log('area config = ', areaConfig);
    }
    if (col == 'y') {
      setConfig({ ...areaConfig, yField: value });
      console.log('area config = ', areaConfig);
    }
  };

  const columns = queryData.schemas.map((value: any) => {
    return {
      value: value.name,
      label: value.name,
    };
  });

  return (
    <>
      <Row gutter={24}>
        <Col span={24}>
          <div
            style={{
              height: '400px',
              width: '100%',
              border: '1px solid',
              borderColor: 'red',
            }}
          >
            <Area {...areaConfig} />
          </div>
        </Col>
      </Row>

      <Row gutter={24} style={{ paddingTop: '12px' }}>
        <Col span={24}>
          <div
            style={{
              height: '400px',
              width: '100%',
              border: '1px solid',
              borderColor: 'red',
            }}
          >
            <>
              <Row>
                <Col span={8} style={{ background: '#f5f5f5' }}>
                  <Row>
                    <Col>
                      <div>Result data</div>
                    </Col>
                  </Row>

                  <Row gutter={[0, 2]} style={{ margin: '12px' }}>
                    <Col span={24} style={{ background: 'white', padding: '8px 0 2px 8px' }}>
                      <Row>
                        <Col span={6}>
                          <div style={{}}>X column</div>
                        </Col>

                        <Col span={16}>
                          <Select
                            defaultValue={x}
                            bordered={false}
                            style={{ width: '100%' }}
                            options={columns}
                            onSelect={(value) => {
                              handleCloumnSelect(value, 'x');
                            }}
                          />
                        </Col>
                      </Row>
                    </Col>

                    <Col span={24} style={{ background: 'white', padding: '8px 0 2px 8px' }}>
                      <Row>
                        <Col span={6}>
                          <div style={{}}>Y column</div>
                        </Col>

                        <Col span={16}>
                          <Select
                            defaultValue={y}
                            bordered={false}
                            style={{ width: '100%' }}
                            options={columns}
                            onSelect={(value) => {
                              handleCloumnSelect(value, 'y');
                            }}
                          />
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                </Col>
                <Col span={8}>b</Col>
                <Col span={8}>c</Col>
              </Row>
            </>
          </div>
        </Col>
      </Row>
    </>
  );
};

export const LineChartTab = ({ queryData }: any) => {
  const schemas: any[] = queryData.schemas;
  if (schemas.length < 2) {
    message.error('Line chart need at least 2 columns');
    return null;
  }
  const xField: string = () => {
    return schemas[0].name;
  };

  const yField: string = () => {
    return schemas[1].name;
  };

  const data: any = queryData.rows;

  const config = {
    data,
    xField: xField(),
    yField: yField(),

    animation: {
      appear: {
        animation: 'path-in',
        duration: 500,
      },
    },
    tooltip: {
      showMarkers: false,
    },
    point: {
      shape: 'breath-point',
    },
  };
  return <Line {...config} />;
};

interface ScatterChartConfig {}

export const ScatterChartTab = ({ queryData }: any) => {
  const schemas: any[] = queryData.schemas;
  if (schemas.length < 3) {
    message.error('Line chart need at least 2 columns');
    return null;
  }
  const xField: string = () => {
    return schemas[0].name;
  };

  const yField: string = () => {
    return schemas[1].name;
  };

  const zField: string = () => {
    return schemas[2].name;
  };

  const data: any = queryData.rows;
  const config = {
    appendPadding: 30,
    data,
    xField: xField(),
    yField: yField(),
    size: 5,
    colorField: zField(),
    yAxis: {
      nice: true,
      line: {
        style: {
          stroke: '#aaa',
        },
      },
    },
    xAxis: {
      min: -100,
      grid: {
        line: {
          style: {
            stroke: '#eee',
          },
        },
      },
      line: {
        style: {
          stroke: '#aaa',
        },
      },
    },
  };

  return <Scatter {...config} />;
};
