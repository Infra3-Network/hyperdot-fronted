import { AndroidOutlined, AppleOutlined } from '@ant-design/icons';
import { Tabs } from 'antd';

const QueryVisualization = () => {
  return (
    <div>
      <Tabs
        defaultActiveKey="2"
        items={[AppleOutlined, AndroidOutlined].map((Icon, i) => {
          const id = String(i + 1);

          return {
            label: (
              <span>
            <Icon />
            Tab {id}
          </span>
            ),
            key: id,
            children: `Tab ${id}`,
          };
        })}
      />
    </div>
  )
}

export default QueryVisualization
