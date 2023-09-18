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

  interface EditorSaveParams {
    query: string;
    queryEngine: string;
    charts: TabProps[];
  }

  interface ChartTabProps {
    id: number;
    queryData: any;
    setEditorSave: any;
    tabProps: any;
    setTabProps: any;
    setTabActiveKey: any;
  }
}
