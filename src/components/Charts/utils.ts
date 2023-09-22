import { type ChartData } from './types';

export const getColumns = (queryData: ChartData) => {
  return queryData.schemas.map((value: any) => {
    return {
      value: value.name,
      label: value.name,
    };
  });
};
