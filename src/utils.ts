/**
 * Utility function to format a number with commas.
 * @function
 * @param {number} num - Number to be formatted.
 * @returns {string} - Formatted number as a string with commas.
 */
export const formatNumberWithCommas = (num: number): string => {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

/**
 * Utility function to parse and convert a CSS string (e.g., "100px", "2rem", "50%", "auto") into a numeric value.
 * @function
 * @param {string} width - CSS string representing width or height.
 * @param {string} what - String indicating whether it's width or height.
 * @returns {number | undefined} - Parsed numeric value.
 */
export const parseWindowString = (width: string, what: string): number | undefined => {
  const match = width.match(/(\d+(\.\d+)?)(px|rem|%|auto)?/);

  if (match) {
    const numericValue = parseFloat(match[1]);

    if (!match[3] || match[3] === 'px') {
      return numericValue;
    }

    if (match[3] === 'rem') {
      const baseFontSize = 16;
      return numericValue * baseFontSize;
    }

    if (match[3] === '%') {
      const parentWidth = what === 'width' ? window.innerWidth : window.innerHeight;
      return (numericValue / 100) * parentWidth;
    }

    if (match[3] === 'auto') {
      return 100;
    }
  }

  return undefined;
};

/**
 * Utility function to format a timestamp as a human-readable time ago.
 * @function
 * @param {string} timestamp - String representing a timestamp.
 * @returns {string} - Human-readable time ago.
 */
export const formatTimeAgo = (timestamp: string): string => {
  if (!timestamp) {
    return 'unkown';
  }

  const now = new Date();
  const date = new Date(timestamp);
  const timeDifference = now.getTime() - date.getTime();

  function getTimeAgo(timeDiff: number, unit: string): string {
    const rounded = Math.round(timeDiff);
    return `${rounded} ${unit}${rounded !== 1 ? 's' : ''} ago`;
  }

  if (timeDifference < 60000) {
    return getTimeAgo(timeDifference / 1000, 'second');
  } else if (timeDifference < 3600000) {
    return getTimeAgo(timeDifference / 60000, 'minute');
  } else if (timeDifference < 86400000) {
    return getTimeAgo(timeDifference / 3600000, 'hour');
  } else if (timeDifference < 2592000000) {
    return getTimeAgo(timeDifference / 86400000, 'day');
  } else if (timeDifference < 31536000000) {
    return getTimeAgo(timeDifference / 2592000000, 'month');
  } else {
    return getTimeAgo(timeDifference / 31536000000, 'year');
  }
};

/**
 * Utility function to format a timestamp as a human-readable time ago.
 * @function
 * @param {string} timestamp - String representing a timestamp.
 * @returns {string} - Human-readable time ago.
 */
export const isEmail = (account: string): boolean => {
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

  return emailRegex.test(account);
};

/** Constant string used as a loading tip. */
export const LoadingTip = 'Loading...';
