const dayjs = require('dayjs')
const utc = require('dayjs/plugin/utc')
dayjs.extend(utc)
const HOUR_MINUTE_SECOND = 'YYYY-MM-DD HH:mm:ss'
function timeFormat(utc, format = HOUR_MINUTE_SECOND) {
  return dayjs.utc(utc).utcOffset(8).format(format)
}
module.exports = timeFormat
