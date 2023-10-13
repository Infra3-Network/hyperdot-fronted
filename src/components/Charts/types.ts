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
  // params: ChartParams;
  params: HYPERDOT_API.Chart;
  data: ChartData;
  manager: ChartManager;
};

export type ChartArray = {
  nextIndex: number;
  // charts: ChartParams[];
  charts: HYPERDOT_API.Chart[];
};

export class ChartManager {
  private charts: ChartArray;
  private setCharts: React.Dispatch<React.SetStateAction<ChartArray>>;

  constructor(charts: ChartArray, setCharts: React.Dispatch<React.SetStateAction<ChartArray>>) {
    this.charts = charts;
    this.setCharts = setCharts;
  }

  reset(charts: HYPERDOT_API.Chart[]) {
    const maxIndex = charts.reduce(
      (max, obj) => (obj.index ? (obj.index > max ? obj.index : max) : max),
      1,
    );
    this.setCharts({
      nextIndex: maxIndex + 1,
      charts: charts,
    });
  }
  clear() {
    this.setCharts({
      nextIndex: 1,
      charts: [],
    });
  }

  get(id: number) {
    return this.charts.charts.find((v: HYPERDOT_API.Chart) => v.id === id);
  }

  add(chart: HYPERDOT_API.Chart) {
    this.setCharts((prev) => {
      prev.nextIndex += 1;
      chart.index = prev.nextIndex;
      prev.charts.push(chart);
      return prev;
    });
  }

  update(newChart: HYPERDOT_API.Chart) {
    const index = this.charts.charts.findIndex(
      (v: HYPERDOT_API.Chart) => v.index === newChart.index,
    );
    if (!index) {
      return;
    }
    this.charts.charts[index] = newChart;
    this.setCharts({ ...this.charts });
  }

  remove(index: number) {
    this.setCharts((prev) => {
      const newCharts = prev.charts.filter((v: HYPERDOT_API.Chart) => v.index !== index);
      return {
        nextIndex: prev.nextIndex,
        charts: newCharts,
      };
    });
  }

  getNextIndex(): number {
    return this.charts.nextIndex;
  }

  getCharts(): HYPERDOT_API.Chart[] {
    return this.charts.charts;
  }

  getByName(name: string) {
    return this.charts.charts.find((v: HYPERDOT_API.Chart) => v.name === name);
  }

  insertLastBefore(chart: HYPERDOT_API.Chart) {
    this.setCharts((prev) => {
      if (prev.charts.length === 0) {
        this.add(chart);
        return prev;
      }

      prev.nextIndex += 1;
      chart.index = prev.nextIndex;
      const index = prev.charts.length - 1;
      const newArray = [...prev.charts];
      newArray.splice(index, 0, chart);
      prev.charts = newArray;
      return prev;
    });
  }
}
