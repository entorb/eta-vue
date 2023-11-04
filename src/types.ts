export type UnitType = 'sec' | 'min' | 'hour' | 'day'

export interface DataRowType {
  date: Date
  items: number
  speed: number // in items per sec
}

export interface DataRowRedType {
  date: Date
  items: number
}

export interface StatsDataType {
  accesscounts: number
  accesscounts7: number
  firstaccess: string // 2023-11-03
}
