export type UnitType = 'sec' | 'min' | 'hour' | 'day'

export interface DataRowType {
  date: Date
  value: number
  speed: number // in items per sec
}

export interface DataRowRedType {
  date: Date
  value: number
}
