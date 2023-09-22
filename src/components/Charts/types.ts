export type AreaChartConfig = {
  data: any[];
  xField: string;
  yField: string;
  seriesField?: string;
  areaStyle?: any;
  xAxis?: any;
  yAxis?: any;
};

export type ChartNodeProps = {
  name: string;
  icon: React.ReactNode;
  children: (props: ChartProps) => React.ReactNode;
};

export type ChartData = {
  schemas: any[];
  rows: any[];
};

export type ChartParams = {
  id?: number;
  name: string;
  config?: any;
  type: string;
  closeable: boolean;
};

export type ChartProps = {
  params: ChartParams;
  data: ChartData;
  manager: ChartManager;
};

export type ChartArray = {
  id: number;
  charts: ChartParams[];
};

export class ChartManager {
  private charts: ChartArray;
  private setCharts: React.Dispatch<React.SetStateAction<ChartArray>>;

  constructor(charts: ChartArray, setCharts: React.Dispatch<React.SetStateAction<ChartArray>>) {
    this.charts = charts;
    this.setCharts = setCharts;
  }

  reset(charts: ChartParams[]) {
    const maxId = charts.reduce((max, obj) => (obj.id ? (obj.id > max ? obj.id : max) : max), 1);
    this.setCharts({
      id: maxId + 1,
      charts: charts,
    });
  }

  get(id: number) {
    return this.charts.charts.find((v: ChartParams) => v.id === id);
  }

  add(chart: ChartParams) {
    this.setCharts((prev) => {
      prev.id += 1;
      chart.id = prev.id;
      prev.charts.push(chart);
      return prev;
    });
  }

  update(newChart: ChartParams) {
    const index = this.charts.charts.findIndex((v: ChartParams) => v.id === newChart.id);
    if (!index) {
      return;
    }
    this.charts.charts[index] = newChart;
    this.setCharts({ ...this.charts });
  }

  remove(id: number) {
    this.setCharts((prev) => {
      const newCharts = prev.charts.filter((v: ChartParams) => v.id !== id);
      return {
        id: prev.id,
        charts: newCharts,
      };
    });
  }

  getId(): number {
    return this.charts.id;
  }

  getCharts(): ChartParams[] {
    return this.charts.charts;
  }

  getByName(name: string) {
    return this.charts.charts.find((v: ChartParams) => v.name === name);
  }

  insertLastBefore(chart: ChartParams) {
    this.setCharts((prev) => {
      if (prev.charts.length === 0) {
        this.add(chart);
        return prev;
      }

      prev.id += 1;
      chart.id = prev.id;
      const index = prev.charts.length - 1;
      const newArray = [...prev.charts];
      newArray.splice(index, 0, chart);
      prev.charts = newArray;
      return prev;
    });
  }
}
