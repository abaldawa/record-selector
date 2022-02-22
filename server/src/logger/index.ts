/**
 * @author: abhijit.baldawa
 *
 * Standard logger module using winston
 */

import { createLogger, format, transports } from 'winston';

const { Console } = transports;
const { combine, timestamp, printf, colorize } = format;

export default createLogger({
  level: 'info',
  format: combine(
    timestamp(),
    colorize(),
    printf((logObj) => `${logObj.timestamp} ${logObj.level}: ${logObj.message}`)
  ),
  transports: [new Console()],
});
