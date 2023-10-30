export const formatNumberWithCommas = (num: number): string => {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

export const parseWindowString = (width: string, what: string): number | undefined => {
  // 使用正则表达式匹配字符串中的数字和单位
  const match = width.match(/(\d+(\.\d+)?)(px|rem|%|auto)?/);

  if (match) {
    // 如果有匹配的数字部分，将其转换为浮点数
    const numericValue = parseFloat(match[1]);

    // 如果没有单位或单位为 'px'，则直接返回该值
    if (!match[3] || match[3] === 'px') {
      return numericValue;
    }

    // 如果单位为 'rem'，需要将其转换为像素（根据基准字体大小）
    if (match[3] === 'rem') {
      // 请根据你的项目中的基准字体大小替换这里的值
      const baseFontSize = 16; // 假设基准字体大小为 16px
      return numericValue * baseFontSize;
    }

    // 如果单位为 '%'，需要将其转换为像素（相对于父元素的百分比）
    if (match[3] === '%') {
      // 请根据你的实际需求和父元素的宽度替换这里的值
      const parentWidth = what === 'width' ? window.innerWidth : window.innerHeight; // 假设父元素宽度为100px
      return (numericValue / 100) * parentWidth;
    }

    // 如果单位为 'auto'，你可以根据需要返回适当的值
    if (match[3] === 'auto') {
      // 返回适当的值，例如默认宽度
      return 100; // 假设默认宽度为100px
    }
  }

  // 如果字符串无法解析，返回 undefined 或其他适当的默认值
  return undefined;
};

export const formatTimeAgo = (timestamp: string): string => {
  if (!timestamp) {
    return 'unkown';
  }

  const now = new Date();
  const date = new Date(timestamp);
  const timeDifference = now.getTime() - date.getTime();

  // 辅助函数，将时间差转换为不同单位
  function getTimeAgo(timeDiff: number, unit: string): string {
    const rounded = Math.round(timeDiff);
    return `${rounded} ${unit}${rounded !== 1 ? 's' : ''} ago`;
  }

  if (timeDifference < 60000) {
    // 不到一分钟
    return getTimeAgo(timeDifference / 1000, 'second');
  } else if (timeDifference < 3600000) {
    // 不到一小时
    return getTimeAgo(timeDifference / 60000, 'minute');
  } else if (timeDifference < 86400000) {
    // 不到一天
    return getTimeAgo(timeDifference / 3600000, 'hour');
  } else if (timeDifference < 2592000000) {
    // 不到一个月 (30 天)
    return getTimeAgo(timeDifference / 86400000, 'day');
  } else if (timeDifference < 31536000000) {
    // 不到一年 (365 天)
    return getTimeAgo(timeDifference / 2592000000, 'month');
  } else {
    // 大于一年
    return getTimeAgo(timeDifference / 31536000000, 'year');
  }
};

export const isEmail = (account: string): boolean => {
  // 使用正则表达式匹配电子邮件地址的模式
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

  // 使用正则表达式的 test 方法来检查字符串是否匹配模式
  return emailRegex.test(account);
};

export const LoadingTip = 'Loading...';
