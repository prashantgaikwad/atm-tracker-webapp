import winston from 'winston';
import Winston from 'winston';
import fs from 'fs';
Winston.emitErrs = true;
const HOME = '/home/ubuntu';
let path = HOME;
const filename = `${path}/server.log`;
try {
  if (!fs.existsSync(path)) {
    fs.mkdirSync(path);
  }
} catch (ex) {
  path = '';
  console.log(ex);
}
let logLevel = 'debug';
const Logger = new Winston.Logger({
  transports: [
    new Winston.transports.File({
      level: logLevel,
      filename,
      handleExceptions: true,
      json: true,
      maxsize: 5242880,
      maxFiles: 5,
      colorize: false,
      timestamp: () => ((new Date()).toLocaleString()),
    }),
    new Winston.transports.Console({
      level: logLevel,
      handleExceptions: true,
      json: false,
      colorize: true,
    }),
  ],
  exitOnError: false,
});
export default Logger;
