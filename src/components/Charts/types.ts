export type ChartNodeProps = {
  name: string;
  icon: React.ReactNode;
  children: (props: ChartProps, index: number) => React.ReactNode;
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
  // nextIndex: number;
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
    // const maxIndex = charts.reduce(
    //   (max, obj) => (obj.index ? (obj.index > max ? obj.index : max) : max),
    //   1,
    // );
    this.setCharts({
      // nextIndex: maxIndex + 1,
      charts: charts,
    });
  }
  clear() {
    this.setCharts({
      // nextIndex: 1,
      charts: [],
    });
  }

  get(index: number) {
    return this.charts.charts[index];
  }

  add(chart: HYPERDOT_API.Chart) {
    this.setCharts((prev) => {
      return {
        charts: [...prev.charts, chart],
      };
    });
  }

  update(newChart: HYPERDOT_API.Chart, index: number) {
    this.charts.charts[index] = newChart;
    this.setCharts({ ...this.charts });
  }

  remove(index: number) {
    this.setCharts((prev) => {
      // remove charts at index
      return {
        charts: prev.charts.filter((v, i) => i !== index),
      };
    });
  }

  getNextIndex(): number {
    return this.charts.charts.length;
  }

  getCharts(): HYPERDOT_API.Chart[] {
    return this.charts.charts;
  }

  getByName(name: string) {
    return this.charts.charts.find((v: HYPERDOT_API.Chart) => v.name === name);
  }

  insertLastBefore(chart: HYPERDOT_API.Chart) {
    console.log('insertLastBefore = ', chart);
    this.setCharts((prev) => {
      if (prev.charts.length === 0) {
        this.add(chart);
        return prev;
      }

      const index = prev.charts.length - 1;
      const newArray = [...prev.charts];
      newArray.splice(index, 0, chart);
      console.log('insertLastBefore charts = ', newArray);
      return {
        charts: newArray,
      };
    });
  }
}
