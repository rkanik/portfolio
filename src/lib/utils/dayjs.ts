import d from 'dayjs'
import utc from 'dayjs/plugin/utc'
import relativeTime from 'dayjs/plugin/relativeTime'

d.extend(utc)
d.extend(relativeTime)

export default d
