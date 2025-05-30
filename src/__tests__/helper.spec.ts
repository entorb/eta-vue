import { describe, it, expect } from 'vitest'
import {
  helperCalcSpeedFromPreviousRow,
  helperClearName,
  helperDateToIsoString,
  helperDateToString,
  helperSecondsToString,
  helperValidateItemsInput,
  helperValueToString
} from '../helper'

describe('helperDateToString', () => {
  it('time without showing days', () => {
    const datetime = new Date('2023-10-17T12:34:56Z')
    const formattedDate = helperDateToString(datetime, false)
    expect(formattedDate).toBe('14:34:56')
  })

  it('date with showing days', () => {
    const datetime = new Date('2023-10-17T12:34:56Z')
    const formattedDate = helperDateToString(datetime, true)
    expect(formattedDate).toBe('17.10., 14:34')
  })
})

describe('helperDateToIsoString', () => {
  it('summer time', () => {
    const datetime = new Date('2023-06-17T12:34:56Z')
    const formattedDate = helperDateToIsoString(datetime)
    expect(formattedDate).toBe('2023-06-17T14:34:56')
  })
  it('winter time', () => {
    const datetime = new Date('2023-12-17T12:34:56Z')
    const formattedDate = helperDateToIsoString(datetime)
    expect(formattedDate).toBe('2023-12-17T13:34:56')
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

describe('helperValidateItemsInput', () => {
  it('various values', () => {
    expect(helperValidateItemsInput('123')).toBe(true)
    expect(helperValidateItemsInput('123.1')).toBe(true)
    expect(helperValidateItemsInput('123,1')).toBe(true)
    expect(helperValidateItemsInput('abc')).toBe(false)
    expect(helperValidateItemsInput('a123')).toBe(false)
    // expect(helperValidateItemsInput('123a')).toBe(false)
  })
})

describe('helperValueToString', () => {
  it('various values', () => {
    expect(helperValueToString(1)).toBe('1.00')
    expect(helperValueToString(100)).toBe('100')
    expect(helperValueToString(10000)).toBe('10000')
    expect(helperValueToString(0.1)).toBe('0.100')
    expect(helperValueToString(0.123)).toBe('0.123')
  })
})

describe('helperCalcSpeedFromPreviousRow', () => {
  it('120 in 1min', () => {
    const prevRow = { date: new Date('2023-01-01 01:01:01'), items: 10 }
    const row = { date: new Date('2023-01-01 01:02:01'), items: 130 }
    expect(helperCalcSpeedFromPreviousRow(row, prevRow)).toBe(2.0)
  })
})

describe('helperClearName', () => {
  it('120 in 1min', () => {
    const prevRow = { date: new Date('2023-01-01 01:01:01'), items: 10 }
    const row = { date: new Date('2023-01-01 01:02:01'), items: 130 }
    expect(helperCalcSpeedFromPreviousRow(row, prevRow)).toBe(2.0)
  })
})

describe('clearName', () => {
  it('spaces', () => {
    expect(helperClearName(' ab c ')).toBe('ab c')
  })
  it(':', () => {
    expect(helperClearName('a:b::c d')).toBe('abc d')
  })
  it('slashes', () => {
    expect(helperClearName('a//b||c\\\\d')).toBe('abcd')
  })
  it('quotations', () => {
    expect(helperClearName('abcd')).toBe('abcd')
  })
  it('brackets', () => {
    expect(helperClearName('a()b[]c{}d')).toBe('abcd')
  })
})
