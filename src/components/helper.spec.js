import { helperDateToString } from './helper'

describe('helperDateToString', () => {
  it('formats a date without showing days', () => {
    const datetime = new Date('2023-10-17T12:34:56Z')
    const formattedDate = helperDateToString(datetime, false)
    expect(formattedDate).toBe('14:34:56')
  })

  it('formats a date showing days', () => {
    const datetime = new Date('2023-10-17T12:34:56Z')
    const formattedDate = helperDateToString(datetime, true)
    expect(formattedDate).toBe('17.10., 14:34:56')
  })
})
