declare namespace QE {
  interface TabProps {
    id?: number;
    name: string;
    // icon: string;
    children: string;
    // icon: React.ReactNode;
    // children: (props: QE.ChartTabProps) => React.ReactNode;
    closeable: boolean;
    config?: any;
  }

  interface TabArray {
    id: number;
    tabs: TabProps[];
  }

  interface ChartSaveParams {
    name: string;
    config: any;
  }

  interface ChartTabProps {
    id: number;
    queryData: any;
    tabProps: any;
    setTabProps: any;
    setTabActiveKey: any;
    name?: any;
    config?: any;
  }
}
