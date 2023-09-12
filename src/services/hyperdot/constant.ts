export const hyperdot: any = {
  endpoint: 'http://127.0.0.1:3030',
};

export const getUrl = (url: string) => {
  return `${hyperdot.endpoint}${url}`;
};
