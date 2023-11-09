import { Settings as LayoutSettings } from '@ant-design/pro-layout';

const Settings: LayoutSettings & {
  pwa?: boolean;
  logo?: string;
} = {
  navTheme: 'light',
  primaryColor: '#2F54EB',
  layout: 'top',
  contentWidth: 'Fluid',
  fixedHeader: true,
  fixSiderbar: true,
  footerRender: false,
  menuRender: false,
  pwa: false,
  logo: '/hyper64.svg',
  headerHeight: 44,
  title: 'dot',
  splitMenus: true,
};

export default Settings;
