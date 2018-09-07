import moment from 'moment'

export const dateToYear = date => moment(date).format('YYYY.MMM')
export const dateToMonth = date => moment(date).format('MMM/Do')
export const dateToWeek = date => moment(date).format('ddd')
export const dateToDay = date => moment(date).format('Do-HH')
export const dateToHour = date => moment(date).format('HH:mm')