---
title: Business Components
sidemenu: false
---

> This feature is provided by [dumi](https://d.umijs.org/en-US/guide/advanced#umi-project-structured-mode). Dumi is a 📖 documentation tool designed for component development scenarios, and those who have used it speak highly of it.

# Business Components

Here are all the components used in Pro, which are not suitable as a component library but are actually needed in business scenarios. So we have prepared this documentation to guide you on whether to use these components.

## Footer Component

This component comes with some Pro configurations, and you generally need to customize its information.

```tsx
/**
 * background: '#f0f2f5'
 */
import React from 'react';
import Footer from '@/components/Footer';

export default () => <Footer />;
```

## HeaderDropdown Header Dropdown List

HeaderDropdown is a wrapper for antd Dropdown, but with added special handling for mobile devices. The usage is the same as well.

```tsx
/**
 * background: '#f0f2f5'
 */
import { Button, Menu } from 'antd';
import React from 'react';
import HeaderDropdown from '@/components/HeaderDropdown';

export default () => {
  const menuHeaderDropdown = (
    <Menu selectedKeys={[]}>
      <Menu.Item key="center">Personal Center</Menu.Item>
      <Menu.Item key="settings">Personal Settings</Menu.Item>
      <Menu.Divider />
      <Menu.Item key="logout">Log Out</Menu.Item>
    </Menu>
  );
  return (
    <HeaderDropdown overlay={menuHeaderDropdown}>
      <Button>Show Menu on Hover</Button>
    </HeaderDropdown>
  );
};
```

## HeaderSearch Header Search Box

An input box with autocomplete data, supporting collapsing and expanding input.

```tsx
/**
 * background: '#f0f2f5'
 */
import { Button, Menu } from 'antd';
import React from 'react';
import HeaderSearch from '@/components/HeaderSearch';

export default () => {
  return (
    <HeaderSearch
      placeholder="Site Search"
      defaultValue="umi ui"
      options={[
        { label: 'Ant Design Pro', value: 'Ant Design Pro' },
        {
          label: 'Ant Design',
          value: 'Ant Design',
        },
        {
          label: 'Pro Table',
          value: 'Pro Table',
        },
        {
          label: 'Pro Layout',
          value: 'Pro Layout',
        },
      ]}
      onSearch={(value) => {
        console.log('input', value);
      }}
    />
  );
};
```

## NoticeIcon Notification Tool

The NoticeIcon provides an interface for displaying various notification messages.

```tsx
/**
 * background: '#f0f2f5'
 */
import { message } from 'antd';
import React from 'react';
import NoticeIcon from '@/components/NoticeIcon/NoticeIcon';

export default () => {
  const list = [
    {
      id: '000000001',
      avatar: 'https://gw.alipayobjects.com/zos/rmsportal/ThXAXghbEsBCCSDihZxY.png',
      title: 'You received 14 new weekly reports',
      datetime: '2017-08-09',
      type: 'notification',
    },
    {
      id: '000000002',
      avatar: 'https://gw.alipayobjects.com/zos/rmsportal/OKJXDXrmkNshAMvwtvhu.png',
      title: 'The candidate you recommended, Qu Nini, has passed the third-round interview',
      datetime: '2017-08-08',
      type: 'notification',
    },
  ];
  return (
    <NoticeIcon
      count={10}
      onItemClick={(item) => {
        message.info(`${item.title} has been clicked`);
      }}
      onClear={(title: string, key: string) => message.info('Clicked on Clear More')}
      loading={false}
      clearText="Clear"
      viewMoreText="View More"
      onViewMore={() => message.info('Clicked on View More')}
      clearClose
    >
      <NoticeIcon.Tab
        tabKey="notification"
        count={2}
        list={list}
        title="Notifications"
        emptyText="You have viewed all notifications"
        showViewMore
      />
      <NoticeIcon.Tab
        tabKey="message"
        count={2}
        list={list}
        title="Messages"
        emptyText="You have read all messages"
        showViewMore
      />
      <NoticeIcon.Tab
        tabKey="event"
        title="To-Do"
        emptyText="You have completed all to-dos"
        count={2}
        list={list}
        showViewMore
      />
    </NoticeIcon>
  );
};
```

### NoticeIconData

```tsx
export interface NoticeIconData {
  id: string;
  key: string;
  avatar: string;
  title: string;
  datetime: string;
  type: string;
  read?: boolean;
  description: string;
  clickClose?: boolean;
  extra: any;
  status: string;
}
```

## RightContent

RightContent is a combination of the above components, with the addition of the SelectLang plugin in plugins.

```tsx
<Space>
  <HeaderSearch
    placeholder="Site Search"
    defaultValue="umi ui"
    options={[
      { label: <a href="https://umijs.org/en/guide/umi-ui.html">umi ui</a>, value: 'umi ui' },
      {
        label: <a href="next.ant.design">Ant Design</a>,
        value: 'Ant Design',
      },
      {
        label: <a href="https://protable.ant.design/">Pro Table</a>,
        value: 'Pro Table',
      },
      {
        label: <a href="https://prolayout.ant.design/">Pro Layout</a>,
        value: 'Pro Layout',
      },
    ]}
  />
  <Tooltip title="Documentation">
    <span
      className={styles.action}
      onClick={() => {
        window.location.href = 'https://pro.ant.design/docs/getting-started';
      }}
    >
      <QuestionCircleOutlined />
    </span>
  </Tooltip>
  <Avatar />
  {REACT_APP_ENV && (
    <span>
      <Tag color={ENVTagColor[REACT_APP_ENV]}>{REACT_APP_ENV}</Tag>
    </span>
  )}
  <SelectLang className={styles.action} />
</Space>
```
