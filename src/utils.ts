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
