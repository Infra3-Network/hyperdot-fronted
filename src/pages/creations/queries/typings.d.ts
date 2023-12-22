/**
 * Namespace for chart-related interfaces.
 */
declare namespace QE {
  /**
   * Properties of a tab.
   * @interface TabProps
   * @property {number | undefined} id - Optional identifier for the tab.
   * @property {string} name - Name of the tab.
   * @property {string} children - Content of the tab.
   * @property {boolean} closeable - Indicates whether the tab is closeable.
   * @property {any | undefined} config - Optional configuration for the tab.
   */
  interface TabProps {
    id?: number;
    name: string;
    children: string;
    closeable: boolean;
    config?: any;
  }

  /**
   * Structure representing an array of tabs.
   * @interface TabArray
   * @property {number} id - Identifier for the array of tabs.
   * @property {TabProps[]} tabs - Array of TabProps representing individual tabs.
   */
  interface TabArray {
    id: number;
    tabs: TabProps[];
  }

  /**
   * Parameters for saving a chart.
   * @interface ChartSaveParams
   * @property {string} name - Name of the chart.
   * @property {any} config - Configuration for the chart.
   */
  interface ChartSaveParams {
    name: string;
    config: any;
  }

  /**
   * Properties of a chart tab.
   * @interface ChartTabProps
   * @property {number} id - Identifier for the chart tab.
   * @property {any} queryData - Data related to the query.
   * @property {any} tabProps - Properties of the tab.
   * @property {any} setTabProps - Function to set tab properties.
   * @property {any} setTabActiveKey - Function to set the active tab key.
   * @property {any | undefined} name - Optional name for the chart tab.
   * @property {any | undefined} config - Optional configuration for the chart tab.
   */
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
