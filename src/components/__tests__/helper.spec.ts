import { describe, it, expect } from 'vitest'
import { helperDateToString, helperSecondsToString } from '../helper'

describe('helperDateToString', () => {
  it('time without showing days', () => {
    const datetime = new Date('2023-10-17T12:34:56Z')
    const formattedDate = helperDateToString(datetime, false)
    expect(formattedDate).toBe('14:34:56')
  })

  it('date with showing days', () => {
    const datetime = new Date('2023-10-17T12:34:56Z')
    const formattedDate = helperDateToString(datetime, true)
    expect(formattedDate).toBe('17.10., 14:34:56')
  })
})

describe('helperSecondsToString', () => {
  it('>1day', () => {
    const totalSeconds = 100000
    const formattedDate = helperSecondsToString(totalSeconds)
    expect(formattedDate).toBe('1d 3h 46m')
  })
  it('>1h', () => {
    const totalSeconds = 4000
    const formattedDate = helperSecondsToString(totalSeconds)
    expect(formattedDate).toBe('1h 6m')
  })
  it('>15min', () => {
    const totalSeconds = 1000
    const formattedDate = helperSecondsToString(totalSeconds)
    expect(formattedDate).toBe('16m')
  })
  it('>1min', () => {
    const totalSeconds = 100
    const formattedDate = helperSecondsToString(totalSeconds)
    expect(formattedDate).toBe('1m 40s')
  })
  it('<=1min', () => {
    const totalSeconds = 59
    const formattedDate = helperSecondsToString(totalSeconds)
    expect(formattedDate).toBe('59s')
  })
})