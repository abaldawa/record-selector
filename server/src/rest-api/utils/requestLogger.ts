/**
 * @author: abhijit.baldawa
 */

import { StatusCodes } from 'http-status-codes';
import logger from '../../logger';

/**
 * @private
 *
 * Given ex. 400 returns '4.x.x'
 *
 * @param statusCode
 */
const convertStatusCodeToStr = (statusCode: StatusCodes) => {
  const statusCodeStr = `${statusCode}`;
  return [
    statusCodeStr[0],
    ...statusCodeStr
      .slice(1)
      .split('')
      .map(() => 'x'),
  ].join('.');
};

/**
 * @public
 *
 * Logs the request with appropriate loglevel based on statusCode
 *
 * @param method
 * @param PATH_URL
 * @param statusCode
 * @param responseTimeInMs
 * @param customMessage
 */
const logRequest = (
  method: string,
  PATH_URL: string,
  statusCode: StatusCodes,
  responseTimeInMs: number,
  customMessage?: string
) => {
  const statusCodePattern = convertStatusCodeToStr(statusCode);
  let logLevel: 'warn' | 'info' | 'error';

  switch (statusCodePattern) {
    case '5.x.x':
      logLevel = 'error';
      break;
    case '4.x.x':
      logLevel = 'warn';
      break;
    case '2.x.x':
    default:
      logLevel = 'info';
  }

  logger[logLevel](
    `(${statusCode}) ${method} ${PATH_URL} ${responseTimeInMs}ms${
      customMessage ? ` (${customMessage})` : ''
    }`
  );
};

export { logRequest };
